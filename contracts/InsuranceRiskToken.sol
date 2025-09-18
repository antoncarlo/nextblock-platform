// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title InsuranceRiskToken
 * @dev ERC20 token representing fractional ownership of insurance risk portfolios
 * Implements compliance features, automated premium distribution, and risk-based pricing
 */
contract InsuranceRiskToken is ERC20, ERC20Permit, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant RISK_MANAGER_ROLE = keccak256("RISK_MANAGER_ROLE");

    struct InsurancePool {
        string name;
        string description;
        uint256 totalRiskValue;
        uint256 premiumRate; // Annual premium rate in basis points (10000 = 100%)
        uint256 riskScore; // Risk score from 1-100
        uint256 maturityDate;
        bool isActive;
        address riskProvider; // Insurance company
    }

    struct InvestorProfile {
        bool isKYCVerified;
        bool isAccredited;
        uint256 riskTolerance; // 1-10 scale
        uint256 totalInvested;
        uint256 lastInvestmentDate;
        string jurisdiction;
    }

    // Pool management
    mapping(uint256 => InsurancePool) public insurancePools;
    mapping(address => InvestorProfile) public investorProfiles;
    mapping(address => mapping(uint256 => uint256)) public investorPoolBalances;
    mapping(uint256 => uint256) public poolTotalSupply;
    
    uint256 public nextPoolId = 1;
    uint256 public totalValueLocked;
    uint256 public constant MIN_INVESTMENT = 1000 * 10**18; // $1,000 minimum
    uint256 public constant MAX_RISK_SCORE = 100;

    // Events
    event PoolCreated(uint256 indexed poolId, string name, uint256 totalRiskValue, address riskProvider);
    event InvestmentMade(address indexed investor, uint256 indexed poolId, uint256 amount);
    event PremiumDistributed(uint256 indexed poolId, uint256 totalAmount, uint256 timestamp);
    event ClaimProcessed(uint256 indexed poolId, uint256 claimAmount, address claimant);
    event RiskScoreUpdated(uint256 indexed poolId, uint256 oldScore, uint256 newScore);
    event InvestorVerified(address indexed investor, string jurisdiction);

    constructor(
        string memory name,
        string memory symbol,
        address admin
    ) ERC20(name, symbol) ERC20Permit(name) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(COMPLIANCE_ROLE, admin);
        _grantRole(RISK_MANAGER_ROLE, admin);
    }

    /**
     * @dev Create a new insurance risk pool
     */
    function createInsurancePool(
        string memory _name,
        string memory _description,
        uint256 _totalRiskValue,
        uint256 _premiumRate,
        uint256 _riskScore,
        uint256 _maturityDate
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(_totalRiskValue > 0, "Risk value must be positive");
        require(_premiumRate > 0 && _premiumRate <= 5000, "Invalid premium rate"); // Max 50%
        require(_riskScore > 0 && _riskScore <= MAX_RISK_SCORE, "Invalid risk score");
        require(_maturityDate > block.timestamp, "Maturity must be in future");

        uint256 poolId = nextPoolId++;
        
        insurancePools[poolId] = InsurancePool({
            name: _name,
            description: _description,
            totalRiskValue: _totalRiskValue,
            premiumRate: _premiumRate,
            riskScore: _riskScore,
            maturityDate: _maturityDate,
            isActive: true,
            riskProvider: msg.sender
        });

        emit PoolCreated(poolId, _name, _totalRiskValue, msg.sender);
        return poolId;
    }

    /**
     * @dev Verify investor KYC and set profile
     */
    function verifyInvestor(
        address investor,
        bool _isAccredited,
        uint256 _riskTolerance,
        string memory _jurisdiction
    ) external onlyRole(COMPLIANCE_ROLE) {
        require(_riskTolerance >= 1 && _riskTolerance <= 10, "Invalid risk tolerance");
        
        investorProfiles[investor] = InvestorProfile({
            isKYCVerified: true,
            isAccredited: _isAccredited,
            riskTolerance: _riskTolerance,
            totalInvested: investorProfiles[investor].totalInvested,
            lastInvestmentDate: investorProfiles[investor].lastInvestmentDate,
            jurisdiction: _jurisdiction
        });

        emit InvestorVerified(investor, _jurisdiction);
    }

    /**
     * @dev Invest in an insurance risk pool
     */
    function investInPool(uint256 poolId, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(amount >= MIN_INVESTMENT, "Investment below minimum");
        require(insurancePools[poolId].isActive, "Pool not active");
        require(investorProfiles[msg.sender].isKYCVerified, "KYC verification required");
        
        InsurancePool storage pool = insurancePools[poolId];
        InvestorProfile storage investor = investorProfiles[msg.sender];
        
        // Risk tolerance check
        require(
            investor.riskTolerance * 10 >= pool.riskScore, 
            "Investment exceeds risk tolerance"
        );

        // Calculate tokens to mint based on pool valuation
        uint256 tokensToMint = calculateTokensForInvestment(poolId, amount);
        
        // Update balances
        investorPoolBalances[msg.sender][poolId] += tokensToMint;
        poolTotalSupply[poolId] += tokensToMint;
        investor.totalInvested += amount;
        investor.lastInvestmentDate = block.timestamp;
        totalValueLocked += amount;

        // Mint tokens
        _mint(msg.sender, tokensToMint);

        emit InvestmentMade(msg.sender, poolId, amount);
    }

    /**
     * @dev Calculate tokens to mint for investment amount
     */
    function calculateTokensForInvestment(uint256 poolId, uint256 amount) 
        public 
        view 
        returns (uint256) 
    {
        InsurancePool memory pool = insurancePools[poolId];
        
        if (poolTotalSupply[poolId] == 0) {
            // First investment - 1:1 ratio
            return amount;
        }
        
        // Calculate based on current pool valuation
        uint256 currentPoolValue = getCurrentPoolValue(poolId);
        return (amount * poolTotalSupply[poolId]) / currentPoolValue;
    }

    /**
     * @dev Get current pool value including accrued premiums
     */
    function getCurrentPoolValue(uint256 poolId) public view returns (uint256) {
        InsurancePool memory pool = insurancePools[poolId];
        
        // Calculate accrued premiums since pool creation
        uint256 timeElapsed = block.timestamp - (block.timestamp - 365 days); // Simplified
        uint256 accruedPremiums = (pool.totalRiskValue * pool.premiumRate * timeElapsed) / (10000 * 365 days);
        
        return pool.totalRiskValue + accruedPremiums;
    }

    /**
     * @dev Distribute premiums to pool investors
     */
    function distributePremiums(uint256 poolId, uint256 premiumAmount) 
        external 
        onlyRole(RISK_MANAGER_ROLE) 
        nonReentrant 
    {
        require(insurancePools[poolId].isActive, "Pool not active");
        require(premiumAmount > 0, "Premium must be positive");
        
        // Premium distribution logic would be implemented here
        // For now, emit event for tracking
        emit PremiumDistributed(poolId, premiumAmount, block.timestamp);
    }

    /**
     * @dev Process insurance claim
     */
    function processClaim(uint256 poolId, uint256 claimAmount, address claimant) 
        external 
        onlyRole(RISK_MANAGER_ROLE) 
        nonReentrant 
    {
        require(insurancePools[poolId].isActive, "Pool not active");
        require(claimAmount > 0, "Claim must be positive");
        
        // Claim processing logic would be implemented here
        // This would reduce pool value and investor returns
        emit ClaimProcessed(poolId, claimAmount, claimant);
    }

    /**
     * @dev Update risk score for a pool
     */
    function updateRiskScore(uint256 poolId, uint256 newRiskScore) 
        external 
        onlyRole(RISK_MANAGER_ROLE) 
    {
        require(newRiskScore > 0 && newRiskScore <= MAX_RISK_SCORE, "Invalid risk score");
        
        uint256 oldScore = insurancePools[poolId].riskScore;
        insurancePools[poolId].riskScore = newRiskScore;
        
        emit RiskScoreUpdated(poolId, oldScore, newRiskScore);
    }

    /**
     * @dev Get investor's balance in a specific pool
     */
    function getInvestorPoolBalance(address investor, uint256 poolId) 
        external 
        view 
        returns (uint256) 
    {
        return investorPoolBalances[investor][poolId];
    }

    /**
     * @dev Get pool information
     */
    function getPoolInfo(uint256 poolId) 
        external 
        view 
        returns (InsurancePool memory) 
    {
        return insurancePools[poolId];
    }

    /**
     * @dev Get investor profile
     */
    function getInvestorProfile(address investor) 
        external 
        view 
        returns (InvestorProfile memory) 
    {
        return investorProfiles[investor];
    }

    /**
     * @dev Calculate expected annual return for a pool
     */
    function calculateExpectedReturn(uint256 poolId) 
        external 
        view 
        returns (uint256) 
    {
        InsurancePool memory pool = insurancePools[poolId];
        
        // Expected return = Premium Rate - (Risk Score * Risk Adjustment Factor)
        uint256 riskAdjustment = (pool.riskScore * 50) / 100; // 0.5% per risk point
        
        if (pool.premiumRate > riskAdjustment) {
            return pool.premiumRate - riskAdjustment;
        }
        return 0;
    }

    /**
     * @dev Emergency pause function
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause function
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Override transfer to add compliance checks
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        if (to != address(0) && from != address(0)) {
            require(investorProfiles[to].isKYCVerified, "Recipient not KYC verified");
        }
        super._beforeTokenTransfer(from, to, amount);
    }
}
