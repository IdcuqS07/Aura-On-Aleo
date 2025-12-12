# ⚠️ Perlu Akses VPS untuk Fix OAuth

## Situasi Saat Ini

Saya tidak bisa akses VPS karena SSH key tidak match.

**VPS**: root@159.65.134.137  
**Error**: Permission denied (publickey,password)

## 3 Cara untuk Lanjutkan

### Option 1: Berikan SSH Password (Tercepat)
```bash
# Saya akan jalankan:
ssh root@159.65.134.137
# Lalu update OAuth config
```
**Butuh**: Password VPS Anda

### Option 2: Setup SSH Key
```bash
# Di local machine Anda:
ssh-copy-id root@159.65.134.137

# Atau manual:
cat ~/.ssh/id_rsa.pub | ssh root@159.65.134.137 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```
**Butuh**: Password VPS untuk setup (sekali saja)

### Option 3: Anda Jalankan Manual (Paling Aman)

**Step 1: SSH ke VPS**
```bash
ssh root@159.65.134.137
```

**Step 2: Check current config**
```bash
cd /root/Aura-Protocol-V.1-main/backend
cat .env | grep -E "GITHUB|TWITTER"
```

**Step 3: Jika tidak ada OAuth config, tambahkan**
```bash
nano .env
```

Tambahkan di akhir file:
```env
# OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://www.aurapass.xyz/poh/callback

TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_REDIRECT_URI=https://www.aurapass.xyz/poh/callback
```

Save: `Ctrl+O` → Enter → `Ctrl+X`

**Step 4: Restart backend**
```bash
systemctl restart aura-backend
systemctl status aura-backend
```

**Step 5: Verify**
```bash
journalctl -u aura-backend -n 20 --no-pager
curl http://localhost:9000/api/poh/callback
```

## Jika OAuth Credentials Belum Ada

### Get GitHub OAuth App
1. https://github.com/settings/developers
2. New OAuth App
3. Name: `Aura Protocol Production`
4. Homepage: `https://www.aurapass.xyz`
5. Callback: `https://www.aurapass.xyz/poh/callback`
6. Copy Client ID & Secret

### Get Twitter OAuth App
1. https://developer.twitter.com/en/portal/dashboard
2. Create/Select app
3. OAuth 2.0 Settings:
   - Callback: `https://www.aurapass.xyz/poh/callback`
   - Website: `https://www.aurapass.xyz`
4. Copy Client ID & Secret

## Setelah Selesai

Test di: https://www.aurapass.xyz/proof-of-humanity
- Connect wallet
- Click "Connect GitHub"
- Should redirect to GitHub OAuth
- After authorize, redirect back
- Backend process the code

---

**Pilih salah satu option di atas untuk lanjutkan.**
