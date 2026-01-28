"""
Aleo API Routes
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from aleo_service import aleo_service

router = APIRouter(prefix="/api/aleo", tags=["aleo"])

class IssueBadgeRequest(BaseModel):
    recipient: str
    badge_type: int
    zk_proof_hash: int

class AuthorizeMinterRequest(BaseModel):
    minter_address: str

@router.get("/status")
async def get_aleo_status():
    """Get Aleo integration status"""
    return aleo_service.get_program_status()

@router.post("/badge/issue")
async def issue_badge(request: IssueBadgeRequest):
    """Issue ZK badge on Aleo"""
    result = aleo_service.issue_badge(
        request.recipient,
        request.badge_type,
        request.zk_proof_hash
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result

@router.post("/minter/authorize")
async def authorize_minter(request: AuthorizeMinterRequest):
    """Authorize minter"""
    result = aleo_service.authorize_minter(request.minter_address)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result

@router.get("/health")
async def health_check():
    """Health check for Aleo service"""
    status = aleo_service.get_program_status()
    
    return {
        "status": "healthy" if status.get("leo_installed") else "degraded",
        "leo_installed": status.get("leo_installed", False),
        "details": status
    }
