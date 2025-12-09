const hre = require("hardhat");

async function main() {
  console.log("💰 Checking wallet balance...\n");

  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Wallet address:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInPOL = hre.ethers.formatEther(balance);
  
  console.log("Balance:", balanceInPOL, "POL");
  
  if (parseFloat(balanceInPOL) < 0.01) {
    console.log("\n⚠️  Low balance! Get testnet POL from:");
    console.log("https://faucet.polygon.technology/");
  } else {
    console.log("\n✅ Sufficient balance for deployment");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
