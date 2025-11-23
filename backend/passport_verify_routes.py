"""
Passport Verification Routes
Public and Partner endpoints for passport verification
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

from api_key_auth import verify_api_key

router = APIRouter(prefix="/api/passport", tags=["Passport Verification"])

# Global db reference
_db = None

def set_db(db):
    global _db
    _db = db


@router.get("/verify/{passport_id}")
async def verify_passport_public(passport_id: str):
    """
    Public endpoint - Verify passport validity (NO SCORE DATA)
    
    Returns:
    - valid: boolean
    - passport_id: string
    - issued_at: datetime
    - poh_status: verified/suspicious
    """
    
    try:
        # Find passport
        passport = await _db.passports.find_one({"passport_id": passport_id})
        
        if not passport:
            return {
                "valid": False,
                "passport_id": passport_id,
                "message": "Passport not found"
            }
        
        # Determine PoH status
        poh_score = passport.get('poh_score', 0) or passport.get('pohScore', 0)
        fraud_detected = passport.get('fraud_detected', False)
        
        if fraud_detected:
            poh_status = "suspicious"
        elif poh_score >= 70:
            poh_status = "verified"
        elif poh_score >= 50:
            poh_status = "verified"
        else:
            poh_status = "suspicious"
        
        return {
            "valid": True,
            "passport_id": passport_id,
            "issued_at": passport.get('issued_at', passport.get('issuedAt', datetime.utcnow().isoformat())),
            "poh_status": poh_status
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/partner/{passport_id}")
async def get_passport_partner(
    passport_id: str,
    api_key_info: Dict = Depends(verify_api_key)
):
    """
    Partner endpoint - Get full passport data (REQUIRES API KEY)
    
    Returns:
    - Full passport data including scores and risk assessment
    """
    
    try:
        # Find passport
        passport = await _db.passports.find_one({"passport_id": passport_id})
        
        if not passport:
            raise HTTPException(status_code=404, detail="Passport not found")
        
        # Get AI assessment if available
        assessment = None
        if passport.get('wallet_address') or passport.get('owner'):
            wallet = passport.get('wallet_address') or passport.get('owner')
            
            # Try to get latest assessment
            from ai_models import ai_oracle_v2
            
            user_data = {
                'wallet_address': wallet,
                'credit_score': passport.get('credit_score', 0),
                'poh_score': passport.get('poh_score', 0) or passport.get('pohScore', 0),
                'badge_count': passport.get('badge_count', 0) or passport.get('badgeCount', 0),
                'account_age_days': (datetime.utcnow() - datetime.fromisoformat(
                    passport.get('issued_at', passport.get('issuedAt', datetime.utcnow().isoformat()))
                )).days if isinstance(passport.get('issued_at') or passport.get('issuedAt'), str) else 0
            }
            
            assessment = ai_oracle_v2.assess_risk(user_data)
        
        # Update API key usage
        await _db.api_keys.update_one(
            {'api_key': api_key_info.get('api_key')},
            {'$inc': {'requests_used': 1}}
        )
        
        return {
            "success": True,
            "passport_id": passport_id,
            "owner": passport.get('wallet_address') or passport.get('owner'),
            "credit_score": passport.get('credit_score', 0),
            "grade": passport.get('grade', 'N/A'),
            "risk_level": passport.get('risk_level', 'unknown'),
            "poh_score": passport.get('poh_score', 0) or passport.get('pohScore', 0),
            "badge_count": passport.get('badge_count', 0) or passport.get('badgeCount', 0),
            "issued_at": passport.get('issued_at', passport.get('issuedAt')),
            "last_updated": passport.get('last_updated', passport.get('lastUpdated')),
            "assessment": assessment,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
