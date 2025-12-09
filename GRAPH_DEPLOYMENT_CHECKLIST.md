# 📋 The Graph Deployment Checklist

Use this checklist to deploy Aura Protocol subgraph.

---

## ✅ Pre-Deployment

- [x] **Schema created** (`schema.graphql`)
  - Badge, Passport, User entities ✓
  - GlobalStats, DailyStats ✓
  - Relationships defined ✓

- [x] **Mappings written**
  - `badge-mapping.ts` ✓
  - `passport-mapping.ts` ✓
  - Event handlers implemented ✓

- [x] **ABIs present**
  - `SimpleZKBadge.json` ✓
  - `CreditPassport.json` ✓

- [x] **Contract addresses verified**
  - SimpleZKBadge: `0x9e6343BB504Af8a39DB516d61c4Aa0aF36c54678` ✓
  - CreditPassport: `0x1112373c9954B9bbFd91eb21175699b609A1b551` ✓

- [x] **Build successful**
  - `graph codegen` ✓
  - `graph build` ✓

---

## 🚀 Deployment Steps

### 1. Install Graph CLI
```bash
npm install -g @graphprotocol/graph-cli
```
- [ ] CLI installed
- [ ] Version verified: `graph --version`

### 2. Create Subgraph on Studio
- [ ] Visited https://thegraph.com/studio/
- [ ] Wallet connected
- [ ] Subgraph created: `aura-protocol`
- [ ] Deploy key copied

### 3. Authenticate
```bash
graph auth --studio <YOUR_DEPLOY_KEY>
```
- [ ] Authentication successful

### 4. Deploy
```bash
cd subgraph
./deploy-subgraph.sh aura-protocol
```
- [ ] Deployment started
- [ ] Version entered: `v0.1.0`
- [ ] Deployment successful

### 5. Wait for Sync
- [ ] Syncing started
- [ ] Syncing completed (check Studio dashboard)
- [ ] GraphQL endpoint available

### 6. Update Backend
```bash
# Add to backend/.env
SUBGRAPH_URL=https://api.studio.thegraph.com/query/<ID>/aura-protocol/version/latest
```
- [ ] `.env` updated
- [ ] Backend restarted

---

## 🧪 Testing

### Test in Studio Playground

**Query 1: Global Stats**
```graphql
{ globalStats(id: "global") { totalBadges totalPassports totalUsers } }
```
- [ ] Query successful
- [ ] Data returned

**Query 2: Recent Badges**
```graphql
{ badges(first: 5, orderBy: issuedAt, orderDirection: desc) { tokenId badgeType } }
```
- [ ] Query successful
- [ ] Badges returned

**Query 3: User Data**
```graphql
{ user(id: "0x742d35cc6634c0532925a3b844bc9e7595f0beb1") { totalBadges } }
```
- [ ] Query successful
- [ ] User data returned

### Test Backend API

```bash
curl http://localhost:9000/api/graph/stats
```
- [ ] API endpoint works
- [ ] Data matches Studio

---

## 📊 Post-Deployment

### Monitor Performance
- [ ] Check sync status regularly
- [ ] Monitor query performance
- [ ] Check for indexing errors

### Documentation
- [ ] Update README with subgraph URL
- [ ] Document query examples
- [ ] Share with team

### Frontend Integration
- [ ] Update frontend to use subgraph
- [ ] Test all queries
- [ ] Deploy frontend updates

---

## 🐛 Troubleshooting

### If deployment fails:
1. Check contract addresses in `subgraph.yaml`
2. Verify network is `polygon-amoy`
3. Rebuild: `graph codegen && graph build`
4. Try deploying again

### If syncing is slow:
1. Check startBlock (set to 0 for full history)
2. Wait 15-30 minutes
3. Check Studio logs for errors

### If queries fail:
1. Verify subgraph is synced
2. Check query syntax
3. Test in Studio playground first

---

## ✅ Deployment Complete!

Once all items are checked:
- ✅ Subgraph deployed
- ✅ Syncing completed
- ✅ Queries tested
- ✅ Backend integrated
- ✅ Documentation updated

**Status**: Production Ready! 🎉

---

## 📝 Notes

**Deployment Date**: _____________

**Subgraph URL**: 
```
https://api.studio.thegraph.com/query/<ID>/aura-protocol/version/latest
```

**Version**: v0.1.0

**Deployed By**: _____________

---

**Next**: Update frontend to use subgraph data

**"Universal Trust in a Trustless World"** 🚀
