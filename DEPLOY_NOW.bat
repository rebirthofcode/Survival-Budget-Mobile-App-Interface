@echo off
echo ========================================
echo Survival Budget - Force Deploy Script
echo ========================================
echo.
echo This will:
echo 1. Force abort any stuck operations
echo 2. Push your local code to main
echo 3. Completely overwrite remote
echo.
pause

echo.
echo [1/4] Aborting any stuck operations...
git reset --hard HEAD
git clean -fd

echo.
echo [2/4] Updating main branch locally...
git branch -D main 2>nul
git checkout -b main

echo.
echo [3/4] Force pushing to remote (overwriting)...
git push origin main --force

echo.
echo [4/4] Verifying push...
git log --oneline -3

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your code is now on GitHub main branch.
echo.
echo Next: Visit your domain survivalbudget.com
echo The site should auto-deploy from main branch.
echo.
pause
