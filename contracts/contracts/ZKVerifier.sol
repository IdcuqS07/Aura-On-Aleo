// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZKVerifier
 * @notice On-chain ZK proof verification for Aura Protocol
 * @dev Verifies Groth16 proofs for credit score attestations
 */
contract ZKVerifier {
    
    struct Proof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
    }
    
    // Events
    event ProofVerified(address indexed user, bytes32 proofHash, bool valid);
    event ThresholdProofVerified(address indexed user, uint256 threshold, bool valid);
    
    // Verified proofs registry
    mapping(bytes32 => bool) public verifiedProofs;
    mapping(address => bytes32) public userLatestProof;
    
    /**
     * @notice Verify a Groth16 ZK proof
     * @param proof The proof components (a, b, c)
     * @param publicSignals Public inputs to the circuit
     * @return valid Whether the proof is valid
     */
    function verifyProof(
        Proof calldata proof,
        uint256[] calldata publicSignals
    ) external returns (bool valid) {
        // Generate proof hash
        bytes32 proofHash = keccak256(abi.encodePacked(
            proof.a,
            proof.b,
            proof.c,
            publicSignals
        ));
        
        // Mock verification (replace with real Groth16 verifier)
        valid = _mockVerify(proof, publicSignals);
        
        if (valid) {
            verifiedProofs[proofHash] = true;
            userLatestProof[msg.sender] = proofHash;
        }
        
        emit ProofVerified(msg.sender, proofHash, valid);
        return valid;
    }
    
    /**
     * @notice Verify credit score threshold without revealing exact score
     * @param proof The ZK proof
     * @param threshold Minimum credit score threshold
     * @return valid Whether user's score >= threshold
     */
    function verifyThreshold(
        Proof calldata proof,
        uint256 threshold
    ) external returns (bool valid) {
        // Public signals: [threshold, nullifier]
        uint256[] memory publicSignals = new uint256[](2);
        publicSignals[0] = threshold;
        publicSignals[1] = uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        
        valid = _mockVerify(proof, publicSignals);
        
        emit ThresholdProofVerified(msg.sender, threshold, valid);
        return valid;
    }
    
    /**
     * @notice Check if a proof has been verified
     * @param proofHash Hash of the proof
     * @return Whether the proof is verified
     */
    function isProofVerified(bytes32 proofHash) external view returns (bool) {
        return verifiedProofs[proofHash];
    }
    
    /**
     * @notice Get user's latest verified proof
     * @param user User address
     * @return proofHash Hash of latest proof
     */
    function getUserLatestProof(address user) external view returns (bytes32) {
        return userLatestProof[user];
    }
    
    /**
     * @dev Mock verification (replace with real Groth16 verifier)
     * In production, use Polygon ID verifier or snarkjs verifier
     */
    function _mockVerify(
        Proof calldata proof,
        uint256[] memory publicSignals
    ) internal pure returns (bool) {
        // Basic validation
        require(proof.a.length == 2, "Invalid proof.a");
        require(proof.b.length == 2, "Invalid proof.b");
        require(proof.c.length == 2, "Invalid proof.c");
        require(publicSignals.length > 0, "No public signals");
        
        // Mock: Always return true for non-zero proofs
        return proof.a[0] != 0 || proof.a[1] != 0;
    }
}
