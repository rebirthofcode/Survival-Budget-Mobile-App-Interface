@echo off
echo ========================================
echo EMERGENCY FORCE DEPLOY
echo ========================================
echo.
echo Skipping checkout - deploying directly from safe/2025-10-15
echo.

REM Stay on current branch, just push it as main
git push origin safe/2025-10-15:main --force

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Your safe/2025-10-15 branch is now live on main.
echo survivalbudget.com should auto-deploy in 2-5 minutes.
echo.
pause
