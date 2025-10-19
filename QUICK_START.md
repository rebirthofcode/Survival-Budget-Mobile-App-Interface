# Quick Start - Deploy Your Beta

Choose your path:

---

## 🚀 Fastest: Netlify (Recommended)

1. **Install CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login & Deploy:**
   ```bash
   netlify login
   netlify deploy --prod
   ```

3. **Choose directory when prompted:** `dist`

4. **Done!** Your app is live at `https://[random].netlify.app`

**Time: 2 minutes**

---

## 💪 Complete Control: Force Push to GitHub

1. **Commit everything:**
   ```bash
   git add .
   git commit -m "feat: beta release v1.0"
   ```

2. **Force push to main:**
   ```bash
   git checkout main
   git reset --hard safe/2025-10-15
   git push origin main --force
   ```

3. **Set up deployment:**
   - Connect GitHub to Netlify/Vercel
   - Or use GitHub Pages

**Time: 5 minutes**

---

## 📋 Before You Deploy

- [ ] Update email in `src/components/BetaAccessGate.tsx` line 189
- [ ] Run `npm test` (should see 59/59)
- [ ] Run `npm run build` (should succeed)

---

## 📚 Need More Details?

- **Full Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Force Push Guide:** [FORCE_PUSH_GUIDE.md](./FORCE_PUSH_GUIDE.md)
- **Beta Release Info:** [BETA_RELEASE_SUMMARY.md](./BETA_RELEASE_SUMMARY.md)

---

## 🆘 Quick Fixes

**Beta gate not showing?**
```javascript
// Browser console
localStorage.clear()
location.reload()
```

**Build fails?**
```bash
rm -rf node_modules dist
npm install
npm run build
```

---

**You're ready to go! Pick a method above and deploy.** 🎉
