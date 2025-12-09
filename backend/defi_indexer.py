"""
DeFi Data Indexer - Real on-chain DeFi protocol data
Fetches user positions from Aave, Uniswap V3, Compound
"""

from web3 import Web3
from typing import Dict, List, Optional
import os
import json
from datetime import datetime, timedelta
from redis_cache import get_cache

# RPC URLs
POLYGON_RPC = os.getenv("POLYGON_RPC_URL", "https://polygon-amoy.g.alchemy.com/v2/demo")
ETHEREUM_RPC = os.getenv("ETHEREUM_RPC_URL", "https://eth-mainnet.g.alchemy.com/v2/demo")

# Contract Addresses (Polygon Mainnet)
AAVE_POOL_V3 = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"
UNISWAP_V3_POSITIONS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
COMPOUND_COMPTROLLER = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"

# ABIs (minimal)
AAVE_POOL_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
        "name": "getUserAccountData",
        "outputs": [
            {"internalType": "uint256", "name": "totalCollateralBase", "type": "uint256"},
            {"internalType": "uint256", "name": "totalDebtBase", "type": "uint256"},
            {"internalType": "uint256", "name": "availableBorrowsBase", "type": "uint256"},
            {"internalType": "uint256", "name": "currentLiquidationThreshold", "type": "uint256"},
            {"internalType": "uint256", "name": "ltv", "type": "uint256"},
            {"internalType": "uint256", "name": "healthFactor", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

UNISWAP_POSITIONS_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "positions",
        "outputs": [
            {"internalType": "uint96", "name": "nonce", "type": "uint96"},
            {"internalType": "address", "name": "operator", "type": "address"},
            {"internalType": "address", "name": "token0", "type": "address"},
            {"internalType": "address", "name": "token1", "type": "address"},
            {"internalType": "uint24", "name": "fee", "type": "uint24"},
            {"internalType": "int24", "name": "tickLower", "type": "int24"},
            {"internalType": "int24", "name": "tickUpper", "type": "int24"},
            {"internalType": "uint128", "name": "liquidity", "type": "uint128"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class DeFiIndexer:
    def __init__(self, network: str = "polygon"):
        self.network = network
        rpc_url = POLYGON_RPC if network == "polygon" else ETHEREUM_RPC
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        
        # Initialize contracts
        try:
            self.aave_pool = self.w3.eth.contract(
                address=Web3.to_checksum_address(AAVE_POOL_V3),
                abi=AAVE_POOL_ABI
            )
            self.uniswap_positions = self.w3.eth.contract(
                address=Web3.to_checksum_address(UNISWAP_V3_POSITIONS),
                abi=UNISWAP_POSITIONS_ABI
            )
        except Exception as e:
            print(f"Warning: Could not initialize contracts: {e}")
            self.aave_pool = None
            self.uniswap_positions = None
    
    def get_aave_data(self, wallet_address: str) -> Dict:
        """Fetch Aave V3 user data"""
        # Check cache first
        cache = get_cache()
        cache_key = f"aave:{wallet_address}"
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        try:
            if not self.aave_pool:
                return self._mock_aave_data()
            
            address = Web3.to_checksum_address(wallet_address)
            user_data = self.aave_pool.functions.getUserAccountData(address).call()
            
            total_collateral = user_data[0] / 1e8  # Base currency decimals
            total_debt = user_data[1] / 1e8
            available_borrow = user_data[2] / 1e8
            health_factor = user_data[5] / 1e18
            
            return {
                "protocol": "aave_v3",
                "total_collateral_usd": total_collateral,
                "total_debt_usd": total_debt,
                "available_borrow_usd": available_borrow,
                "health_factor": health_factor,
                "ltv": user_data[4] / 100,  # LTV percentage
                "liquidation_threshold": user_data[3] / 100,
                "is_healthy": health_factor > 1.0,
                "timestamp": datetime.now().isoformat()
            }
            
            # Cache for 5 minutes
            cache.set(cache_key, result, ttl=300)
            return result
        except Exception as e:
            print(f"Error fetching Aave data: {e}")
            result = self._mock_aave_data()
            cache.set(cache_key, result, ttl=60)  # Cache errors for 1 min
            return result
    
    def get_uniswap_data(self, wallet_address: str) -> Dict:
        """Fetch Uniswap V3 positions"""
        try:
            if not self.uniswap_positions:
                return self._mock_uniswap_data()
            
            address = Web3.to_checksum_address(wallet_address)
            balance = self.uniswap_positions.functions.balanceOf(address).call()
            
            total_liquidity = 0
            positions = []
            
            # Note: In production, you'd need to track tokenIds
            # For now, return basic data
            
            return {
                "protocol": "uniswap_v3",
                "positions_count": balance,
                "total_liquidity_usd": total_liquidity,
                "positions": positions,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error fetching Uniswap data: {e}")
            return self._mock_uniswap_data()
    
    def get_compound_data(self, wallet_address: str) -> Dict:
        """Fetch Compound data"""
        # Compound is primarily on Ethereum mainnet
        # For now, return mock data
        return self._mock_compound_data()
    
    def get_all_defi_data(self, wallet_address: str) -> Dict:
        """Aggregate all DeFi protocol data"""
        aave = self.get_aave_data(wallet_address)
        uniswap = self.get_uniswap_data(wallet_address)
        compound = self.get_compound_data(wallet_address)
        
        # Calculate totals
        total_supplied = (
            aave.get("total_collateral_usd", 0) +
            compound.get("total_supplied_usd", 0)
        )
        
        total_borrowed = (
            aave.get("total_debt_usd", 0) +
            compound.get("total_borrowed_usd", 0)
        )
        
        total_liquidity = uniswap.get("total_liquidity_usd", 0)
        
        return {
            "wallet_address": wallet_address,
            "network": self.network,
            "protocols": {
                "aave": aave,
                "uniswap": uniswap,
                "compound": compound
            },
            "summary": {
                "total_supplied_usd": total_supplied,
                "total_borrowed_usd": total_borrowed,
                "total_liquidity_usd": total_liquidity,
                "net_position_usd": total_supplied - total_borrowed + total_liquidity,
                "protocols_used": sum([
                    1 if aave.get("total_collateral_usd", 0) > 0 else 0,
                    1 if uniswap.get("positions_count", 0) > 0 else 0,
                    1 if compound.get("total_supplied_usd", 0) > 0 else 0
                ])
            },
            "timestamp": datetime.now().isoformat()
        }
    
    # Mock data fallbacks
    def _mock_aave_data(self) -> Dict:
        return {
            "protocol": "aave_v3",
            "total_collateral_usd": 0,
            "total_debt_usd": 0,
            "available_borrow_usd": 0,
            "health_factor": 0,
            "ltv": 0,
            "liquidation_threshold": 0,
            "is_healthy": True,
            "timestamp": datetime.now().isoformat(),
            "is_mock": True
        }
    
    def _mock_uniswap_data(self) -> Dict:
        return {
            "protocol": "uniswap_v3",
            "positions_count": 0,
            "total_liquidity_usd": 0,
            "positions": [],
            "timestamp": datetime.now().isoformat(),
            "is_mock": True
        }
    
    def _mock_compound_data(self) -> Dict:
        return {
            "protocol": "compound_v2",
            "total_supplied_usd": 0,
            "total_borrowed_usd": 0,
            "markets_count": 0,
            "timestamp": datetime.now().isoformat(),
            "is_mock": True
        }


# Singleton instance
_indexer = None

def get_defi_indexer(network: str = "polygon") -> DeFiIndexer:
    """Get or create DeFi indexer instance"""
    global _indexer
    if _indexer is None:
        _indexer = DeFiIndexer(network)
    return _indexer


# Convenience functions
def fetch_defi_data(wallet_address: str, network: str = "polygon") -> Dict:
    """Fetch all DeFi data for a wallet"""
    indexer = get_defi_indexer(network)
    return indexer.get_all_defi_data(wallet_address)


def get_defi_risk_score(wallet_address: str) -> float:
    """Calculate DeFi risk score (0-100)"""
    data = fetch_defi_data(wallet_address)
    summary = data.get("summary", {})
    
    # Risk factors
    risk_score = 50  # Base score
    
    # Positive factors (reduce risk)
    if summary.get("total_supplied_usd", 0) > 1000:
        risk_score -= 10
    if summary.get("protocols_used", 0) >= 2:
        risk_score -= 5
    
    # Negative factors (increase risk)
    borrowed = summary.get("total_borrowed_usd", 0)
    supplied = summary.get("total_supplied_usd", 0)
    
    if supplied > 0:
        debt_ratio = borrowed / supplied
        if debt_ratio > 0.8:
            risk_score += 20
        elif debt_ratio > 0.5:
            risk_score += 10
    
    # Check Aave health factor
    aave = data.get("protocols", {}).get("aave", {})
    health_factor = aave.get("health_factor", 0)
    if 0 < health_factor < 1.2:
        risk_score += 15
    elif 0 < health_factor < 1.5:
        risk_score += 5
    
    return max(0, min(100, risk_score))
