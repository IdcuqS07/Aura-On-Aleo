# 🚀 Deploy The Graph Subgraph NOW

Step-by-step deployment to The Graph Studio.

---

## ✅ Pre-Deployment Checklist

- [x] Schema created (`schema.graphql`)
- [x] Mappings written (`badge-mapping.ts`, `passport-mapping.ts`)
- [x] ABIs present (`abis/SimpleZKBadge.json`, `abis/CreditPassport.json`)
- [x] Codegen successful
- [x] Build successful

**Status**: Ready to deploy! 🎉

---

## 📋 Deployment Steps

### Step 1: Install Graph CLI

```bash
npm install -g @graphprotocol/graph-cli
```

**Verify installation**:
```bash
graph --version
```

---

### Step 2: Create Subgraph on The Graph Studio

1. Visit: **https://thegraph.com/studio/**
2. Click **"Connect Wallet"**
3. Connect your MetaMask/wallet
4. Click **"Create a Subgraph"**
5. Enter name: **`aura-protocol`**
6. Click **"Create Subgraph"**

**You'll see**:
- Subgraph slug: `aura-protocol`
- Deploy key: `<YOUR_DEPLOY_KEY>`

**Copy your deploy key!** 📋

---

### Step 3: Authenticate

```bash
cd /Users/idcuq/Documents/Aura\ V.1.1/subgraph

# Replace <YOUR_DEPLOY_KEY> with actual key from Studio
graph auth --studio <YOUR_DEPLOY_KEY>
```

**Expected output**:
```
Deploy key set for https://api.studio.thegraph.com/deploy/
```

---

### Step 4: Deploy Subgraph

```bash
# Option A: Use deployment script
./deploy-subgraph.sh aura-protocol

# Option B: Manual deploy
graph deploy --studio aura-protocol
```

**During deployment, you'll be asked**:
```
? Version Label (e.g. v0.0.1): v0.1.0
```

Enter: **`v0.1.0`**

---

### Step 5: Wait for Syncing

After deployment:
1. Go to: https://thegraph.com/studio/subgraph/aura-protocol/
2. You'll see **"Syncing"** status
3. Wait for it to reach **"Synced"**

**Syncing time**: ~5-15 minutes (depends on chain history)

---

### Step 6: Get GraphQL Endpoint

Once synced, copy your endpoint:

```
https://api.studio.thegraph.com/query/<YOUR_ID>/aura-protocol/version/latest
```

---

### Step 7: Update Backend

Add to `backend/.env`:

```bash
SUBGRAPH_URL=https://api.studio.thegraph.com/query/<YOUR_ID>/aura-protocol/version/latest
```

---

### Step 8: Test Queries

**In The Graph Studio Playground**:

```graphql
# Test 1: Get global stats
{
  globalStats(id: "global") {
    totalBadges
    totalPassports
    totalUsers
  }
}

# Test 2: Get recent badges
{
  badges(first: 5, orderBy: issuedAt, orderDirection: desc) {
    tokenId
    badgeType
    owner { address }
  }
}

# Test 3: Get user data
{
  user(id: "0x742d35cc6634c0532925a3b844bc9e7595f0beb1") {
    totalBadges
    badges { badgeType }
  }
}
```

---

### Step 9: Test Backend Integration

```bash
# Start backend
cd backend
source venv/bin/activate
uvicorn server:app --reload --port 9000

# Test API
curl http://localhost:9000/api/graph/stats
```

---

## 🐛 Troubleshooting

### Issue: "Deploy key not set"

**Solution**:
```bash
graph auth --studio <YOUR_DEPLOY_KEY>
```

### Issue: "Subgraph not found"

**Solution**: Make sure subgraph name matches:
```bash
graph deploy --studio aura-protocol
```

### Issue: "Build failed"

**Solution**: Rebuild:
```bash
graph codegen
graph build
```

### Issue: "Syncing stuck"

**Solution**: 
- Check contract addresses in `subgraph.yaml`
- Verify network is `polygon-amoy`
- Check startBlock (set to 0 for full history)

---

## 📊 Post-Deployment

### Monitor Syncing

```bash
# Check sync status
curl https://api.studio.thegraph.com/query/<YOUR_ID>/aura-protocol/version/latest \
  -H "Content-Type: application/json" \
  -d '{"query": "{ _meta { block { number } } }"}'
```

### Update Version

```bash
# Make changes to schema/mappings
graph codegen
graph build
graph deploy --studio aura-protocol
# Enter new version: v0.1.1
```

---

## ✅ Success Checklist

- [ ] Graph CLI installed
- [ ] Subgraph created on Studio
- [ ] Authenticated with deploy key
- [ ] Deployed successfully
- [ ] Syncing completed
- [ ] Test queries work
- [ ] Backend .env updated
- [ ] API endpoints tested

---

## 🎉 You're Done!

Your subgraph is now live and indexing on-chain events!

**Next Steps**:
1. Update frontend to use subgraph data
2. Build analytics dashboard
3. Monitor query performance

---

## 🔗 Quick Links

- **Studio Dashboard**: https://thegraph.com/studio/
- **Your Subgraph**: https://thegraph.com/studio/subgraph/aura-protocol/
- **Docs**: https://thegraph.com/docs/
- **Discord**: https://discord.gg/graphprotocol

---

**"Universal Trust in a Trustless World"** 🚀
