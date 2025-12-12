# Dashboard Testing Guide

## ✅ Backend & Frontend Running

### Backend (Port 9000)
- **Status**: ✅ Running
- **URL**: http://localhost:9000
- **Logs**: `backend/server.log`

### Frontend (Port 3000)
- **Status**: ✅ Running  
- **URL**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Logs**: `frontend/frontend.log`

---

## 🧪 Test Endpoints

### 1. Analytics (Working ✅)
```bash
curl http://localhost:9000/api/analytics
```
**Response**:
```json
{
  "total_users": 59,
  "verified_users": 19,
  "total_credit_passports": 16,
  "average_credit_score": 742.5,
  "total_transaction_volume": 29.0,
  "risk_distribution": {"high": 16}
}
```

### 2. DeFi Data (Working ✅)
```bash
curl http://localhost:9000/api/defi/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```
**Response**: Mock data dengan struktur lengkap (Aave, Uniswap, Compound)

### 3. AI Oracle Health (Working ✅)
```bash
curl http://localhost:9000/api/ai-oracle/health
```

---

## 🎯 Dashboard Features

### Yang Terlihat di Dashboard:

#### 1. **Protocol Analytics** (Real-time)
- Total Users
- Badges Minted
- Total Passports
- Average Credit Score
- Auto-refresh setiap 30 detik
- Data dari The Graph Subgraph (fallback ke backend API)

#### 2. **DeFi Portfolio Summary**
- Total Supplied (USD)
- Total Borrowed (USD)
- Net Position
- Protocols Used

#### 3. **Aave V3 Position** (jika ada)
- Collateral & Debt
- Health Factor (color-coded)
- Available to Borrow
- LTV (Loan-to-Value)
- ⚠️ Warning jika health factor < 1.5

#### 4. **DeFi Risk Assessment**
- Risk Score (0-100)
- Badge: Low/Medium/High Risk
- Data source indicator (Live/Mock)

---

## 📱 Cara Test Dashboard

### Test 1: Akses Dashboard Tanpa Wallet
1. Buka: http://localhost:3000/dashboard
2. **Expected**: Muncul "Connect Wallet" screen dengan icon Shield

### Test 2: Akses Dashboard Dengan Wallet
1. Buka: http://localhost:3000
2. Connect wallet (MetaMask)
3. Navigate ke `/dashboard`
4. **Expected**: Muncul 4 section:
   - Protocol Analytics (4 cards)
   - DeFi Portfolio Summary
   - Aave V3 Position (jika ada)
   - DeFi Risk Assessment

### Test 3: Check Data Source
- Lihat di bagian bawah "DeFi Risk Assessment"
- **Expected**: 
  - 🟢 Live On-chain (jika ada posisi DeFi real)
  - 🟡 Mock Data (jika wallet kosong)

### Test 4: Auto-refresh
- Tunggu 30 detik
- **Expected**: Protocol Analytics auto-refresh tanpa reload page

---

## 🔧 Troubleshooting

### Backend Error
```bash
# Check logs
tail -f backend/server.log

# Restart backend
cd backend
pkill -f uvicorn
source venv/bin/activate
python -m uvicorn server:app --port 9000
```

### Frontend Error
```bash
# Check logs
tail -f frontend/frontend.log

# Restart frontend
cd frontend
pkill -f "react-scripts"
yarn start
```

### Port Already in Use
```bash
# Kill process on port 9000
lsof -ti:9000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 🌐 Production URLs

### Live Application
- **Frontend**: https://www.aurapass.xyz
- **Dashboard**: https://www.aurapass.xyz/dashboard
- **API**: https://api.aurapass.xyz

### Test Production API
```bash
# Analytics
curl https://api.aurapass.xyz/api/analytics

# DeFi (Not Found - needs deployment)
curl https://api.aurapass.xyz/api/defi/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

# Health Check
curl https://api.aurapass.xyz/api/ai-oracle/health
```

---

## 📝 Notes

1. **DeFi Endpoint di Production**: Belum tersedia, perlu deploy file baru ke VPS:
   - `defi_routes.py`
   - `defi_indexer.py`
   - `redis_cache.py`

2. **Mock Data**: Wallet tanpa posisi DeFi akan menampilkan mock data dengan indicator 🟡

3. **The Graph Integration**: Frontend akan coba fetch dari subgraph dulu, jika gagal fallback ke backend API

4. **Redis Caching**: Jika Redis tidak tersedia, akan fallback ke direct blockchain query

---

## ✅ Status Checklist

- [x] Backend running di localhost:9000
- [x] Frontend running di localhost:3000
- [x] Analytics endpoint working
- [x] DeFi endpoint working (mock data)
- [x] Dashboard components created
- [x] Auto-refresh implemented
- [ ] Deploy DeFi routes ke production VPS
- [ ] Test dengan wallet yang punya posisi DeFi real

---

**Last Updated**: 2025-12-10 03:40 WIB
