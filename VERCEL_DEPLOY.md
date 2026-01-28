# Deploy Aura-On-Aleo to Vercel

## Quick Deploy

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option 2: GitHub Integration

1. Go to https://vercel.com/new
2. Import repository: `IdcuqS07/Aura-On-Aleo`
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`
   - **Install Command**: `yarn install`

4. Environment Variables:
   ```
   REACT_APP_BACKEND_URL=https://api.aurapass.xyz
   ```

5. Click **Deploy**

## Configuration Files

✅ `vercel.json` - Vercel configuration
✅ `build.json` - Build settings
✅ `frontend/package.json` - Updated with vercel-build script

## Environment Variables

Add in Vercel dashboard:

```env
REACT_APP_BACKEND_URL=https://api.aurapass.xyz
```

## Custom Domain (Optional)

After deployment:
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records

## Expected Result

- Frontend: `https://aura-on-aleo.vercel.app`
- API Proxy: Routes `/api/*` to `https://api.aurapass.xyz/api/*`

## Verify Deployment

```bash
# Check frontend
curl https://aura-on-aleo.vercel.app

# Check Aleo integration
curl https://aura-on-aleo.vercel.app/aleo
```

## Troubleshooting

### Build Fails
- Check Node version (use 18.x)
- Verify all dependencies installed
- Check build logs in Vercel dashboard

### API Not Working
- Verify REACT_APP_BACKEND_URL is set
- Check CORS settings on backend
- Verify API is accessible

## Post-Deployment

1. Test Aleo wallet connection
2. Verify API endpoints
3. Test badge issuance
4. Check analytics

## Redeploy

```bash
# Push changes
git add .
git commit -m "Update"
git push

# Vercel auto-deploys on push
```

Or manual:
```bash
vercel --prod
```
