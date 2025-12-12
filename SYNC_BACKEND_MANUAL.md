# Sync Backend Files ke VPS - Manual

## 📦 Files yang Perlu Di-upload:
- `poh_routes.py` (ada endpoint `/store-badge` baru)
- `github_service.py` (updated)
- `twitter_service.py` (updated)

## 🚀 Quick Commands:

### 1. Upload files (dari local terminal)
```bash
cd "/Users/idcuq/Documents/Aura V.1.1/backend"

scp poh_routes.py root@159.65.134.137:/root/Aura-Protocol-V.1-main/backend/
scp github_service.py root@159.65.134.137:/root/Aura-Protocol-V.1-main/backend/
scp twitter_service.py root@159.65.134.137:/root/Aura-Protocol-V.1-main/backend/
```

### 2. Restart backend (SSH ke VPS)
```bash
ssh root@159.65.134.137

cd /root/Aura-Protocol-V.1-main/backend
pkill -f "uvicorn.*9002"
source venv/bin/activate
nohup uvicorn server:app --host 0.0.0.0 --port 9002 > server.log 2>&1 &

# Check logs
tail -20 server.log
```

## ✅ Verify

```bash
# Test endpoint
curl http://localhost:9002/api/poh/
curl http://localhost:9002/api/poh/callback
```

---

**Estimated time**: 2 menit
