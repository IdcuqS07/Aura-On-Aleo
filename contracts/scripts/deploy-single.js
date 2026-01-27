const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  console.log(`\n🚀 Deploying to ${network}...`);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📍 Deployer: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH\n`);

  // Deploy SimpleZKBadge
  console.log("📦 Deploying SimpleZKBadge...");
  const SimpleZKBadge = await hre.ethers.getContractFactory("SimpleZKBadge");
  const zkBadge = await SimpleZKBadge.deploy();
  await zkBadge.waitForDeployment();
  const zkBadgeAddress = await zkBadge.getAddress();
  console.log(`✅ SimpleZKBadge: ${zkBadgeAddress}`);

  // Deploy CreditPassport
  console.log("\n📦 Deploying CreditPassport...");
  const CreditPassport = await hre.ethers.getContractFactory("CreditPassport");
  const passport = await CreditPassport.deploy();
  await passport.waitForDeployment();
  const passportAddress = await passport.getAddress();
  console.log(`✅ CreditPassport: ${passportAddress}`);

  // Deploy ProofRegistry
  console.log("\n📦 Deploying ProofRegistry...");
  const ProofRegistry = await hre.ethers.getContractFactory("ProofRegistry");
  const registry = await ProofRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`✅ ProofRegistry: ${registryAddress}`);

  // Save deployment info
  const deploymentInfo = {
    network,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      SimpleZKBadge: zkBadgeAddress,
      CreditPassport: passportAddress,
      ProofRegistry: registryAddress
    }
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${filename}`);

  console.log("\n✅ Deployment complete!");
  console.log("\n📋 Summary:");
  console.log(`Network: ${network}`);
  console.log(`Chain ID: ${hre.network.config.chainId}`);
  console.log(`SimpleZKBadge: ${zkBadgeAddress}`);
  console.log(`CreditPassport: ${passportAddress}`);
  console.log(`ProofRegistry: ${registryAddress}`);

  // Verification instructions
  if (network !== "localhost" && network !== "hardhat") {
    console.log("\n🔍 To verify contracts, run:");
    console.log(`npx hardhat verify --network ${network} ${zkBadgeAddress}`);
    console.log(`npx hardhat verify --network ${network} ${passportAddress}`);
    console.log(`npx hardhat verify --network ${network} ${registryAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
