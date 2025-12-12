# Update OAuth di VPS - Manual Steps

## 🎯 Quick Commands (Copy-Paste)

### 1. SSH ke VPS
```bash
ssh root@159.65.134.137
```

### 2. Navigate ke backend folder
```bash
cd /root/Aura-Protocol-V.1-main/backend
```

### 3. Backup .env
```bash
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### 4. Edit .env
```bash
nano .env
```

### 5. Tambahkan OAuth Config (Copy-Paste)

Scroll ke bawah dan tambahkan:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV
GITHUB_CLIENT_SECRET=1c3fd4c78d4978e929c8a733808ab1a3b00e32a8
GITHUB_REDIRECT_URI=https://www.aurapass.xyz/poh/callback

# Twitter OAuth
TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ
TWITTER_CLIENT_SECRET=VNq-wJUUCs7Zj2dUnnFgGr_gjg9L6wCNa4xRHCdGoAee9QRWn6
TWITTER_REDIRECT_URI=https://www.aurapass.xyz/poh/callback
```

**Save**: `Ctrl+O` → Enter → `Ctrl+X`

### 6. Restart Backend (Port 9002)
```bash
# Kill existing process
pkill -f "uvicorn.*9002"

# Restart
cd /root/Aura-Protocol-V.1-main/backend
source venv/bin/activate
nohup uvicorn server:app --host 0.0.0.0 --port 9002 > server.log 2>&1 &
```

### 7. Verify
```bash
# Check process
ps aux | grep uvicorn | grep 9002

# Check logs
tail -20 server.log

# Test endpoint
curl http://localhost:9002/api/poh/callback
```

## ✅ Success Indicators

- Process running on port 9002
- Logs show "✅ PoH routes loaded"
- Endpoint responds with redirect

## 🧪 Test OAuth Flow

1. Open: https://www.aurapass.xyz/proof-of-humanity
2. Connect wallet
3. Click "Connect GitHub"
4. Should redirect to GitHub OAuth
5. After authorize, redirect back with code
6. Backend processes OAuth code

---

**Estimated Time**: 2-3 minutes
