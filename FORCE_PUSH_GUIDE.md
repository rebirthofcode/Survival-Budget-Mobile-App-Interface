# Force Push Guide - Complete Overwrite

This guide provides the exact commands to completely overwrite your remote repository.

## ⚠️ CRITICAL WARNING

**This will DELETE all files on the remote that don't exist locally!**

Make absolutely sure:
- ✅ You have the correct local code
- ✅ You're okay losing any remote-only changes
- ✅ You've tested the build locally
- ✅ No one else is working on the repo

---

## Quick Command Reference

### 1. Commit Current Changes
```bash
git add .
git commit -m "feat: add beta access gate and fixes"
```

### 2. Force Push to Current Branch
```bash
# Push to your current branch (safe/2025-10-15)
git push origin safe/2025-10-15 --force
```

### 3. Force Push to Main (Production)
```bash
# Switch to main
git checkout main

# Reset main to match current branch
git reset --hard safe/2025-10-15

# Force push to main
git push origin main --force
```

---

## Alternative: Clean Push (Safer)

If you want to preserve history but ensure clean state:

```bash
# 1. Commit everything
git add .
git commit -m "feat: complete beta version"

# 2. Create clean branch
git checkout -b production-clean

# 3. Push clean branch
git push origin production-clean --force

# 4. Make this your new main (on GitHub)
# Go to: Settings → Branches → Default branch → Switch to production-clean
```

---

## Verification Commands

### Check what will be pushed:
```bash
git diff origin/main
```

### Check status:
```bash
git status
git log --oneline -5
```

### Verify remote after push:
```bash
git fetch origin
git log origin/main --oneline -5
```

---

## Common Scenarios

### Scenario 1: Fresh Deploy to Main
```bash
# You're on: safe/2025-10-15
# You want: Everything on main

git checkout main
git reset --hard safe/2025-10-15
git push origin main --force
```

### Scenario 2: Keep Both Branches
```bash
# Update safe branch
git push origin safe/2025-10-15 --force

# Also update main
git checkout main
git merge safe/2025-10-15
git push origin main --force
```

### Scenario 3: Nuclear Option (Start Fresh)
```bash
# Create orphan branch (no history)
git checkout --orphan fresh-start

# Add all files
git add .
git commit -m "initial beta release"

# Replace main
git branch -D main
git branch -m main
git push origin main --force
```

---

## If Something Goes Wrong

### Undo Force Push (within ~30 days):
```bash
# Find the old commit
git reflog

# Reset to old commit
git reset --hard HEAD@{2}  # or specific commit hash

# Force push the old version back
git push origin main --force
```

### Restore from GitHub:
1. Go to repository on GitHub
2. Commits → Find old commit
3. Click `<>` to browse files
4. Download ZIP
5. Extract and commit

---

## Post-Push Checklist

After force pushing:

1. **Verify on GitHub**
   - Visit: https://github.com/rebirthofcode/Survival-Budget-Mobile-App-Interface
   - Check files match local
   - Verify commit history

2. **Test Deployment**
   - If auto-deploy enabled, wait for build
   - Visit live URL
   - Test beta gate

3. **Notify Team**
   - Inform anyone else working on repo
   - They'll need to pull changes

---

## Team Members Need To Do This

If others are working on the repo, they must:

```bash
# Fetch new state
git fetch origin

# Hard reset their local copy
git reset --hard origin/main

# Or if on different branch
git checkout their-branch
git reset --hard origin/their-branch
```

---

## Best Practices

✅ **DO:**
- Test locally first (`npm run build`)
- Commit all changes before force push
- Verify with `git diff origin/main`
- Document what you're deploying

❌ **DON'T:**
- Force push without testing
- Force push with uncommitted changes
- Force push to shared branches without warning
- Force push if you're unsure

---

## Emergency Contacts

- **GitHub Repository:** https://github.com/rebirthofcode/Survival-Budget-Mobile-App-Interface
- **Git Documentation:** https://git-scm.com/docs/git-push

---

## Quick Copy-Paste Commands

**Complete Fresh Deploy:**
```bash
# From safe/2025-10-15 branch
git add .
git commit -m "feat: beta release with access gate"
git checkout main
git reset --hard safe/2025-10-15
git push origin main --force
```

**Verify Success:**
```bash
git fetch origin
git log origin/main --oneline -5
git diff origin/main
```

**If You Need to Undo:**
```bash
git reflog
git reset --hard <commit-hash>
git push origin main --force
```

---

**Remember:** Force pushing is powerful and destructive. Use with caution!
