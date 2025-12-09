const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZKVerifier", function () {
  let verifier;
  let owner, user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    
    const ZKVerifier = await ethers.getContractFactory("ZKVerifier");
    verifier = await ZKVerifier.deploy();
    await verifier.waitForDeployment();
  });

  describe("Proof Verification", function () {
    it("Should verify a valid proof", async function () {
      const proof = {
        a: [1, 2],
        b: [[3, 4], [5, 6]],
        c: [7, 8]
      };
      const publicSignals = [100, 200];

      const tx = await verifier.verifyProof(proof, publicSignals);
      const receipt = await tx.wait();
      
      expect(receipt.status).to.equal(1);
    });

    it("Should reject invalid proof", async function () {
      const proof = {
        a: [0, 0],
        b: [[0, 0], [0, 0]],
        c: [0, 0]
      };
      const publicSignals = [100];

      const valid = await verifier.verifyProof.staticCall(proof, publicSignals);
      expect(valid).to.equal(false);
    });

    it("Should store verified proof hash", async function () {
      const proof = {
        a: [1, 2],
        b: [[3, 4], [5, 6]],
        c: [7, 8]
      };
      const publicSignals = [100];

      await verifier.verifyProof(proof, publicSignals);
      
      const proofHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["uint256[2]", "uint256[2][2]", "uint256[2]", "uint256[]"],
          [proof.a, proof.b, proof.c, publicSignals]
        )
      );

      const isVerified = await verifier.isProofVerified(proofHash);
      expect(isVerified).to.equal(true);
    });
  });

  describe("Threshold Verification", function () {
    it("Should verify threshold proof", async function () {
      const proof = {
        a: [1, 2],
        b: [[3, 4], [5, 6]],
        c: [7, 8]
      };
      const threshold = 700;

      const valid = await verifier.verifyThreshold.staticCall(proof, threshold);
      expect(valid).to.equal(true);
    });

    it("Should emit ThresholdProofVerified event", async function () {
      const proof = {
        a: [1, 2],
        b: [[3, 4], [5, 6]],
        c: [7, 8]
      };
      const threshold = 700;

      await expect(verifier.verifyThreshold(proof, threshold))
        .to.emit(verifier, "ThresholdProofVerified")
        .withArgs(owner.address, threshold, true);
    });
  });

  describe("User Proof Registry", function () {
    it("Should track user's latest proof", async function () {
      const proof = {
        a: [1, 2],
        b: [[3, 4], [5, 6]],
        c: [7, 8]
      };
      const publicSignals = [100];

      await verifier.verifyProof(proof, publicSignals);
      
      const latestProof = await verifier.getUserLatestProof(owner.address);
      expect(latestProof).to.not.equal(ethers.ZeroHash);
    });
  });
});
