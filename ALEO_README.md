# Aleo Integration - Quick Reference

## 🎯 What's New

Aura Protocol now supports **Aleo blockchain** for ZK-native smart contracts!

### Key Features
- ✅ **2 Aleo Programs**: zkbadge.aleo & credit_passport.aleo
- ✅ **Backend API**: Full Aleo integration via FastAPI
- ✅ **Frontend Support**: Leo Wallet & Puzzle Wallet
- ✅ **Privacy-First**: Private records by default
- ✅ **Multi-Chain**: Polygon + Aleo unified

## 🚀 Quick Start

```bash
# 1. Install & Build
./aleo-quick-start.sh

# 2. Start Backend
cd backend && python server.py

# 3. Start Frontend
cd frontend && yarn start

# 4. Test
curl http://localhost:9000/api/aleo/status
```

## 📡 New API Endpoints

```bash
GET  /api/aleo/status           # Check Leo installation
POST /api/aleo/badge/issue      # Issue ZK badge
POST /api/aleo/minter/authorize # Authorize minter
GET  /api/aleo/health           # Health check
```

## 📁 New Files

### Aleo Programs
- `aleo-programs/zkbadge/src/main.leo` - ZK Badge (Soulbound NFT)
- `aleo-programs/credit_passport/src/main.leo` - Credit Passport

### Backend
- `backend/aleo_service.py` - Aleo service layer
- `backend/aleo_routes.py` - API routes

### Frontend
- `frontend/src/services/aleoWallet.js` - Wallet integration
- `frontend/src/services/aleoAPI.js` - API service
- `frontend/src/pages/AleoIntegration.js` - UI component

### Scripts
- `aleo-quick-start.sh` - Quick setup
- `aleo-programs/install-aleo.sh` - Install Leo
- `aleo-programs/deploy-aleo.sh` - Deploy to testnet

### Documentation
- `ALEO_INTEGRATION_COMPLETE.md` - Complete guide
- `ALEO_TESTING_GUIDE.md` - Testing guide
- `ALEO_INTEGRATION.md` - Integration details

## 🔗 Architecture

```
┌─────────────────────────────────────────────┐
│           Aura Protocol V.1.1               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐      ┌──────────────┐   │
│  │   Polygon    │      │     Aleo     │   │
│  │  (Existing)  │      │    (NEW!)    │   │
│  └──────────────┘      └──────────────┘   │
│         │                      │            │
│  ┌──────▼──────────────────────▼──────┐   │
│  │   Multi-Chain Backend API          │   │
│  │   - Polygon Integration            │   │
│  │   - Aleo Service (NEW!)            │   │
│  └────────────────────────────────────┘   │
│                   │                         │
│  ┌────────────────▼────────────────────┐  │
│  │         Frontend                    │  │
│  │  - MetaMask (Polygon)               │  │
│  │  - Leo/Puzzle Wallet (Aleo) (NEW!) │  │
│  └─────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

## 📊 Comparison

| Feature | Polygon | Aleo |
|---------|---------|------|
| Privacy | Public | Private by default |
| NFT | ERC721 | Records |
| ZK Proofs | External | Native |
| Gas | MATIC | Aleo Credits |
| Status | ✅ Live | ✅ Integrated |

## 📚 Full Documentation

See `ALEO_INTEGRATION_COMPLETE.md` for complete documentation.

## 🎯 Next Steps

1. Install Leo: `./aleo-quick-start.sh`
2. Test locally
3. Deploy to Aleo testnet
4. Integrate with existing features

---

**For existing Polygon features, see main README.md**
