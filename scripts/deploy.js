const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting NEXTBLOCK deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "Chain ID:", network.chainId.toString());
  
  try {
    // 1. Deploy InsuranceTokenFactory
    console.log("\n📋 Deploying InsuranceTokenFactory...");
    const InsuranceTokenFactory = await ethers.getContractFactory("InsuranceTokenFactory");
    const factory = await InsuranceTokenFactory.deploy();
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("✅ InsuranceTokenFactory deployed to:", factoryAddress);
    
    // 2. Deploy LiquidityPool
    console.log("\n💧 Deploying LiquidityPool...");
    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    const liquidityPool = await LiquidityPool.deploy();
    await liquidityPool.waitForDeployment();
    const liquidityPoolAddress = await liquidityPool.getAddress();
    console.log("✅ LiquidityPool deployed to:", liquidityPoolAddress);
    
    // 3. Deploy HyperLiquidAdapter
    console.log("\n⚡ Deploying HyperLiquidAdapter...");
    const HyperLiquidAdapter = await ethers.getContractFactory("HyperLiquidAdapter");
    // For testnet, we'll use a placeholder bridge address
    const bridgeAddress = network.chainId === 999n || network.chainId === 998n 
      ? "0x1234567890123456789012345678901234567890" // Placeholder for HyperLiquid
      : deployer.address; // Use deployer as placeholder for other networks
    
    const hyperLiquidAdapter = await HyperLiquidAdapter.deploy(bridgeAddress);
    await hyperLiquidAdapter.waitForDeployment();
    const hyperLiquidAdapterAddress = await hyperLiquidAdapter.getAddress();
    console.log("✅ HyperLiquidAdapter deployed to:", hyperLiquidAdapterAddress);
    
    // 4. Setup roles and permissions
    console.log("\n🔐 Setting up roles and permissions...");
    
    // Grant roles in InsuranceTokenFactory
    const INSURANCE_COMPANY_ROLE = await factory.INSURANCE_COMPANY_ROLE();
    const COMPLIANCE_ROLE = await factory.COMPLIANCE_ROLE();
    
    // Grant deployer insurance company role for testing
    await factory.grantRole(INSURANCE_COMPANY_ROLE, deployer.address);
    console.log("✅ Granted INSURANCE_COMPANY_ROLE to deployer");
    
    // Grant roles in LiquidityPool
    const POOL_MANAGER_ROLE = await liquidityPool.POOL_MANAGER_ROLE();
    await liquidityPool.grantRole(POOL_MANAGER_ROLE, deployer.address);
    console.log("✅ Granted POOL_MANAGER_ROLE to deployer");
    
    // Grant roles in HyperLiquidAdapter
    const TRADER_ROLE = await hyperLiquidAdapter.TRADER_ROLE();
    const BRIDGE_ROLE = await hyperLiquidAdapter.BRIDGE_ROLE();
    
    await hyperLiquidAdapter.grantRole(TRADER_ROLE, deployer.address);
    await hyperLiquidAdapter.grantRole(BRIDGE_ROLE, deployer.address);
    console.log("✅ Granted TRADER_ROLE and BRIDGE_ROLE to deployer");
    
    // 5. Create a test insurance token
    console.log("\n🧪 Creating test insurance token...");
    
    const testPortfolio = {
      name: "Test Property Insurance Portfolio",
      description: "A diversified portfolio of property insurance risks",
      totalValue: ethers.parseEther("1000000"), // 1M ETH equivalent
      expectedLoss: ethers.parseEther("50000"),  // 50K ETH expected loss
      maxLoss: ethers.parseEther("200000"),      // 200K ETH max loss
      probability: 500, // 5% probability (in basis points)
      duration: 365 * 24 * 60 * 60, // 1 year in seconds
      riskCategory: "Property",
      isActive: true
    };
    
    const createTx = await factory.createInsuranceToken(
      "NextBlock Property Risk Token",
      "NBPRT",
      ethers.parseEther("1000000"), // 1M tokens
      testPortfolio
    );
    
    const receipt = await createTx.wait();
    
    // Find the TokenCreated event
    const tokenCreatedEvent = receipt.logs.find(
      log => log.fragment && log.fragment.name === 'TokenCreated'
    );
    
    if (tokenCreatedEvent) {
      const tokenAddress = tokenCreatedEvent.args[0];
      console.log("✅ Test insurance token created at:", tokenAddress);
      
      // 6. Create a liquidity pool for the test token
      console.log("\n💱 Creating liquidity pool...");
      
      // We'll create a pool with ETH (using WETH address or zero address for native ETH)
      const wethAddress = "0x0000000000000000000000000000000000000000"; // Placeholder
      const poolTx = await liquidityPool.createPool(
        tokenAddress,
        wethAddress,
        300 // 3% fee
      );
      
      await poolTx.wait();
      console.log("✅ Liquidity pool created for test token");
    }
    
    // 7. Setup HyperLiquid adapter with test token
    console.log("\n🔗 Setting up HyperLiquid adapter...");
    
    if (tokenCreatedEvent) {
      const tokenAddress = tokenCreatedEvent.args[0];
      await hyperLiquidAdapter.setSupportedToken(tokenAddress, true);
      console.log("✅ Test token added to HyperLiquid adapter");
    }
    
    // 8. Display deployment summary
    console.log("\n📊 DEPLOYMENT SUMMARY");
    console.log("=" .repeat(50));
    console.log("🏭 InsuranceTokenFactory:", factoryAddress);
    console.log("💧 LiquidityPool:", liquidityPoolAddress);
    console.log("⚡ HyperLiquidAdapter:", hyperLiquidAdapterAddress);
    console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId.toString() + ")");
    console.log("👤 Deployer:", deployer.address);
    
    if (tokenCreatedEvent) {
      console.log("🧪 Test Token:", tokenCreatedEvent.args[0]);
    }
    
    // 9. Save deployment addresses to file
    const deploymentInfo = {
      network: {
        name: network.name,
        chainId: network.chainId.toString()
      },
      contracts: {
        InsuranceTokenFactory: factoryAddress,
        LiquidityPool: liquidityPoolAddress,
        HyperLiquidAdapter: hyperLiquidAdapterAddress
      },
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      testToken: tokenCreatedEvent ? tokenCreatedEvent.args[0] : null
    };
    
    const fs = require('fs');
    const path = require('path');
    
    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }
    
    // Save deployment info
    const deploymentFile = path.join(deploymentsDir, `${network.name}-${network.chainId}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n💾 Deployment info saved to:", deploymentFile);
    console.log("\n🎉 Deployment completed successfully!");
    
    // 10. Verification instructions
    if (network.chainId !== 31337n) { // Not local hardhat network
      console.log("\n🔍 VERIFICATION INSTRUCTIONS");
      console.log("=" .repeat(50));
      console.log("To verify contracts on block explorer, run:");
      console.log(`npx hardhat verify --network ${network.name} ${factoryAddress}`);
      console.log(`npx hardhat verify --network ${network.name} ${liquidityPoolAddress}`);
      console.log(`npx hardhat verify --network ${network.name} ${hyperLiquidAdapterAddress} "${bridgeAddress}"`);
    }
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
  });
