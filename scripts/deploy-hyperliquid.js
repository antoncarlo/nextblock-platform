const { ethers } = require('hardhat');

async function main() {
    console.log('🚀 Starting HyperLiquid Contract Deployment...');
    
    // Get network information
    const network = await ethers.provider.getNetwork();
    console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deploying with account: ${deployer.address}`);
    
    const balance = await deployer.getBalance();
    console.log(`💰 Account balance: ${ethers.utils.formatEther(balance)} ETH`);
    
    try {
        // Deploy InsuranceRiskToken
        console.log('\n📄 Deploying InsuranceRiskToken...');
        const InsuranceRiskToken = await ethers.getContractFactory('InsuranceRiskToken');
        const insuranceToken = await InsuranceRiskToken.deploy(
            'NEXTBLOCK Insurance Token',
            'NBIT',
            deployer.address
        );
        await insuranceToken.deployed();
        console.log(`✅ InsuranceRiskToken deployed to: ${insuranceToken.address}`);
        
        // Deploy HyperLiquidAdapter
        console.log('\n📄 Deploying HyperLiquidAdapter...');
        const HyperLiquidAdapter = await ethers.getContractFactory('HyperLiquidAdapter');
        
        // HyperLiquid bridge addresses (these would be real addresses in production)
        const hyperLiquidBridge = network.chainId === 998 
            ? '0x1234567890123456789012345678901234567890' // HyperLiquid Mainnet Bridge
            : '0x0987654321098765432109876543210987654321'; // HyperLiquid Testnet Bridge
            
        const adapter = await HyperLiquidAdapter.deploy(hyperLiquidBridge);
        await adapter.deployed();
        console.log(`✅ HyperLiquidAdapter deployed to: ${adapter.address}`);
        
        // Setup initial configuration
        console.log('\n⚙️ Setting up initial configuration...');
        
        // Add supported tokens
        const supportedTokens = [
            '0xA0b86a33E6441c8C0c0c8C1c0c0c8C1c0c0c8C1c', // USDC
            '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
            '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
        ];
        
        for (const token of supportedTokens) {
            await adapter.setSupportedToken(token, true);
            console.log(`✅ Added supported token: ${token}`);
        }
        
        // Set fees
        await adapter.setBridgeFee(10); // 0.1%
        await adapter.setTradingFee(5);  // 0.05%
        console.log('✅ Fees configured');
        
        // Create sample insurance pool
        console.log('\n🏊 Creating sample insurance pool...');
        const poolTx = await insuranceToken.createInsurancePool(
            'Hurricane Risk Pool 2025',
            'Tokenized hurricane insurance risk for Florida properties',
            ethers.utils.parseEther('10000000'), // $10M total risk value
            500, // 5% premium rate
            75,  // Risk score 75/100
            Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year maturity
        );
        const poolReceipt = await poolTx.wait();
        console.log('✅ Sample insurance pool created');
        
        // Verify contracts
        console.log('\n🔍 Verifying contract deployment...');
        
        const tokenName = await insuranceToken.name();
        const tokenSymbol = await insuranceToken.symbol();
        const adapterBridgeFee = await adapter.bridgeFee();
        
        console.log(`✅ Token Name: ${tokenName}`);
        console.log(`✅ Token Symbol: ${tokenSymbol}`);
        console.log(`✅ Bridge Fee: ${adapterBridgeFee} basis points`);
        
        // Save deployment addresses
        const deploymentInfo = {
            network: network.name,
            chainId: network.chainId,
            deployer: deployer.address,
            contracts: {
                InsuranceRiskToken: insuranceToken.address,
                HyperLiquidAdapter: adapter.address
            },
            configuration: {
                bridgeFee: adapterBridgeFee.toString(),
                supportedTokens: supportedTokens
            },
            timestamp: new Date().toISOString()
        };
        
        console.log('\n📋 Deployment Summary:');
        console.log(JSON.stringify(deploymentInfo, null, 2));
        
        // Write to file
        const fs = require('fs');
        fs.writeFileSync(
            `deployment-${network.chainId}-${Date.now()}.json`,
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log('\n🎉 HyperLiquid deployment completed successfully!');
        
        return deploymentInfo;
        
    } catch (error) {
        console.error('❌ Deployment failed:', error);
        throw error;
    }
}

// Execute deployment
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = main;
