# Wave 3 Quick Start Guide

Get started with Wave 3 features in 5 minutes.

---

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
source venv/bin/activate
pip install web3 eth-account
```

### 2. Configure RPC URLs

Add to `backend/.env`:

```bash
# Get free API keys from https://www.alchemy.com/
POLYGON_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### 3. Start Backend

```bash
cd backend
source venv/bin/activate
uvicorn server:app --reload --port 9000
```

---

## 🧪 Test DeFi Endpoints

### Get All DeFi Data

```bash
curl http://localhost:9000/api/defi/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1
```

**Response**:
```json
{
  "success": true,
  "data": {
    "wallet_address": "0x742d35...",
    "protocols": {
      "aave": {
        "total_collateral_usd": 50000,
        "total_debt_usd": 30000,
        "health_factor": 1.67
      },
      "uniswap": {
        "positions_count": 3,
        "total_liquidity_usd": 25000
      }
    },
    "summary": {
      "total_supplied_usd": 50000,
      "total_borrowed_usd": 30000,
      "protocols_used": 2
    }
  }
}
```

### Get DeFi Risk Score

```bash
curl http://localhost:9000/api/defi/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1/risk
```

**Response**:
```json
{
  "success": true,
  "wallet_address": "0x742d35...",
  "risk_score": 35.5,
  "risk_level": "low"
}
```

### Health Check

```bash
curl http://localhost:9000/api/defi/health
```

**Response**:
```json
{
  "success": true,
  "status": "healthy",
  "network": "polygon",
  "rpc_connected": true
}
```

---

## 📊 Frontend Integration

### Fetch DeFi Data

```javascript
// In your React component
import { useState, useEffect } from 'react';

function DeFiDashboard({ walletAddress }) {
  const [defiData, setDefiData] = useState(null);
  
  useEffect(() => {
    fetch(`/api/defi/${walletAddress}`)
      .then(res => res.json())
      .then(data => setDefiData(data.data));
  }, [walletAddress]);
  
  if (!defiData) return <div>Loading...</div>;
  
  const { protocols, summary } = defiData;
  
  return (
    <div>
      <h2>DeFi Portfolio</h2>
      
      {/* Aave Position */}
      {protocols.aave.total_collateral_usd > 0 && (
        <div>
          <h3>Aave</h3>
          <p>Collateral: ${protocols.aave.total_collateral_usd.toLocaleString()}</p>
          <p>Debt: ${protocols.aave.total_debt_usd.toLocaleString()}</p>
          <p>Health Factor: {protocols.aave.health_factor.toFixed(2)}</p>
          
          {protocols.aave.health_factor < 1.5 && (
            <div className="alert alert-warning">
              ⚠️ Low health factor! Risk of liquidation
            </div>
          )}
        </div>
      )}
      
      {/* Summary */}
      <div>
        <h3>Summary</h3>
        <p>Total Supplied: ${summary.total_supplied_usd.toLocaleString()}</p>
        <p>Total Borrowed: ${summary.total_borrowed_usd.toLocaleString()}</p>
        <p>Net Position: ${summary.net_position_usd.toLocaleString()}</p>
        <p>Protocols Used: {summary.protocols_used}</p>
      </div>
    </div>
  );
}
```

### Display Risk Score

```javascript
function RiskBadge({ walletAddress }) {
  const [risk, setRisk] = useState(null);
  
  useEffect(() => {
    fetch(`/api/defi/${walletAddress}/risk`)
      .then(res => res.json())
      .then(data => setRisk(data));
  }, [walletAddress]);
  
  if (!risk) return null;
  
  const getBadgeColor = (level) => {
    switch(level) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'red';
      default: return 'gray';
    }
  };
  
  return (
    <div className={`badge badge-${getBadgeColor(risk.risk_level)}`}>
      Risk Score: {risk.risk_score.toFixed(1)}/100
      <br />
      Level: {risk.risk_level.toUpperCase()}
    </div>
  );
}
```

---

## 🔧 Advanced Usage

### Custom Risk Scoring

```python
from defi_indexer import fetch_defi_data

def custom_risk_assessment(wallet_address):
    data = fetch_defi_data(wallet_address)
    summary = data['summary']
    
    # Your custom logic
    risk_factors = []
    
    # Check debt ratio
    if summary['total_supplied_usd'] > 0:
        debt_ratio = summary['total_borrowed_usd'] / summary['total_supplied_usd']
        if debt_ratio > 0.8:
            risk_factors.append('High debt ratio')
    
    # Check health factor
    aave = data['protocols']['aave']
    if 0 < aave['health_factor'] < 1.2:
        risk_factors.append('Low health factor')
    
    # Check protocol diversity
    if summary['protocols_used'] < 2:
        risk_factors.append('Low diversification')
    
    return {
        'risk_factors': risk_factors,
        'risk_count': len(risk_factors),
        'is_high_risk': len(risk_factors) >= 2
    }
```

