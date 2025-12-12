# Manual Fix OAuth di VPS - Step by Step

## 🎯 Quick Commands (Copy-Paste)

### 1. SSH ke VPS
```bash
ssh root@159.65.134.137
```

### 2. Check Current OAuth Config
```bash
cd /root/Aura-Protocol-V.1-main/backend
grep -E "GITHUB|TWITTER" .env
```

### 3. Backup .env
```bash
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### 4. Edit .env
```bash
nano .env
```

### 5. Tambahkan OAuth Config (Copy-Paste ke .env)
```env
# OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://www.aurapass.xyz/poh/callback

TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_REDIRECT_URI=https://www.aurapass.xyz/poh/callback
```

**Save**: `Ctrl+O` → Enter → `Ctrl+X`

### 6. Restart Backend
```bash
systemctl restart aura-backend
```

### 7. Check Status
```bash
systemctl status aura-backend
```

### 8. Check Logs
```bash
journalctl -u aura-backend -n 30 --no-pager
```

### 9. Test Endpoint
```bash
curl http://localhost:9000/api/poh/callback
```

## 🔑 Get OAuth Credentials

### GitHub OAuth App
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill:
   - Name: `Aura Protocol Production`
   - Homepage: `https://www.aurapass.xyz`
   - Callback: `https://www.aurapass.xyz/poh/callback`
4. Copy Client ID & Secret

### Twitter OAuth App
1. Go to: https://developer.twitter.com/en/portal/dashboard
2. Create app or select existing
3. Setup OAuth 2.0:
   - Callback: `https://www.aurapass.xyz/poh/callback`
   - Website: `https://www.aurapass.xyz`
4. Copy Client ID & Secret

## ✅ Verification

Test dari browser:
1. Open: https://www.aurapass.xyz/proof-of-humanity
2. Connect wallet
3. Click "Connect GitHub"
4. Should redirect to GitHub OAuth
5. After authorize, redirect back to frontend
6. Backend should process the code

## 🐛 Troubleshooting

### Backend not restarting?
```bash
journalctl -u aura-backend -n 50 --no-pager
systemctl restart aura-backend
```

### Check if OAuth routes loaded?
```bash
journalctl -u aura-backend | grep "PoH routes"
```

### Test OAuth callback manually?
```bash
curl -v http://localhost:9000/api/poh/callback?code=test123
```

---

**VPS**: 159.65.134.137  
**Backend Path**: /root/Aura-Protocol-V.1-main/backend  
**Service**: aura-backend
