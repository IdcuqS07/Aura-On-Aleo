# Deploy Aura-On-Aleo to Vercel - Manual Steps

## ✅ Configuration Ready

Files created and pushed to GitHub:
- ✅ `vercel.json` - Vercel configuration
- ✅ `build.json` - Build settings  
- ✅ `frontend/package.json` - Updated with vercel-build
- ✅ `VERCEL_DEPLOY.md` - Deployment guide

## 🚀 Deploy Now

### Method 1: Vercel Dashboard (Easiest)

1. **Go to**: https://vercel.com/new

2. **Import Git Repository**:
   - Click "Import Git Repository"
   - Select: `IdcuqS07/Aura-On-Aleo`
   - Click "Import"

3. **Configure Project**:
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: yarn build
   Output Directory: build
   Install Command: yarn install
   ```

4. **Environment Variables**:
   ```
   REACT_APP_BACKEND_URL = https://api.aurapass.xyz
   ```

5. **Click "Deploy"** 🚀

### Method 2: Vercel CLI

```bash
# Login first
vercel login

# Deploy from root
vercel --prod

# Or from frontend
cd frontend
vercel --prod
```

## 📋 Deployment Checklist

- ✅ Repository: https://github.com/IdcuqS07/Aura-On-Aleo
- ✅ Configuration files pushed
- ✅ Frontend ready in `/frontend` directory
- ⏳ Deploy via Vercel dashboard
- ⏳ Add environment variables
- ⏳ Test deployment

## 🔗 Expected URLs

After deployment:
- **Frontend**: `https://aura-on-aleo.vercel.app`
- **API Proxy**: `https://aura-on-aleo.vercel.app/api/*` → `https://api.aurapass.xyz/api/*`

## 🧪 Test After Deploy

```bash
# Test frontend
curl https://aura-on-aleo.vercel.app

# Test Aleo page
curl https://aura-on-aleo.vercel.app/aleo

# Test API proxy
curl https://aura-on-aleo.vercel.app/api/aleo/status
```

## 🎯 Next Steps

1. Deploy via Vercel dashboard
2. Add custom domain (optional)
3. Test Aleo wallet integration
4. Verify all features working

## 📚 Resources

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Repository: https://github.com/IdcuqS07/Aura-On-Aleo
