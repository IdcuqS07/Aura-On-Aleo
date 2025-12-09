# The Graph Subgraph Deployment Guide

Deploy Aura Protocol subgraph to The Graph Studio.

---

## 🚀 Quick Deploy

### 1. Install Graph CLI

```bash
npm install -g @graphprotocol/graph-cli
```

### 2. Create Subgraph on Studio

Visit: https://thegraph.com/studio/

1. Connect wallet
2. Click "Create a Subgraph"
3. Name: `aura-protocol`
4. Copy your deploy key

### 3. Authenticate

```bash
graph auth --studio <YOUR_DEPLOY_KEY>
```

### 4. Deploy

```bash
cd subgraph
./deploy-subgraph.sh aura-protocol
```

---

## 📋 Manual Steps

### Install Dependencies

```bash
cd subgraph
npm install
```

### Generate Types

```bash
graph codegen
```

### Build

```bash
graph build
```

### Deploy

```bash
graph deploy --studio aura-protocol
```

---

## 🔧 Configuration

Update `backend/.env`:

```bash
SUBGRAPH_URL=https://api.studio.thegraph.com/query/<YOUR_ID>/aura-protocol/version/latest
```

---

## 🧪 Test Queries

### Get User Badges

```graphql
{
  user(id: "0x742d35cc6634c0532925a3b844bc9e7595f0beb1") {
    badges {
      tokenId
      badgeType
      issuedAt
    }
  }
}
```

### Get Global Stats

```graphql
{
  globalStats(id: "global") {
    totalBadges
    totalPassports
    totalUsers
    averageCreditScore
  }
}
```

### Get Recent Passports

```graphql
{
  passports(first: 10, orderBy: issuedAt, orderDirection: desc) {
    tokenId
    owner { address }
    creditScore
    issuedAt
  }
}
```

---

## 📊 Backend Integration

```python
from graph_service import get_graph_service

service = get_graph_service()

# Get user badges
badges = service.get_user_badges("0x742d35...")

# Get global stats
stats = service.get_global_stats()

# Get daily stats
daily = service.get_daily_stats(days=7)
```

---

## 🔗 Resources

- [The Graph Docs](https://thegraph.com/docs/)
- [Studio Dashboard](https://thegraph.com/studio/)
- [Subgraph Schema](subgraph/schema.graphql)

**"Universal Trust in a Trustless World"** 🚀
