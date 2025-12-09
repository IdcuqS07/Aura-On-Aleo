"""
ZK Proof API Routes
"""

from fastapi import APIRouter, HTTPException, Security
from typing import Dict
from pydantic import BaseModel
from polygon_zk_service import get_zk_service
from api_key_auth import verify_api_key

router = APIRouter(prefix="/api/zk", tags=["zk-proofs"])

class ProofRequest(BaseModel):
    wallet_address: str
    credit_score: int
    claim_type: str = "credit_score"

class VerifyRequest(BaseModel):
    proof: Dict
    public_signals: list

@router.post("/generate")
async def generate_proof(
    request: ProofRequest,
    api_key_info = Security(verify_api_key)
):
    """Generate ZK proof for credit score"""
    service = get_zk_service()
    
    claim_data = {
        "wallet_address": request.wallet_address,
        "credit_score": request.credit_score,
        "claim_type": request.claim_type
    }
    
    proof = service.generate_proof(claim_data)
    
    return {
        "success": True,
        "proof": proof,
        "claim_data": claim_data
    }

@router.post("/verify")
async def verify_proof(request: VerifyRequest):
    """Verify ZK proof"""
    service = get_zk_service()
    
    is_valid = service.verify_proof(request.proof, request.public_signals)
    
    return {
        "success": True,
        "valid": is_valid,
        "verified_at": service._generate_mock_proof({}).get("timestamp")
    }

@router.get("/health")
async def health_check():
    """Health check"""
    service = get_zk_service()
    
    return {
        "success": True,
        "status": "healthy",
        "issuer_did": service.issuer_did,
        "mock_mode": service.use_mock
    }
