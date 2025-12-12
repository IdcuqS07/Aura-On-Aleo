# Fix OAuth GitHub & Twitter di VPS

## 🎯 Tujuan
Memperbaiki konfigurasi OAuth untuk GitHub dan Twitter di VPS production (api.aurapass.xyz)

## 📋 Prerequisites

1. **SSH Access ke VPS**
   ```bash
   ssh root@159.65.134.137
   ```

2. **OAuth Credentials**
   - GitHub OAuth App (Client ID & Secret)
   - Twitter OAuth App (Client ID & Secret)

## 🚀 Quick Fix (Automated)

### Step 1: Check Current Status
```bash
./check-oauth-vps.sh
```

Ini akan menampilkan:
- ✅/❌ Status OAuth configuration
- Backend service status
- Recent logs
- Test callback endpoint

### Step 2: Fix OAuth Configuration
```bash
./fix-oauth-vps.sh
```

Script akan:
1. Connect ke VPS
2. Prompt untuk OAuth credentials
3. Backup existing .env
4. Update/add OAuth configuration
5. Restart backend service
6. Verify status

### Step 3: Verify
```bash
# Test dari local
curl https://api.aurapass.xyz/api/poh/callback

# Test OAuth flow dari frontend
# Buka: https://www.aurapass.xyz/proof-of-humanity
# Click "Connect GitHub" atau "Connect Twitter"
```

## 🔧 Manual Fix (Jika Script Gagal)

### 1. SSH ke VPS
```bash
ssh root@159.65.134.137
```

### 2. Edit .env File
```bash
cd /root/Aura-Protocol-V.1-main/backend
nano .env
```

### 3. Tambahkan OAuth Configuration
```env
# OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_REDIRECT_URI=https://www.aurapass.xyz/poh/callback

TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here
TWITTER_REDIRECT_URI=https://www.aurapass.xyz/poh/callback
```

Save: `Ctrl+O`, Exit: `Ctrl+X`

### 4. Restart Backend
```bash
systemctl restart aura-backend
systemctl status aura-backend
```

### 5. Check Logs
```bash
journalctl -u aura-backend -f
```

## 🔑 Cara Mendapatkan OAuth Credentials

### GitHub OAuth App

1. Buka: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Isi form:
   - **Application name**: Aura Protocol Production
   - **Homepage URL**: https://www.aurapass.xyz
   - **Authorization callback URL**: https://www.aurapass.xyz/poh/callback
4. Click **"Register application"**
5. Copy **Client ID** dan **Client Secret**

### Twitter OAuth App

1. Buka: https://developer.twitter.com/en/portal/dashboard
2. Create new app atau pilih existing app
3. Setup OAuth 2.0:
   - **Type of App**: Web App
   - **Callback URL**: https://www.aurapass.xyz/poh/callback
   - **Website URL**: https://www.aurapass.xyz
4. Copy **Client ID** dan **Client Secret**

## 🧪 Testing OAuth Flow

### Test GitHub OAuth
```bash
# 1. Buka frontend
open https://www.aurapass.xyz/proof-of-humanity

# 2. Connect wallet
# 3. Click "Connect GitHub"
# 4. Authorize di GitHub
# 5. Redirect kembali ke frontend dengan code
# 6. Backend exchange code untuk token
# 7. Fetch GitHub data & calculate score
```

### Test Twitter OAuth
```bash
# Same flow dengan "Connect Twitter"
```

### Test Backend Endpoint
```bash
# Test callback endpoint
curl https://api.aurapass.xyz/api/poh/callback?code=test123

# Test enroll endpoint (requires OAuth code)
curl -X POST https://api.aurapass.xyz/api/poh/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "github_code": "your_github_code_here"
  }'
```

## 📊 Monitoring

### Check Backend Logs
```bash
ssh root@159.65.134.137
journalctl -u aura-backend -f
```

### Check OAuth Requests
```bash
# Grep untuk OAuth-related logs
journalctl -u aura-backend | grep -i "oauth\|github\|twitter"
```

### Check Error Logs
```bash
journalctl -u aura-backend -p err -n 50
```

## ⚠️ Troubleshooting

### Issue: "OAuth code invalid"
**Cause**: Code sudah expired atau sudah digunakan  
**Fix**: OAuth code hanya bisa digunakan 1x dan expire dalam 10 menit. Generate code baru.

### Issue: "Redirect URI mismatch"
**Cause**: Redirect URI di OAuth app tidak match dengan yang di code  
**Fix**: 
1. Check OAuth app settings
2. Pastikan redirect URI: `https://www.aurapass.xyz/poh/callback`
3. Update di GitHub/Twitter developer console

### Issue: "Backend not responding"
**Cause**: Backend service down  
**Fix**:
```bash
ssh root@159.65.134.137
systemctl status aura-backend
systemctl restart aura-backend
journalctl -u aura-backend -n 50
```

### Issue: "CORS error"
**Cause**: CORS not configured properly  
**Fix**: Check .env file:
```env
CORS_ORIGINS=https://www.aurapass.xyz,https://api.aurapass.xyz
```

## 📝 Checklist

- [ ] SSH access ke VPS working
- [ ] GitHub OAuth App created
- [ ] Twitter OAuth App created
- [ ] OAuth credentials added to VPS .env
- [ ] Backend service restarted
- [ ] Callback endpoint responding
- [ ] Frontend OAuth flow tested
- [ ] GitHub OAuth working
- [ ] Twitter OAuth working
- [ ] Logs showing no errors

## 🎉 Success Criteria

✅ Backend logs show: "✅ PoH routes loaded"  
✅ Callback endpoint returns redirect  
✅ Frontend OAuth flow completes without errors  
✅ User can enroll with GitHub/Twitter  
✅ Score calculated correctly  
✅ ZK proof generated  
✅ Badge minted on-chain  

## 📞 Support

Jika masih ada masalah:
1. Check logs: `journalctl -u aura-backend -f`
2. Verify .env configuration
3. Test endpoints manually dengan curl
4. Check OAuth app settings di GitHub/Twitter

---

**Last Updated**: December 2024  
**VPS IP**: 159.65.134.137  
**Production URL**: https://www.aurapass.xyz  
**API URL**: https://api.aurapass.xyz
