/**
 * Multi-Chain Deployment Script
 * Deploys SimpleZKBadge, CreditPassport, and ProofRegistry to multiple networks
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { networks } = require("../multichain-config");

async function main() {
  const networkName = hre.network.name;
  const chainId = hre.network.config.chainId;
  
  console.log(`\n🚀 Deploying to ${networkName} (Chain ID: ${chainId})`);
  console.log("================================================");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deployer: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ${networks[networkName]?.nativeCurrency.symbol || 'ETH'}`);

  // Deploy SimpleZKBadge
  console.log("\n📦 Deploying SimpleZKBadge...");
  const SimpleZKBadge = await hre.ethers.getContractFactory("SimpleZKBadge");
  const zkBadge = await SimpleZKBadge.deploy();
  await zkBadge.waitForDeployment();
  const zkBadgeAddress = await zkBadge.getAddress();
  console.log(`✅ SimpleZKBadge deployed: ${zkBadgeAddress}`);

  // Deploy CreditPassport
  console.log("\n📦 Deploying CreditPassport...");
  const CreditPassport = await hre.ethers.getContractFactory("CreditPassport");
  const creditPassport = await CreditPassport.deploy();
  await creditPassport.waitForDeployment();
  const creditPassportAddress = await creditPassport.getAddress();
  console.log(`✅ CreditPassport deployed: ${creditPassportAddress}`);

  // Deploy ProofRegistry
  console.log("\n📦 Deploying ProofRegistry...");
  const ProofRegistry = await hre.ethers.getContractFactory("ProofRegistry");
  const proofRegistry = await ProofRegistry.deploy();
  await proofRegistry.waitForDeployment();
  const proofRegistryAddress = await proofRegistry.getAddress();
  console.log(`✅ ProofRegistry deployed: ${proofRegistryAddress}`);

  // Save deployment info
  const deployment = {
    network: networkName,
    chainId: chainId,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      SimpleZKBadge: zkBadgeAddress,
      CreditPassport: creditPassportAddress,
      ProofRegistry: proofRegistryAddress
    },
    explorer: networks[networkName]?.explorer || ""
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2));
  console.log(`\n💾 Deployment saved to: ${deploymentFile}`);

  console.log("\n📋 Deployment Summary:");
  console.log("================================================");
  console.log(`Network: ${networkName}`);
  console.log(`Chain ID: ${chainId}`);
  console.log(`SimpleZKBadge: ${zkBadgeAddress}`);
  console.log(`CreditPassport: ${creditPassportAddress}`);
  console.log(`ProofRegistry: ${proofRegistryAddress}`);
  console.log(`Explorer: ${networks[networkName]?.explorer || 'N/A'}`);
  console.log("================================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
