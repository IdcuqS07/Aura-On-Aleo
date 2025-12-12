# ✅ OAuth Credentials Found!

## 📍 Source
GitHub Repo: https://github.com/IdcuqS07/Aura-Protocol-V.1

## 🔑 Credentials Found

### Frontend (Public - Safe to commit)
```env
REACT_APP_GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV
REACT_APP_TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ
```

✅ **Already updated in**: `frontend/.env`

### Backend (Secrets - NOT in repo)
```env
GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV
GITHUB_CLIENT_SECRET=??? (need to get from GitHub)
TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ
TWITTER_CLIENT_SECRET=??? (need to get from Twitter)
```

## 🎯 Next Steps

### Option 1: Get Secrets from GitHub/Twitter Dashboard

**GitHub:**
1. Go to: https://github.com/settings/developers
2. Find OAuth App with Client ID: `Ov23liBkJpXGppFuyWWV`
3. Regenerate Client Secret
4. Copy to `backend/.env`

**Twitter:**
1. Go to: https://developer.twitter.com/en/portal/dashboard
2. Find app with Client ID: `ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ`
3. Copy Client Secret
4. Add to `backend/.env`

### Option 2: Get from VPS Production

```bash
ssh root@159.65.134.137
cd /root/Aura-Protocol-V.1-main/backend
cat .env | grep -E "GITHUB_CLIENT_SECRET|TWITTER_CLIENT_SECRET"
```

Then copy to local `backend/.env`

### Option 3: Use Mock Data (Current Behavior)

System already works without real OAuth:
- Twitter uses mock data
- GitHub errors are caught and skipped
- Score calculated from on-chain data only

## 📝 Backend .env Template

Add to `backend/.env`:

```env
# OAuth Configuration
GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV
GITHUB_CLIENT_SECRET=your_secret_here
GITHUB_REDIRECT_URI=http://localhost:3000/poh/callback

TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ
TWITTER_CLIENT_SECRET=your_secret_here
TWITTER_REDIRECT_URI=http://localhost:3000/poh/callback
```

## ✅ Status

- [x] Frontend credentials found & updated
- [ ] Backend secrets needed
- [x] Backend running (port 9000)
- [x] OAuth endpoints working (with mock data)

---

**Recommendation**: Get secrets from GitHub/Twitter dashboard or VPS production.
