// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title LiquidityPool
 * @dev Automated Market Maker for tokenized insurance assets
 */
contract LiquidityPool is ERC20, AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant POOL_MANAGER_ROLE = keccak256("POOL_MANAGER_ROLE");
    
    struct PoolInfo {
        address token0;
        address token1;
        uint256 reserve0;
        uint256 reserve1;
        uint256 totalLiquidity;
        uint256 fee; // Fee in basis points (100 = 1%)
        bool isActive;
    }
    
    struct LiquidityPosition {
        uint256 liquidity;
        uint256 token0Deposited;
        uint256 token1Deposited;
        uint256 timestamp;
    }
    
    mapping(bytes32 => PoolInfo) public pools;
    mapping(address => mapping(bytes32 => LiquidityPosition)) public positions;
    mapping(bytes32 => address[]) public poolProviders;
    
    bytes32[] public allPools;
    
    uint256 public constant MINIMUM_LIQUIDITY = 1000;
    uint256 public constant MAX_FEE = 1000; // 10%
    
    event PoolCreated(bytes32 indexed poolId, address token0, address token1, uint256 fee);
    event LiquidityAdded(bytes32 indexed poolId, address indexed provider, uint256 amount0, uint256 amount1, uint256 liquidity);
    event LiquidityRemoved(bytes32 indexed poolId, address indexed provider, uint256 amount0, uint256 amount1, uint256 liquidity);
    event Swap(bytes32 indexed poolId, address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    
    constructor() ERC20("NextBlock LP Token", "NBLP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(POOL_MANAGER_ROLE, msg.sender);
    }
    
    /**
     * @dev Create a new liquidity pool
     */
    function createPool(
        address token0,
        address token1,
        uint256 fee
    ) external onlyRole(POOL_MANAGER_ROLE) returns (bytes32) {
        require(token0 != token1, "Identical tokens");
        require(token0 != address(0) && token1 != address(0), "Zero address");
        require(fee <= MAX_FEE, "Fee too high");
        
        // Ensure consistent ordering
        if (token0 > token1) {
            (token0, token1) = (token1, token0);
        }
        
        bytes32 poolId = keccak256(abi.encodePacked(token0, token1, fee));
        require(pools[poolId].token0 == address(0), "Pool already exists");
        
        pools[poolId] = PoolInfo({
            token0: token0,
            token1: token1,
            reserve0: 0,
            reserve1: 0,
            totalLiquidity: 0,
            fee: fee,
            isActive: true
        });
        
        allPools.push(poolId);
        
        emit PoolCreated(poolId, token0, token1, fee);
        return poolId;
    }
    
    /**
     * @dev Add liquidity to a pool
     */
    function addLiquidity(
        bytes32 poolId,
        uint256 amount0Desired,
        uint256 amount1Desired,
        uint256 amount0Min,
        uint256 amount1Min
    ) external nonReentrant whenNotPaused returns (uint256 liquidity) {
        PoolInfo storage pool = pools[poolId];
        require(pool.isActive, "Pool not active");
        
        uint256 amount0;
        uint256 amount1;
        
        if (pool.reserve0 == 0 && pool.reserve1 == 0) {
            // First liquidity provision
            amount0 = amount0Desired;
            amount1 = amount1Desired;
            liquidity = sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
            _mint(address(0), MINIMUM_LIQUIDITY); // Lock minimum liquidity
        } else {
            // Calculate optimal amounts
            uint256 amount1Optimal = (amount0Desired * pool.reserve1) / pool.reserve0;
            if (amount1Optimal <= amount1Desired) {
                require(amount1Optimal >= amount1Min, "Insufficient token1 amount");
                amount0 = amount0Desired;
                amount1 = amount1Optimal;
            } else {
                uint256 amount0Optimal = (amount1Desired * pool.reserve0) / pool.reserve1;
                require(amount0Optimal <= amount0Desired && amount0Optimal >= amount0Min, "Insufficient token0 amount");
                amount0 = amount0Optimal;
                amount1 = amount1Desired;
            }
            
            liquidity = min(
                (amount0 * totalSupply()) / pool.reserve0,
                (amount1 * totalSupply()) / pool.reserve1
            );
        }
        
        require(liquidity > 0, "Insufficient liquidity minted");
        
        // Transfer tokens
        IERC20(pool.token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(pool.token1).transferFrom(msg.sender, address(this), amount1);
        
        // Update reserves
        pool.reserve0 += amount0;
        pool.reserve1 += amount1;
        pool.totalLiquidity += liquidity;
        
        // Update position
        LiquidityPosition storage position = positions[msg.sender][poolId];
        if (position.liquidity == 0) {
            poolProviders[poolId].push(msg.sender);
        }
        position.liquidity += liquidity;
        position.token0Deposited += amount0;
        position.token1Deposited += amount1;
        position.timestamp = block.timestamp;
        
        // Mint LP tokens
        _mint(msg.sender, liquidity);
        
        emit LiquidityAdded(poolId, msg.sender, amount0, amount1, liquidity);
    }
    
    /**
     * @dev Remove liquidity from a pool
     */
    function removeLiquidity(
        bytes32 poolId,
        uint256 liquidity,
        uint256 amount0Min,
        uint256 amount1Min
    ) external nonReentrant returns (uint256 amount0, uint256 amount1) {
        PoolInfo storage pool = pools[poolId];
        require(pool.totalLiquidity > 0, "No liquidity");
        
        LiquidityPosition storage position = positions[msg.sender][poolId];
        require(position.liquidity >= liquidity, "Insufficient liquidity");
        
        // Calculate amounts to return
        amount0 = (liquidity * pool.reserve0) / pool.totalLiquidity;
        amount1 = (liquidity * pool.reserve1) / pool.totalLiquidity;
        
        require(amount0 >= amount0Min && amount1 >= amount1Min, "Insufficient output amounts");
        
        // Update position
        position.liquidity -= liquidity;
        position.token0Deposited = (position.token0Deposited * (position.liquidity)) / (position.liquidity + liquidity);
        position.token1Deposited = (position.token1Deposited * (position.liquidity)) / (position.liquidity + liquidity);
        
        // Update reserves
        pool.reserve0 -= amount0;
        pool.reserve1 -= amount1;
        pool.totalLiquidity -= liquidity;
        
        // Burn LP tokens
        _burn(msg.sender, liquidity);
        
        // Transfer tokens
        IERC20(pool.token0).transfer(msg.sender, amount0);
        IERC20(pool.token1).transfer(msg.sender, amount1);
        
        emit LiquidityRemoved(poolId, msg.sender, amount0, amount1, liquidity);
    }
    
    /**
     * @dev Swap tokens
     */
    function swap(
        bytes32 poolId,
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin
    ) external nonReentrant whenNotPaused returns (uint256 amountOut) {
        PoolInfo storage pool = pools[poolId];
        require(pool.isActive, "Pool not active");
        require(tokenIn == pool.token0 || tokenIn == pool.token1, "Invalid token");
        require(amountIn > 0, "Invalid input amount");
        
        bool isToken0 = tokenIn == pool.token0;
        address tokenOut = isToken0 ? pool.token1 : pool.token0;
        uint256 reserveIn = isToken0 ? pool.reserve0 : pool.reserve1;
        uint256 reserveOut = isToken0 ? pool.reserve1 : pool.reserve0;
        
        // Calculate output amount with fee
        uint256 amountInWithFee = amountIn * (10000 - pool.fee);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 10000) + amountInWithFee;
        amountOut = numerator / denominator;
        
        require(amountOut >= amountOutMin, "Insufficient output amount");
        require(amountOut < reserveOut, "Insufficient liquidity");
        
        // Transfer tokens
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        
        // Update reserves
        if (isToken0) {
            pool.reserve0 += amountIn;
            pool.reserve1 -= amountOut;
        } else {
            pool.reserve1 += amountIn;
            pool.reserve0 -= amountOut;
        }
        
        emit Swap(poolId, msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }
    
    /**
     * @dev Get pool information
     */
    function getPoolInfo(bytes32 poolId) external view returns (PoolInfo memory) {
        return pools[poolId];
    }
    
    /**
     * @dev Get user position
     */
    function getPosition(address user, bytes32 poolId) external view returns (LiquidityPosition memory) {
        return positions[user][poolId];
    }
    
    /**
     * @dev Get all pools
     */
    function getAllPools() external view returns (bytes32[] memory) {
        return allPools;
    }
    
    /**
     * @dev Calculate pool ID
     */
    function getPoolId(address token0, address token1, uint256 fee) external pure returns (bytes32) {
        if (token0 > token1) {
            (token0, token1) = (token1, token0);
        }
        return keccak256(abi.encodePacked(token0, token1, fee));
    }
    
    /**
     * @dev Get quote for swap
     */
    function getAmountOut(bytes32 poolId, address tokenIn, uint256 amountIn) 
        external 
        view 
        returns (uint256 amountOut) 
    {
        PoolInfo memory pool = pools[poolId];
        require(tokenIn == pool.token0 || tokenIn == pool.token1, "Invalid token");
        
        bool isToken0 = tokenIn == pool.token0;
        uint256 reserveIn = isToken0 ? pool.reserve0 : pool.reserve1;
        uint256 reserveOut = isToken0 ? pool.reserve1 : pool.reserve0;
        
        if (reserveIn == 0 || reserveOut == 0) return 0;
        
        uint256 amountInWithFee = amountIn * (10000 - pool.fee);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 10000) + amountInWithFee;
        amountOut = numerator / denominator;
    }
    
    // Utility functions
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
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
    
    /**
     * @dev Toggle pool status
     */
    function togglePool(bytes32 poolId) external onlyRole(POOL_MANAGER_ROLE) {
        pools[poolId].isActive = !pools[poolId].isActive;
    }
}
