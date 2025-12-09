const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying ZKVerifier contract...\n");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "POL\n");

  // Deploy ZKVerifier
  const ZKVerifier = await hre.ethers.getContractFactory("ZKVerifier");
  const verifier = await ZKVerifier.deploy();
  await verifier.waitForDeployment();

  const verifierAddress = await verifier.getAddress();
  console.log("✅ ZKVerifier deployed to:", verifierAddress);

  // Save deployment info
  const deployment = {
    network: hre.network.name,
    verifier: verifierAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  fs.writeFileSync(
    "deployments/zk-verifier-amoy.json",
    JSON.stringify(deployment, null, 2)
  );

  console.log("\n📝 Deployment info saved to deployments/zk-verifier-amoy.json");
  console.log("\n🔗 View on PolygonScan:");
  console.log(`https://amoy.polygonscan.com/address/${verifierAddress}`);
  
  console.log("\n⏳ Waiting 30s before verification...");
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  // Verify contract
  try {
    console.log("\n🔍 Verifying contract...");
    await hre.run("verify:verify", {
      address: verifierAddress,
      constructorArguments: []
    });
    console.log("✅ Contract verified!");
  } catch (error) {
    console.log("⚠️ Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
