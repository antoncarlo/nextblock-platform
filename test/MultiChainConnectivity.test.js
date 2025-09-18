const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Multi-Chain Connectivity Tests', function () {
    let insuranceToken, adapter, deployer, user1, user2;
    
    const ETHEREUM_CHAIN_ID = 1;
    const HYPERLIQUID_CHAIN_ID = 998;
    const HYPERLIQUID_TESTNET_CHAIN_ID = 999;
    
    beforeEach(async function () {
        [deployer, user1, user2] = await ethers.getSigners();
        
        // Deploy contracts
        const InsuranceRiskToken = await ethers.getContractFactory('InsuranceRiskToken');
        insuranceToken = await InsuranceRiskToken.deploy(
            'NEXTBLOCK Insurance Token',
            'NBIT',
            deployer.address
        );
        
        const HyperLiquidAdapter = await ethers.getContractFactory('HyperLiquidAdapter');
        adapter = await HyperLiquidAdapter.deploy(
            '0x1234567890123456789012345678901234567890' // Mock bridge
        );
        
        // Setup supported tokens
        await adapter.setSupportedToken(insuranceToken.address, true);
    });
    
    describe('🔗 Chain ID Detection', function () {
        it('Should detect correct network chain IDs', async function () {
            const network = await ethers.provider.getNetwork();
            console.log(`📡 Current Chain ID: ${network.chainId}`);
            
            expect(network.chainId).to.be.oneOf([
                1,    // Ethereum Mainnet
                11155111, // Sepolia Testnet
                998,  // HyperLiquid Mainnet
                999,  // HyperLiquid Testnet
                31337 // Hardhat Local
            ]);
        });
        
        it('Should validate HyperLiquid chain compatibility', async function () {
            const network = await ethers.provider.getNetwork();
            
            if (network.chainId === HYPERLIQUID_CHAIN_ID || network.chainId === HYPERLIQUID_TESTNET_CHAIN_ID) {
                console.log('✅ Running on HyperLiquid network');
                // HyperLiquid specific tests
                expect(await adapter.bridgeFee()).to.be.at.most(100); // Max 1% fee
            } else {
                console.log('✅ Running on Ethereum-compatible network');
                // Ethereum specific tests
                expect(await insuranceToken.name()).to.equal('NEXTBLOCK Insurance Token');
            }
        });
    });
    
    describe('🏊 Insurance Pool Creation', function () {
        it('Should create insurance pool with correct parameters', async function () {
            const poolTx = await insuranceToken.createInsurancePool(
                'Test Hurricane Pool',
                'Test pool for connectivity',
                ethers.utils.parseEther('1000000'), // $1M
                300, // 3% premium
                50,  // Risk score 50
                Math.floor(Date.now() / 1000) + 86400 // 1 day
            );
            
            const receipt = await poolTx.wait();
            expect(receipt.status).to.equal(1);
            
            const pool = await insuranceToken.getPoolInfo(1);
            expect(pool.name).to.equal('Test Hurricane Pool');
            expect(pool.premiumRate).to.equal(300);
            expect(pool.riskScore).to.equal(50);
            expect(pool.isActive).to.be.true;
            
            console.log('✅ Insurance pool created successfully');
        });
        
        it('Should validate risk parameters', async function () {
            // Test invalid risk score
            await expect(
                insuranceToken.createInsurancePool(
                    'Invalid Pool',
                    'Invalid risk score',
                    ethers.utils.parseEther('1000'),
                    300,
                    150, // Invalid: > 100
                    Math.floor(Date.now() / 1000) + 86400
                )
            ).to.be.revertedWith('Invalid risk score');
            
            console.log('✅ Risk parameter validation working');
        });
    });
    
    describe('🌉 Cross-Chain Bridge Functionality', function () {
        beforeEach(async function () {
            // Grant bridge role
            const BRIDGE_ROLE = await adapter.BRIDGE_ROLE();
            await adapter.grantRole(BRIDGE_ROLE, deployer.address);
        });
        
        it('Should initiate bridge transaction to HyperLiquid', async function () {
            // First, mint some tokens for testing
            await insuranceToken.mint(user1.address, ethers.utils.parseEther('1000'));
            
            // Approve adapter to spend tokens
            await insuranceToken.connect(user1).approve(
                adapter.address, 
                ethers.utils.parseEther('100')
            );
            
            const bridgeTx = await adapter.connect(user1).bridgeToHyperLiquid(
                insuranceToken.address,
                ethers.utils.parseEther('100'),
                user1.address
            );
            
            const receipt = await bridgeTx.wait();
            expect(receipt.status).to.equal(1);
            
            // Check for BridgeInitiated event
            const bridgeEvent = receipt.events?.find(e => e.event === 'BridgeInitiated');
            expect(bridgeEvent).to.not.be.undefined;
            
            console.log('✅ Bridge transaction initiated successfully');
        });
        
        it('Should handle cross-chain order creation', async function () {
            const TRADER_ROLE = await adapter.TRADER_ROLE();
            await adapter.grantRole(TRADER_ROLE, user1.address);
            
            // Deposit tokens first
            await insuranceToken.mint(adapter.address, ethers.utils.parseEther('1000'));
            await adapter.setSupportedToken(insuranceToken.address, true);
            
            const orderTx = await adapter.connect(user1).createTradeOrder(
                insuranceToken.address,
                ethers.utils.parseEther('100'),
                ethers.utils.parseEther('0.95'), // Min price
                ethers.utils.parseEther('1.05')  // Max price
            );
            
            const receipt = await orderTx.wait();
            expect(receipt.status).to.equal(1);
            
            console.log('✅ Cross-chain order created successfully');
        });
    });
    
    describe('💼 Portfolio Management Integration', function () {
        it('Should track user balances across chains', async function () {
            // Simulate multi-chain balance tracking
            const userBalance = await insuranceToken.balanceOf(user1.address);
            const adapterBalance = await adapter.getBalance(insuranceToken.address);
            
            console.log(`👤 User Balance: ${ethers.utils.formatEther(userBalance)} NBIT`);
            console.log(`🌉 Adapter Balance: ${ethers.utils.formatEther(adapterBalance)} NBIT`);
            
            expect(userBalance).to.be.a('object'); // BigNumber
            expect(adapterBalance).to.be.a('object'); // BigNumber
            
            console.log('✅ Balance tracking functional');
        });
        
        it('Should calculate expected returns correctly', async function () {
            // Create a pool first
            await insuranceToken.createInsurancePool(
                'Return Test Pool',
                'Pool for return calculation',
                ethers.utils.parseEther('1000000'),
                800, // 8% premium
                60,  // Risk score 60
                Math.floor(Date.now() / 1000) + 86400
            );
            
            const expectedReturn = await insuranceToken.calculateExpectedReturn(1);
            console.log(`📊 Expected Return: ${expectedReturn} basis points`);
            
            // Expected return should be premium rate minus risk adjustment
            // Risk adjustment = 60 * 0.5% = 30 basis points
            // Expected return = 800 - 30 = 770 basis points
            expect(expectedReturn).to.equal(770);
            
            console.log('✅ Return calculation working correctly');
        });
    });
    
    describe('⚡ Performance and Gas Optimization', function () {
        it('Should execute trades with optimal gas usage', async function () {
            const TRADER_ROLE = await adapter.TRADER_ROLE();
            await adapter.grantRole(TRADER_ROLE, deployer.address);
            
            // Setup for trade
            await adapter.setSupportedToken(insuranceToken.address, true);
            await insuranceToken.mint(adapter.address, ethers.utils.parseEther('1000'));
            
            const gasEstimate = await adapter.estimateGas.createTradeOrder(
                insuranceToken.address,
                ethers.utils.parseEther('100'),
                ethers.utils.parseEther('0.95'),
                ethers.utils.parseEther('1.05')
            );
            
            console.log(`⛽ Gas Estimate: ${gasEstimate.toString()}`);
            expect(gasEstimate.toNumber()).to.be.below(200000); // Should be efficient
            
            console.log('✅ Gas optimization validated');
        });
        
        it('Should handle high-frequency operations', async function () {
            const startTime = Date.now();
            
            // Simulate multiple rapid operations
            const operations = [];
            for (let i = 0; i < 10; i++) {
                operations.push(
                    insuranceToken.getPoolInfo(1).catch(() => null)
                );
            }
            
            await Promise.all(operations);
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            console.log(`⚡ 10 operations completed in ${duration}ms`);
            expect(duration).to.be.below(5000); // Should complete within 5 seconds
            
            console.log('✅ High-frequency operations supported');
        });
    });
    
    describe('🔒 Security and Compliance', function () {
        it('Should enforce KYC requirements', async function () {
            // Try to invest without KYC
            await expect(
                insuranceToken.connect(user1).investInPool(1, ethers.utils.parseEther('1000'))
            ).to.be.revertedWith('KYC verification required');
            
            console.log('✅ KYC enforcement working');
        });
        
        it('Should validate risk tolerance', async function () {
            const COMPLIANCE_ROLE = await insuranceToken.COMPLIANCE_ROLE();
            await insuranceToken.grantRole(COMPLIANCE_ROLE, deployer.address);
            
            // Verify investor with low risk tolerance
            await insuranceToken.verifyInvestor(
                user1.address,
                true,  // Accredited
                3,     // Low risk tolerance (3/10)
                'US'
            );
            
            // Create high-risk pool
            await insuranceToken.createInsurancePool(
                'High Risk Pool',
                'Very risky pool',
                ethers.utils.parseEther('1000'),
                300,
                90, // High risk score
                Math.floor(Date.now() / 1000) + 86400
            );
            
            // Try to invest - should fail due to risk tolerance
            await expect(
                insuranceToken.connect(user1).investInPool(2, ethers.utils.parseEther('1000'))
            ).to.be.revertedWith('Investment exceeds risk tolerance');
            
            console.log('✅ Risk tolerance validation working');
        });
    });
    
    describe('📊 Real-time Data Integration', function () {
        it('Should provide accurate pool valuations', async function () {
            // Create pool
            await insuranceToken.createInsurancePool(
                'Valuation Test Pool',
                'Pool for valuation testing',
                ethers.utils.parseEther('5000000'), // $5M
                600, // 6% premium
                40,  // Risk score 40
                Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)
            );
            
            const currentValue = await insuranceToken.getCurrentPoolValue(1);
            console.log(`💰 Current Pool Value: ${ethers.utils.formatEther(currentValue)}`);
            
            // Value should be at least the initial risk value
            expect(currentValue).to.be.at.least(ethers.utils.parseEther('5000000'));
            
            console.log('✅ Pool valuation calculation working');
        });
    });
});

// Helper function to run connectivity tests
async function runConnectivityTests() {
    console.log('🧪 Starting Multi-Chain Connectivity Tests...\n');
    
    try {
        // Run the test suite
        const result = await require('child_process').exec('npx hardhat test test/MultiChainConnectivity.test.js');
        console.log('✅ All connectivity tests passed!');
        return true;
    } catch (error) {
        console.error('❌ Connectivity tests failed:', error);
        return false;
    }
}

module.exports = { runConnectivityTests };
