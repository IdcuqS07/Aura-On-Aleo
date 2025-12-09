"""
DeFi Data API Routes
Real-time DeFi protocol data endpoints
"""

from fastapi import APIRouter, HTTPException
from typing import Dict
from defi_indexer import fetch_defi_data, get_defi_risk_score, get_defi_indexer

router = APIRouter()


@router.get("/defi/{wallet_address}")
async def get_defi_data(wallet_address: str) -> Dict:
    """Get all DeFi protocol data for a wallet"""
    try:
        data = fetch_defi_data(wallet_address)
        return {
            "success": True,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/defi/{wallet_address}/aave")
async def get_aave_data(wallet_address: str) -> Dict:
    """Get Aave protocol data"""
    try:
        indexer = get_defi_indexer()
        data = indexer.get_aave_data(wallet_address)
        return {
            "success": True,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/defi/{wallet_address}/uniswap")
async def get_uniswap_data(wallet_address: str) -> Dict:
    """Get Uniswap V3 positions"""
    try:
        indexer = get_defi_indexer()
        data = indexer.get_uniswap_data(wallet_address)
        return {
            "success": True,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/defi/{wallet_address}/risk")
async def get_defi_risk(wallet_address: str) -> Dict:
    """Get DeFi risk score"""
    try:
        risk_score = get_defi_risk_score(wallet_address)
        return {
            "success": True,
            "wallet_address": wallet_address,
            "risk_score": risk_score,
            "risk_level": "low" if risk_score < 40 else "medium" if risk_score < 70 else "high"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/defi/health")
async def health_check() -> Dict:
    """Health check for DeFi indexer"""
    try:
        indexer = get_defi_indexer()
        is_connected = indexer.w3.is_connected() if indexer.w3 else False
        
        from redis_cache import get_cache
        cache = get_cache()
        
        return {
            "success": True,
            "status": "healthy" if is_connected else "degraded",
            "network": indexer.network,
            "rpc_connected": is_connected,
            "cache_enabled": cache.enabled
        }
    except Exception as e:
        return {
            "success": False,
            "status": "unhealthy",
            "error": str(e)
        }

@router.get("/defi/cache/clear")
async def clear_cache(pattern: str = "aave:*") -> Dict:
    """Clear DeFi cache"""
    from redis_cache import get_cache
    cache = get_cache()
    
    if cache.clear_pattern(pattern):
        return {"success": True, "message": f"Cache cleared: {pattern}"}
    return {"success": False, "message": "Cache not available"}
