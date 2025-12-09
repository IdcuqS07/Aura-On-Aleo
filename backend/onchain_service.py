"""
On-chain Data Collection Service
Fetch wallet and DeFi data from blockchain
"""

from typing import Dict
import logging
from defi_indexer import fetch_defi_data as get_real_defi_data, get_defi_risk_score

logger = logging.getLogger(__name__)


async def fetch_wallet_data(wallet_address: str) -> Dict:
    """Fetch wallet transaction data"""
    try:
        # Placeholder - integrate with Alchemy/Etherscan API
        return {
            'tx_count': 450,
            'volume_usd': 125500,
            'age_days': 730,
            'unique_contracts': 25,
            'score': 90
        }
    except Exception as e:
        logger.error(f"Wallet data fetch failed: {e}")
        return {}


async def fetch_defi_data(wallet_address: str) -> Dict:
    """Fetch REAL DeFi protocol data from Aave, Uniswap, Compound"""
    try:
        # Get real on-chain DeFi data
        real_data = get_real_defi_data(wallet_address)
        summary = real_data.get("summary", {})
        protocols = real_data.get("protocols", {})
        
        # Extract key metrics
        borrowed = summary.get("total_borrowed_usd", 0)
        supplied = summary.get("total_supplied_usd", 0)
        
        # Get Aave health factor
        aave = protocols.get("aave", {})
        health_factor = aave.get("health_factor", 0)
        
        # Calculate repayment rate (100% if healthy, lower if at risk)
        repayment_rate = 100
        if 0 < health_factor < 1.2:
            repayment_rate = 70
        elif 0 < health_factor < 1.5:
            repayment_rate = 85
        
        # Get protocol names
        protocol_names = []
        if aave.get("total_collateral_usd", 0) > 0:
            protocol_names.append("Aave")
        if protocols.get("uniswap", {}).get("positions_count", 0) > 0:
            protocol_names.append("Uniswap")
        if protocols.get("compound", {}).get("total_supplied_usd", 0) > 0:
            protocol_names.append("Compound")
        
        # Calculate DeFi score
        defi_score = 100 - get_defi_risk_score(wallet_address)
        
        return {
            'borrowed': borrowed,
            'supplied': supplied,
            'repayment_rate': repayment_rate,
            'liquidations': 0 if health_factor > 1.5 or health_factor == 0 else 1,
            'protocols': protocol_names,
            'score': defi_score,
            'health_factor': health_factor,
            'net_position': summary.get("net_position_usd", 0),
            'is_real_data': not aave.get("is_mock", False)
        }
    except Exception as e:
        logger.error(f"DeFi data fetch failed: {e}")
        # Fallback to mock data
        return {
            'borrowed': 0,
            'supplied': 0,
            'repayment_rate': 100,
            'liquidations': 0,
            'protocols': [],
            'score': 50,
            'is_real_data': False
        }


async def get_onchain_data(wallet_address: str) -> Dict:
    """Get on-chain data (alias for fetch_wallet_data)"""
    return await fetch_wallet_data(wallet_address)
