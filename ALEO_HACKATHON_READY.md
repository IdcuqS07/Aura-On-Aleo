# Aleo Integration - Hackathon Ready

## ✅ Integrasi Lengkap

### 1. Smart Contract (Leo Program)
**File**: `aleo-programs/badge_minimal/src/main.leo`
- ✅ Compiled (7 statements)
- ✅ Functions: `initialize`, `mint`
- ✅ Network: devnet (local) / testnet

### 2. Backend API
**File**: `backend/aleo_routes.py`
- ✅ `/api/aleo/mint-badge` - Execute mint function
- ✅ `/api/aleo/program-info` - Get program details
- ✅ `/api/aleo/health` - Health check

### 3. Frontend Integration
**File**: `frontend/src/components/AleoIntegration.js`
- ✅ Leo Wallet connection
- ✅ Badge minting UI
- ✅ Program status display

## 🎯 Demo Flow

### User Journey:
1. User opens app
2. Leo Wallet auto-detected
3. User unlocks wallet → Auto-connect
4. Click "Mint Aleo Badge"
5. Backend executes Leo program
6. Badge minted on Aleo

## 🚀 Deployment Options

### Option 1: Local Devnet (Recommended for Demo)
```bash
cd aleo-programs/badge_minimal
cp .env.devnet .env
leo deploy --network devnet --broadcast
```

### Option 2: Testnet (If Available)
```bash
leo deploy --network testnet --broadcast --consensus-version 12
```

### Option 3: Mock (Fallback)
Program compiled, execute locally without deployment.

## 📊 Hackathon Pitch

**"Aura Protocol - Cross-Chain ZK Credit Layer"**

- ✅ Polygon: Live on-chain (3 contracts deployed)
- ✅ Aleo: Leo program compiled & integrated
- ✅ Dual-chain architecture
- ✅ Leo Wallet support
- ✅ ZK proofs on both chains

**Unique Value**: 
- First credit protocol on both Polygon + Aleo
- Privacy-preserving credit scores
- Cross-chain reputation

## 🔧 Quick Start

### Backend:
```bash
cd backend
uvicorn server:app --reload --port 9000
```

### Frontend:
```bash
cd frontend
yarn start
```

### Test Aleo:
```bash
curl http://localhost:9000/api/aleo/health
curl http://localhost:9000/api/aleo/program-info
```

## 📝 Judges Demo Script

1. **Show Polygon contracts** (already deployed)
2. **Show Aleo program** (compiled Leo code)
3. **Connect Leo Wallet** (auto-detection)
4. **Mint badge** (execute Leo program)
5. **Show dual-chain data** (Polygon + Aleo)

## ✅ Checklist

- [x] Leo program written & compiled
- [x] Backend API endpoints
- [x] Frontend Leo Wallet integration
- [x] Health check endpoints
- [x] Demo flow documented
- [ ] Deploy to testnet (optional - if stable)

---

**Status**: Production-ready for hackathon demo
**Networks**: Polygon (live) + Aleo (integrated)
**Date**: January 30, 2025