### Batch Processing

```python
async def analyze_multiple_wallets(wallet_addresses):
    results = []
    
    for address in wallet_addresses:
        data = fetch_defi_data(address)
        risk_score = get_defi_risk_score(address)
        
        results.append({
            'address': address,
            'net_position': data['summary']['net_position_usd'],
            'risk_score': risk_score,
            'protocols': data['summary']['protocols_used']
        })
    
    return results
```

---

## 🎯 Use Cases

### 1. Lending Protocol Integration

```javascript
// Check if user is eligible for loan
async function checkLoanEligibility(walletAddress, loanAmount) {
  const defiData = await fetch(`/api/defi/${walletAddress}`).then(r => r.json());
  const riskData = await fetch(`/api/defi/${walletAddress}/risk`).then(r => r.json());
  
  const { summary } = defiData.data;
  const { risk_score } = riskData;
  
  // Eligibility criteria
  const hasCollateral = summary.total_supplied_usd >= loanAmount * 1.5;
  const lowRisk = risk_score < 50;
  const healthyPosition = summary.total_borrowed_usd < summary.total_supplied_usd * 0.7;
  
  return {
    eligible: hasCollateral && lowRisk && healthyPosition,
    max_loan: summary.total_supplied_usd * 0.7,
    suggested_rate: risk_score < 30 ? 5 : risk_score < 50 ? 8 : 12
  };
}
```

### 2. Portfolio Monitoring

```javascript
// Alert user if health factor drops
async function monitorHealthFactor(walletAddress) {
  const data = await fetch(`/api/defi/${walletAddress}`).then(r => r.json());
  const aave = data.data.protocols.aave;
  
  if (aave.health_factor > 0 && aave.health_factor < 1.5) {
    // Send notification
    await sendAlert({
      type: 'warning',
      message: `Health factor is ${aave.health_factor.toFixed(2)}. Consider adding collateral.`,
      action_url: '/dashboard/aave'
    });
  }
}
```

### 3. Credit Scoring Enhancement

```python
# Enhance AI Risk Oracle with DeFi data
from defi_indexer import fetch_defi_data, get_defi_risk_score

def enhanced_credit_score(wallet_address):
    # Get DeFi data
    defi_data = fetch_defi_data(wallet_address)
    defi_risk = get_defi_risk_score(wallet_address)
    
    # Base credit score
    base_score = 500
    
    # Bonus for DeFi activity
    if defi_data['summary']['total_supplied_usd'] > 10000:
        base_score += 100
    
    if defi_data['summary']['protocols_used'] >= 3:
        base_score += 50
    
    # Penalty for high risk
    base_score -= (defi_risk * 2)
    
    return max(300, min(850, base_score))
```

---

## 🐛 Troubleshooting

### Issue: "429 Too Many Requests"

**Solution**: You're using the demo RPC. Get a free API key from Alchemy:

```bash
# Sign up at https://www.alchemy.com/
# Create a new app
# Copy your API key
# Update .env
POLYGON_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_REAL_KEY
```

### Issue: "Module 'web3' not found"

**Solution**: Install web3 in your virtual environment:

```bash
source venv/bin/activate
pip install web3 eth-account
```

### Issue: "All data is mock"

**Solution**: Check your RPC connection:

```bash
curl http://localhost:9000/api/defi/health
```

If `rpc_connected: false`, verify your RPC URL in `.env`.

---

## 📚 Next Steps

1. ✅ Test DeFi endpoints locally
2. Get real Alchemy API key
3. Test with wallets that have DeFi positions
4. Integrate into frontend
5. Deploy to production

---

## 🔗 Resources

- [Aave V3 Docs](https://docs.aave.com/developers/getting-started/readme)
- [Uniswap V3 Docs](https://docs.uniswap.org/contracts/v3/overview)
- [Alchemy Dashboard](https://dashboard.alchemy.com/)
- [Web3.py Docs](https://web3py.readthedocs.io/)

---

**Need Help?** Check [WAVE3_IMPLEMENTATION.md](WAVE3_IMPLEMENTATION.md) for detailed documentation.

**"Universal Trust in a Trustless World"** 🚀
