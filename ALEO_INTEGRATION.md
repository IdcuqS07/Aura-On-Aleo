# Aleo Integration Guide

## Overview

Integrasi Aura Protocol dengan Aleo blockchain untuk ZK-native smart contracts dan privacy-preserving credentials.

## Status

- ✅ **Phase 1**: Setup & Port SimpleZKBadge
  - ✅ Struktur project Aleo
  - ✅ Port SimpleZKBadge.sol → zkbadge.aleo
  - ✅ Installation script
  - ✅ Backend API integration
  - ✅ Frontend wallet integration
  - ⏳ Build & deploy program

- ✅ **Phase 2**: Backend Integration
  - ✅ Aleo service layer (aleo_service.py)
  - ✅ API routes (aleo_routes.py)
  - ✅ Server integration

- ✅ **Phase 3**: Frontend Integration
  - ✅ Aleo wallet service (Leo Wallet, Puzzle Wallet)
  - ✅ Aleo API service
  - ⏳ UI components

- ⏳ **Phase 4**: Deploy to Aleo Testnet
  - ⏳ Install Leo compiler
  - ⏳ Build program
  - ⏳ Deploy to testnet3

## Quick Start

### 1. Install Aleo Tools

```bash
# Manual installation (recommended)
curl -L https://raw.githubusercontent.com/AleoHQ/leo/mainnet/install.sh | bash

# Or use script (if available)
./aleo-programs/install-aleo.sh
```

### 2. Build ZK Badge Program

```bash
cd aleo-programs/zkbadge
leo build
```

### 3. Deploy to Testnet

```bash
./aleo-programs/deploy-aleo.sh
```

### 4. Test Backend API

```bash
# Start backend
cd backend
python server.py

# Test Aleo status
curl http://localhost:9000/api/aleo/status
```

## Architecture

```
┌─────────────────────────────────────────────┐
│           Aura Protocol V.1.1               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐      ┌──────────────┐   │
│  │   Polygon    │      │     Aleo     │   │
│  │   (Current)  │      │    (New)     │   │
│  └──────────────┘      └──────────────┘   │
│         │                      │            │
│         │                      │            │
│  ┌──────▼──────────────────────▼──────┐   │
│  │      Multi-Chain Backend API       │   │
│  │  - aleo_service.py                 │   │
│  │  - aleo_routes.py                  │   │
│  └────────────────────────────────────┘   │
│                   │                         │
│  ┌────────────────▼────────────────────┐  │
│  │         Frontend                    │  │
│  │  - aleoWallet.js (Leo/Puzzle)      │  │
│  │  - aleoAPI.js                      │  │
│  └────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

## Files Created

### Aleo Programs
- `aleo-programs/zkbadge/src/main.leo` - ZK Badge program
- `aleo-programs/zkbadge/program.json` - Program metadata
- `aleo-programs/zkbadge/inputs/zkbadge.in` - Test inputs
- `aleo-programs/install-aleo.sh` - Installation script
- `aleo-programs/deploy-aleo.sh` - Deployment script

### Backend
- `backend/aleo_service.py` - Aleo service layer
- `backend/aleo_routes.py` - API routes
- `backend/server.py` - Updated with Aleo routes

### Frontend
- `frontend/src/services/aleoWallet.js` - Wallet integration
- `frontend/src/services/aleoAPI.js` - API service

## API Endpoints

### Aleo Status
```bash
GET /api/aleo/status
```

### Issue Badge
```bash
POST /api/aleo/badge/issue
{
  "recipient": "aleo1xxx...",
  "badge_type": 1,
  "zk_proof_hash": 123456789
}
```

### Authorize Minter
```bash
POST /api/aleo/minter/authorize
{
  "minter_address": "aleo1xxx..."
}
```

### Health Check
```bash
GET /api/aleo/health
```

## Programs

### zkbadge.aleo
Port dari SimpleZKBadge.sol dengan fitur:
- Soulbound NFT (non-transferable)
- Authorized minters
- ZK proof verification
- Private badge records

**Key Features:**
- Records (private by default)
- Public mappings untuk state
- Finalize untuk on-chain verification

## Next Steps

1. ✅ Setup Aleo structure
2. ✅ Port SimpleZKBadge contract
3. ✅ Backend integration
4. ✅ Frontend integration
5. ⏳ Install Leo compiler
6. ⏳ Build & deploy program
7. ⏳ Test end-to-end flow
8. ⏳ Port CreditPassport contract

## Resources

- [Aleo Documentation](https://developer.aleo.org/)
- [Leo Language Guide](https://developer.aleo.org/leo/)
- [zkbadge Program](./aleo-programs/zkbadge/)
