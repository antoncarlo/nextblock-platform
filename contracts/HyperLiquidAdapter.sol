// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title HyperLiquidAdapter
 * @dev Integration adapter for HyperLiquid ultra-fast trading
 */
contract HyperLiquidAdapter is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant TRADER_ROLE = keccak256("TRADER_ROLE");
    bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");
    
    struct TradeOrder {
        address token;
        uint256 amount;
        uint256 minPrice;
        uint256 maxPrice;
        address trader;
        uint256 timestamp;
        bool isExecuted;
        bool isCancelled;
    }
    
    struct BridgeTransaction {
        address token;
        uint256 amount;
        address from;
        address to;
        uint256 timestamp;
        bool isCompleted;
        bytes32 hyperLiquidTxHash;
    }
    
    mapping(bytes32 => TradeOrder) public orders;
    mapping(bytes32 => BridgeTransaction) public bridgeTransactions;
    mapping(address => uint256) public tokenBalances;
    mapping(address => bool) public supportedTokens;
    
    bytes32[] public allOrders;
    bytes32[] public allBridgeTransactions;
    
    // HyperLiquid specific parameters
    address public hyperLiquidBridge;
    uint256 public bridgeFee; // Fee in basis points
    uint256 public tradingFee; // Fee in basis points
    
    event OrderCreated(bytes32 indexed orderId, address indexed trader, address token, uint256 amount);
    event OrderExecuted(bytes32 indexed orderId, uint256 executedPrice, uint256 executedAmount);
    event OrderCancelled(bytes32 indexed orderId);
    event BridgeInitiated(bytes32 indexed bridgeId, address token, uint256 amount, address from, address to);
    event BridgeCompleted(bytes32 indexed bridgeId, bytes32 hyperLiquidTxHash);
    event TokenSupported(address token, bool supported);
    
    constructor(address _hyperLiquidBridge) {
        hyperLiquidBridge = _hyperLiquidBridge;
        bridgeFee = 10; // 0.1%
        tradingFee = 5;  // 0.05%
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BRIDGE_ROLE, msg.sender);
    }
    
    /**
     * @dev Create a trade order for HyperLiquid execution
     */
    function createTradeOrder(
        address token,
        uint256 amount,
        uint256 minPrice,
        uint256 maxPrice
    ) external onlyRole(TRADER_ROLE) whenNotPaused nonReentrant returns (bytes32) {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Invalid amount");
        require(minPrice <= maxPrice, "Invalid price range");
        require(tokenBalances[token] >= amount, "Insufficient balance");
        
        bytes32 orderId = keccak256(abi.encodePacked(
            msg.sender,
            token,
            amount,
            block.timestamp,
            block.number
        ));
        
        orders[orderId] = TradeOrder({
            token: token,
            amount: amount,
            minPrice: minPrice,
            maxPrice: maxPrice,
            trader: msg.sender,
            timestamp: block.timestamp,
            isExecuted: false,
            isCancelled: false
        });
        
        allOrders.push(orderId);
        
        // Lock tokens for trading
        tokenBalances[token] -= amount;
        
        emit OrderCreated(orderId, msg.sender, token, amount);
        return orderId;
    }
    
    /**
     * @dev Execute trade on HyperLiquid (called by authorized bridge)
     */
    function executeTradeOnHyperLiquid(
        bytes32 orderId,
        uint256 executedPrice,
        uint256 executedAmount
    ) external onlyRole(BRIDGE_ROLE) {
        TradeOrder storage order = orders[orderId];
        require(!order.isExecuted && !order.isCancelled, "Order not active");
        require(executedPrice >= order.minPrice && executedPrice <= order.maxPrice, "Price out of range");
        require(executedAmount <= order.amount, "Amount exceeds order");
        
        order.isExecuted = true;
        
        // Calculate fees
        uint256 fee = (executedAmount * tradingFee) / 10000;
        uint256 netAmount = executedAmount - fee;
        
        // Return unused tokens if partially filled
        if (executedAmount < order.amount) {
            uint256 unusedAmount = order.amount - executedAmount;
            tokenBalances[order.token] += unusedAmount;
        }
        
        // Credit executed amount (minus fees) to trader
        // In a real implementation, this would involve cross-chain communication
        
        emit OrderExecuted(orderId, executedPrice, executedAmount);
    }
    
    /**
     * @dev Cancel a trade order
     */
    function cancelOrder(bytes32 orderId) external {
        TradeOrder storage order = orders[orderId];
        require(order.trader == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Unauthorized");
        require(!order.isExecuted && !order.isCancelled, "Order not active");
        
        order.isCancelled = true;
        
        // Return locked tokens
        tokenBalances[order.token] += order.amount;
        
        emit OrderCancelled(orderId);
    }
    
    /**
     * @dev Initiate bridge transaction to HyperLiquid
     */
    function bridgeToHyperLiquid(
        address token,
        uint256 amount,
        address to
    ) external whenNotPaused nonReentrant returns (bytes32) {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Invalid amount");
        require(to != address(0), "Invalid recipient");
        
        // Transfer tokens from user
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Calculate bridge fee
        uint256 fee = (amount * bridgeFee) / 10000;
        uint256 netAmount = amount - fee;
        
        bytes32 bridgeId = keccak256(abi.encodePacked(
            msg.sender,
            to,
            token,
            amount,
            block.timestamp,
            block.number
        ));
        
        bridgeTransactions[bridgeId] = BridgeTransaction({
            token: token,
            amount: netAmount,
            from: msg.sender,
            to: to,
            timestamp: block.timestamp,
            isCompleted: false,
            hyperLiquidTxHash: bytes32(0)
        });
        
        allBridgeTransactions.push(bridgeId);
        
        emit BridgeInitiated(bridgeId, token, netAmount, msg.sender, to);
        return bridgeId;
    }
    
    /**
     * @dev Complete bridge transaction (called by bridge operator)
     */
    function completeBridgeTransaction(
        bytes32 bridgeId,
        bytes32 hyperLiquidTxHash
    ) external onlyRole(BRIDGE_ROLE) {
        BridgeTransaction storage transaction = bridgeTransactions[bridgeId];
        require(!transaction.isCompleted, "Transaction already completed");
        
        transaction.isCompleted = true;
        transaction.hyperLiquidTxHash = hyperLiquidTxHash;
        
        emit BridgeCompleted(bridgeId, hyperLiquidTxHash);
    }
    
    /**
     * @dev Bridge tokens from HyperLiquid back to Ethereum
     */
    function bridgeFromHyperLiquid(
        address token,
        uint256 amount,
        address to,
        bytes32 hyperLiquidTxHash
    ) external onlyRole(BRIDGE_ROLE) {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Invalid amount");
        require(to != address(0), "Invalid recipient");
        
        // Verify HyperLiquid transaction (in production, this would involve oracle verification)
        
        // Transfer tokens to recipient
        IERC20(token).transfer(to, amount);
        
        // Log the bridge transaction
        bytes32 bridgeId = keccak256(abi.encodePacked(
            hyperLiquidTxHash,
            token,
            amount,
            to,
            block.timestamp
        ));
        
        bridgeTransactions[bridgeId] = BridgeTransaction({
            token: token,
            amount: amount,
            from: address(0), // From HyperLiquid
            to: to,
            timestamp: block.timestamp,
            isCompleted: true,
            hyperLiquidTxHash: hyperLiquidTxHash
        });
        
        allBridgeTransactions.push(bridgeId);
    }
    
    /**
     * @dev Deposit tokens for trading
     */
    function deposit(address token, uint256 amount) external {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Invalid amount");
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokenBalances[token] += amount;
    }
    
    /**
     * @dev Withdraw tokens
     */
    function withdraw(address token, uint256 amount) external nonReentrant {
        require(tokenBalances[token] >= amount, "Insufficient balance");
        
        tokenBalances[token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
    }
    
    /**
     * @dev Add/remove supported token
     */
    function setSupportedToken(address token, bool supported) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        supportedTokens[token] = supported;
        emit TokenSupported(token, supported);
    }
    
    /**
     * @dev Set bridge fee
     */
    function setBridgeFee(uint256 _bridgeFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_bridgeFee <= 1000, "Fee too high"); // Max 10%
        bridgeFee = _bridgeFee;
    }
    
    /**
     * @dev Set trading fee
     */
    function setTradingFee(uint256 _tradingFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_tradingFee <= 1000, "Fee too high"); // Max 10%
        tradingFee = _tradingFee;
    }
    
    /**
     * @dev Set HyperLiquid bridge address
     */
    function setHyperLiquidBridge(address _hyperLiquidBridge) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        hyperLiquidBridge = _hyperLiquidBridge;
    }
    
    /**
     * @dev Get order information
     */
    function getOrder(bytes32 orderId) external view returns (TradeOrder memory) {
        return orders[orderId];
    }
    
    /**
     * @dev Get bridge transaction information
     */
    function getBridgeTransaction(bytes32 bridgeId) 
        external 
        view 
        returns (BridgeTransaction memory) 
    {
        return bridgeTransactions[bridgeId];
    }
    
    /**
     * @dev Get user token balance
     */
    function getBalance(address token) external view returns (uint256) {
        return tokenBalances[token];
    }
    
    /**
     * @dev Get all orders
     */
    function getAllOrders() external view returns (bytes32[] memory) {
        return allOrders;
    }
    
    /**
     * @dev Get all bridge transactions
     */
    function getAllBridgeTransactions() external view returns (bytes32[] memory) {
        return allBridgeTransactions;
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
     * @dev Emergency withdraw (admin only)
     */
    function emergencyWithdraw(address token, uint256 amount) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        IERC20(token).transfer(msg.sender, amount);
    }
}
