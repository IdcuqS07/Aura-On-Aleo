# 🚀 Deploy ZKVerifier Contract

Quick guide to deploy ZKVerifier to Polygon Amoy.

---

## 📋 Prerequisites

1. **Wallet with POL tokens**
   - Get free testnet POL from: https://faucet.polygon.technology/
   - Need ~0.1 POL for deployment

2. **Private Key**
   - Export from MetaMask: Settings → Security & Privacy → Show Private Key

3. **PolygonScan API Key** (optional, for verification)
   - Get from: https://polygonscan.com/apis

---

## ⚙️ Setup

### 1. Configure Environment

Edit `contracts/.env`:

```bash
PRIVATE_KEY=your_private_key_without_0x
POLYGONSCAN_API_KEY=your_api_key_here
```

### 2. Check Balance

```bash
cd contracts
npx hardhat run scripts/check-balance.js --network amoy
```

---

## 🚀 Deploy

```bash
cd contracts
npx hardhat run scripts/deploy-zk-verifier.js --network amoy
```

**Expected output**:
```
🚀 Deploying ZKVerifier contract...

Deploying with account: 0x742d35...
Account balance: 0.5 POL

✅ ZKVerifier deployed to: 0x...
📝 Deployment info saved
🔗 View on PolygonScan: https://amoy.polygonscan.com/address/0x...
```

---

## ✅ Verify Deployment

### Check on PolygonScan

Visit: `https://amoy.polygonscan.com/address/<CONTRACT_ADDRESS>`

### Test Contract

```bash
npx hardhat run scripts/test-verifier.js --network amoy
```

---

## 📝 Save Deployment Info

Deployment details saved to:
```
contracts/deployments/zk-verifier-amoy.json
```

Contains:
- Contract address
- Deployer address
- Block number
- Timestamp

---

## 🔗 Update Backend

Add to `backend/.env`:

```bash
ZK_VERIFIER_ADDRESS=0x<CONTRACT_ADDRESS>
```

Update `backend/polygon_zk_service.py`:

```python
VERIFIER_ADDRESS = os.getenv("ZK_VERIFIER_ADDRESS", "0x...")
```

---

## 🐛 Troubleshooting

### "Insufficient funds"
Get more POL from faucet: https://faucet.polygon.technology/

### "Nonce too high"
Reset account in MetaMask: Settings → Advanced → Reset Account

### "Network error"
Check RPC: https://rpc-amoy.polygon.technology

---

## 🎉 After Deployment

1. ✅ Contract deployed
2. ✅ Address saved
3. ✅ Update backend config
4. ✅ Test verification
5. ✅ Update README

---

**Ready to deploy? Run the command above!** 🚀
