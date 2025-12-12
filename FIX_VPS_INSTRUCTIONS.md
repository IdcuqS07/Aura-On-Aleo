# Fix Duplicate DeFi Imports on VPS

## Problem
Backend crashing because `server.py` has duplicate DeFi route imports (3x):
- Lines appear 3 times causing "✅ DeFi routes loaded" to show 3x in logs
- Backend crashes with exit code 1

## Solution

### Step 1: Upload Fix Script to VPS

```bash
# From your local machine
scp fix_duplicate_imports.py root@159.65.134.137:/root/Aura-Protocol-V.1-main/backend/
```

### Step 2: SSH into VPS

```bash
ssh root@159.65.134.137
```

### Step 3: Run Fix Script

```bash
cd /root/Aura-Protocol-V.1-main/backend
python3 fix_duplicate_imports.py
```

The script will:
1. ✅ Create automatic backup with timestamp
2. ✅ Find all DeFi import blocks
3. ✅ Remove duplicates (keep only first one)
4. ✅ Verify Python syntax
5. ✅ Show you what was fixed

### Step 4: Restart Backend

```bash
systemctl restart aura-backend
systemctl status aura-backend
```

### Step 5: Verify DeFi Routes Work

```bash
# Check logs - should only see "✅ DeFi routes loaded" ONCE
journalctl -u aura-backend -n 50 --no-pager

# Test DeFi endpoint
curl http://localhost:9000/api/defi/health
```

Expected response:
```json
{
  "status": "healthy",
  "indexer": "running",
  "supported_protocols": ["aave_v3", "uniswap_v3", "compound_v2"]
}
```

## If Something Goes Wrong

The script automatically creates backups. To restore:

```bash
cd /root/Aura-Protocol-V.1-main/backend
ls -la server.py.backup_*  # Find latest backup
cp server.py.backup_YYYYMMDD_HHMMSS server.py  # Restore
systemctl restart aura-backend
```

## Alternative: Manual Fix

If script doesn't work, manually edit:

```bash
cd /root/Aura-Protocol-V.1-main/backend
nano server.py
```

Search for `from defi_routes` (Ctrl+W) and remove duplicate blocks.
Keep only ONE occurrence of these 3 lines:
```python
from defi_routes import router as defi_router
app.include_router(defi_router, prefix="/api")
logger.info("✅ DeFi routes loaded")
```

Save (Ctrl+O), Exit (Ctrl+X), then restart backend.
