"""
Test DeFi Indexer
Quick test script for DeFi data fetching
"""

import asyncio
from defi_indexer import fetch_defi_data, get_defi_risk_score

# Test wallets
TEST_WALLETS = [
    "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",  # Alice
    "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",  # Bob
    "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",  # Charlie
]

def test_defi_data():
    """Test DeFi data fetching"""
    print("🧪 Testing DeFi Indexer\n")
    
    for wallet in TEST_WALLETS:
        print(f"📊 Wallet: {wallet}")
        print("-" * 60)
        
        # Fetch all DeFi data
        data = fetch_defi_data(wallet)
        
        # Display summary
        summary = data.get("summary", {})
        print(f"  Total Supplied: ${summary.get('total_supplied_usd', 0):,.2f}")
        print(f"  Total Borrowed: ${summary.get('total_borrowed_usd', 0):,.2f}")
        print(f"  Total Liquidity: ${summary.get('total_liquidity_usd', 0):,.2f}")
        print(f"  Net Position: ${summary.get('net_position_usd', 0):,.2f}")
        print(f"  Protocols Used: {summary.get('protocols_used', 0)}")
        
        # Display Aave data
        aave = data.get("protocols", {}).get("aave", {})
        if aave.get("total_collateral_usd", 0) > 0:
            print(f"\n  💎 Aave:")
            print(f"    Collateral: ${aave.get('total_collateral_usd', 0):,.2f}")
            print(f"    Debt: ${aave.get('total_debt_usd', 0):,.2f}")
            print(f"    Health Factor: {aave.get('health_factor', 0):.2f}")
        
        # Calculate risk score
        risk_score = get_defi_risk_score(wallet)
        risk_level = "LOW" if risk_score < 40 else "MEDIUM" if risk_score < 70 else "HIGH"
        print(f"\n  ⚠️  Risk Score: {risk_score:.1f}/100 ({risk_level})")
        
        # Check if real data
        is_real = data.get("protocols", {}).get("aave", {}).get("is_mock", True)
        print(f"  📡 Data Source: {'MOCK' if is_real else 'REAL ON-CHAIN'}")
        
        print("\n")

if __name__ == "__main__":
    test_defi_data()
