# Deployment Guide - Survival Budget Beta

This guide covers deploying the Survival Budget app with beta access gate enabled.

---

## Option 1: Force Push to GitHub (Clean Overwrite)

This will **completely replace** the remote repository with your local code, deleting any files not in your local repo.

### ⚠️ WARNING
This is **destructive**. Any changes on the remote that aren't in your local repo will be **permanently deleted**.

### Steps:

1. **Commit all local changes:**
   ```bash
   git add .
   git commit -m "feat: add beta access gate and comprehensive fixes"
   ```

2. **Force push to completely overwrite remote:**
   ```bash
   git push origin safe/2025-10-15 --force
   ```

3. **If you want to overwrite main branch:**
   ```bash
   # First, update main locally
   git checkout main
   git reset --hard safe/2025-10-15

   # Then force push
   git push origin main --force
   ```

### Verification:
```bash
# Check that push was successful
git log --oneline -5

# Verify remote matches local
git fetch origin
git diff origin/main
```

---

## Option 2: Deploy to Netlify (Recommended for Beta)

Netlify provides easy deployment with automatic builds.

### Quick Deploy:

1. **Install Netlify CLI (if not installed):**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy to production:**
   ```bash
   # Build first
   npm run build

   # Deploy (will create new site on first run)
   netlify deploy --prod
   ```

4. **Follow prompts:**
   - Create & configure new site: Yes
   - Directory to deploy: `dist`

5. **Your site will be live at:** `https://[random-name].netlify.app`

### Automatic Deployments:

Link to GitHub for automatic deployments on push:

```bash
netlify init
```

Then:
- Choose "Create & configure a new site"
- Link your GitHub repository
- Build command: `npm run build`
- Publish directory: `dist`

**Every push to your GitHub repo will automatically deploy!**

### Custom Domain:
In Netlify dashboard:
- Domain settings → Add custom domain
- Follow DNS configuration steps

---

## Option 3: Deploy to Vercel

Vercel is optimized for React apps.

### Quick Deploy:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Follow prompts:**
   - Set up and deploy: Yes
   - Link to existing project: No (first time)
   - Project name: survival-budget
   - Build command: `npm run build`
   - Output directory: `dist`

### Automatic Deployments:

1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

**Every push will auto-deploy!**

---

## Option 4: GitHub Pages

### Steps:

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts:**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist -b gh-pages"
     }
   }
   ```

3. **Configure base path in vite.config.ts:**
   ```typescript
   export default defineConfig({
     base: '/Survival-Budget-Mobile-App-Interface/',
     // ... rest of config
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Folder: / (root)

6. **Visit:** `https://rebirthofcode.github.io/Survival-Budget-Mobile-App-Interface/`

---

## Beta Access Gate

The app now requires name and email before granting access.

### How it works:
- User visits app
- Sees beta access form
- Must enter valid name (2+ chars) and email
- Data stored in localStorage
- Access granted immediately

### Stored Data:
```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "accessGrantedAt": "2025-01-19T17:00:00.000Z",
  "version": "beta-v1"
}
```

### Testing Beta Gate:

To test the beta gate again:
1. Open browser DevTools
2. Console:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

### Collecting Beta Tester Info:

Currently data is stored locally only. To collect tester info, add a backend endpoint:

**Option A: Google Sheets (Free)**
- Use Google Sheets API
- Add fetch call in BetaAccessGate.tsx line 57

**Option B: Airtable (Free)**
- Create Airtable base
- Use Airtable API

**Option C: Simple Backend**
- Deploy serverless function
- POST to your endpoint

Example modification (add to BetaAccessGate.tsx):
```typescript
// After line 51 in handleSubmit
await fetch('YOUR_BACKEND_URL/api/beta-testers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userInfo)
});
```

---

## Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in dev mode
- [ ] Beta gate tested and working
- [ ] Updated email in BetaAccessGate.tsx (line 189)
- [ ] Committed all changes
- [ ] Environment variables set (if any)

---

## Post-Deployment

### Monitor Beta Testers:

Since data is stored locally, you'll need to add analytics:

**Quick Setup (Google Analytics):**

1. Create GA4 property
2. Add tracking code to `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

3. Track beta gate completion in BetaAccessGate.tsx:
   ```typescript
   // After line 51
   if (typeof window.gtag !== 'undefined') {
     window.gtag('event', 'beta_access_granted', {
       beta_version: 'v1'
     });
   }
   ```

---

## Rollback Procedure

If something goes wrong:

### Netlify/Vercel:
- Go to dashboard → Deployments
- Click on previous successful deployment
- Click "Publish"

### GitHub Pages:
```bash
git revert HEAD
git push origin main
npm run deploy
```

### Manual:
```bash
# Revert to previous commit
git reset --hard HEAD~1
git push origin main --force

# Redeploy
[follow deployment steps]
```

---

## Environment-Specific Configuration

### Development:
```bash
npm run dev
```
- Beta gate disabled locally (checks localStorage)
- Hot reload enabled

### Production:
```bash
npm run build
npm run preview  # Test production build locally
```
- Beta gate active
- Minified code
- Optimized assets

---

## Troubleshooting

### Beta Gate Not Showing:
1. Clear localStorage: `localStorage.clear()`
2. Hard refresh: Ctrl+Shift+R
3. Check DevTools console for errors

### Build Fails:
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deployment URL Shows 404:
- Check build output directory is `dist`
- Verify SPA redirect rules are configured
- Check base path in vite.config.ts

### Beta Data Not Persisting:
- Users must have localStorage enabled
- Private/incognito mode may clear on close
- iOS Safari private mode blocks localStorage

---

## Next Steps After Beta

1. **Collect Feedback**
   - Add feedback form
   - Monitor user issues

2. **Remove Beta Gate**
   - Remove BetaAccessGate import from App.tsx
   - Remove hasBetaAccess() check

3. **Public Launch**
   - Update marketing materials
   - Announce on social media
   - Submit to app directories

---

## Support

For deployment issues:
- **Netlify:** https://answers.netlify.com
- **Vercel:** https://vercel.com/support
- **GitHub Pages:** https://github.community

For beta testing questions, update the contact email in BetaAccessGate.tsx (line 189).
