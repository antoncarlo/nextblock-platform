// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title InsuranceTokenFactory
 * @dev Factory contract for creating and managing tokenized insurance portfolios
 */
contract InsuranceTokenFactory is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant INSURANCE_COMPANY_ROLE = keccak256("INSURANCE_COMPANY_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    
    struct InsurancePortfolio {
        string name;
        string description;
        uint256 totalValue;
        uint256 expectedLoss;
        uint256 maxLoss;
        uint256 probability;
        uint256 duration;
        string riskCategory;
        bool isActive;
    }
    
    struct TokenInfo {
        address tokenAddress;
        address creator;
        InsurancePortfolio portfolio;
        uint256 createdAt;
        uint256 totalSupply;
        bool isVerified;
    }
    
    mapping(address => TokenInfo) public tokens;
    mapping(address => address[]) public companyTokens;
    address[] public allTokens;
    
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 totalSupply
    );
    
    event TokenVerified(address indexed tokenAddress, bool verified);
    event PortfolioUpdated(address indexed tokenAddress, InsurancePortfolio portfolio);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_ROLE, msg.sender);
    }
    
    /**
     * @dev Create a new insurance token
     */
    function createInsuranceToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        InsurancePortfolio memory portfolio
    ) external onlyRole(INSURANCE_COMPANY_ROLE) whenNotPaused nonReentrant returns (address) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(totalSupply > 0, "Total supply must be greater than 0");
        require(portfolio.totalValue > 0, "Portfolio value must be greater than 0");
        
        // Deploy new RiskToken
        RiskToken newToken = new RiskToken(
            name,
            symbol,
            totalSupply,
            msg.sender,
            address(this)
        );
        
        address tokenAddress = address(newToken);
        
        // Store token information
        tokens[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            portfolio: portfolio,
            createdAt: block.timestamp,
            totalSupply: totalSupply,
            isVerified: false
        });
        
        // Add to mappings
        companyTokens[msg.sender].push(tokenAddress);
        allTokens.push(tokenAddress);
        
        emit TokenCreated(tokenAddress, msg.sender, name, symbol, totalSupply);
        
        return tokenAddress;
    }
    
    /**
     * @dev Verify a token for compliance
     */
    function verifyToken(address tokenAddress, bool verified) 
        external 
        onlyRole(COMPLIANCE_ROLE) 
    {
        require(tokens[tokenAddress].tokenAddress != address(0), "Token does not exist");
        tokens[tokenAddress].isVerified = verified;
        emit TokenVerified(tokenAddress, verified);
    }
    
    /**
     * @dev Update portfolio information
     */
    function updatePortfolio(
        address tokenAddress,
        InsurancePortfolio memory newPortfolio
    ) external {
        require(tokens[tokenAddress].creator == msg.sender, "Only creator can update");
        require(tokens[tokenAddress].tokenAddress != address(0), "Token does not exist");
        
        tokens[tokenAddress].portfolio = newPortfolio;
        emit PortfolioUpdated(tokenAddress, newPortfolio);
    }
    
    /**
     * @dev Get token information
     */
    function getTokenInfo(address tokenAddress) 
        external 
        view 
        returns (TokenInfo memory) 
    {
        return tokens[tokenAddress];
    }
    
    /**
     * @dev Get all tokens created by a company
     */
    function getCompanyTokens(address company) 
        external 
        view 
        returns (address[] memory) 
    {
        return companyTokens[company];
    }
    
    /**
     * @dev Get all tokens
     */
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
    
    /**
     * @dev Get total number of tokens
     */
    function getTotalTokens() external view returns (uint256) {
        return allTokens.length;
    }
    
    /**
     * @dev Grant insurance company role
     */
    function grantInsuranceCompanyRole(address company) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _grantRole(INSURANCE_COMPANY_ROLE, company);
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}

/**
 * @title RiskToken
 * @dev ERC20 token representing fractional ownership of insurance risks
 */
contract RiskToken is ERC20, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    address public factory;
    address public insuranceCompany;
    uint256 public immutable maxSupply;
    
    struct RiskMetrics {
        uint256 expectedLoss;
        uint256 maxLoss;
        uint256 probability;
        uint256 duration;
        uint256 lastUpdate;
    }
    
    RiskMetrics public riskMetrics;
    
    event RiskMetricsUpdated(RiskMetrics metrics);
    event Dividend(uint256 amount, uint256 perToken);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        address _insuranceCompany,
        address _factory
    ) ERC20(name, symbol) {
        maxSupply = _maxSupply;
        insuranceCompany = _insuranceCompany;
        factory = _factory;
        
        _grantRole(DEFAULT_ADMIN_ROLE, _insuranceCompany);
        _grantRole(MINTER_ROLE, _insuranceCompany);
        _grantRole(BURNER_ROLE, _insuranceCompany);
        
        // Mint initial supply to insurance company
        _mint(_insuranceCompany, _maxSupply);
    }
    
    /**
     * @dev Update risk metrics
     */
    function updateRiskMetrics(RiskMetrics memory newMetrics) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        riskMetrics = newMetrics;
        riskMetrics.lastUpdate = block.timestamp;
        emit RiskMetricsUpdated(newMetrics);
    }
    
    /**
     * @dev Distribute dividends to token holders
     */
    function distributeDividends() external payable onlyRole(DEFAULT_ADMIN_ROLE) {
        require(msg.value > 0, "No dividends to distribute");
        require(totalSupply() > 0, "No tokens in circulation");
        
        uint256 dividendPerToken = msg.value / totalSupply();
        emit Dividend(msg.value, dividendPerToken);
        
        // Note: In a production environment, you would implement a more sophisticated
        // dividend distribution mechanism, possibly using a separate contract
    }
    
    /**
     * @dev Mint new tokens (if needed for additional funding)
     */
    function mint(address to, uint256 amount) 
        external 
        onlyRole(MINTER_ROLE) 
        nonReentrant 
    {
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Burn tokens from account (with allowance)
     */
    function burnFrom(address account, uint256 amount) 
        external 
        onlyRole(BURNER_ROLE) 
    {
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
    }
    
    /**
     * @dev Get current risk metrics
     */
    function getCurrentRiskMetrics() external view returns (RiskMetrics memory) {
        return riskMetrics;
    }
    
    /**
     * @dev Calculate expected return based on risk metrics
     */
    function calculateExpectedReturn() external view returns (uint256) {
        if (riskMetrics.duration == 0) return 0;
        
        // Simple calculation: (totalValue - expectedLoss) / duration
        // In production, this would be more sophisticated
        return (maxSupply - riskMetrics.expectedLoss) * 10000 / riskMetrics.duration;
    }
}
