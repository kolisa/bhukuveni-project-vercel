@echo off
echo ================================
echo Bhukuveni Deployment Helper
echo ================================
echo.

echo Step 1: Building project...
call npm run build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed! Check errors above.
    pause
    exit /b 1
)

echo.
echo Step 2: Checking git status...
git status

echo.
echo Step 3: Ready to commit and push!
echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Deploy update

echo.
echo Committing with message: %commit_msg%
git add .
git commit -m "%commit_msg%"
git push

echo.
echo ================================
echo ✅ DEPLOYMENT COMPLETE!
echo ================================
echo.
echo Your app is deploying to Vercel now!
echo Check https://vercel.com/dashboard for status
echo.
echo Next steps if Cloud Sync not enabled:
echo 1. Create Supabase project at https://supabase.com
echo 2. Add environment variables in Vercel dashboard
echo 3. See DEPLOY.md for detailed instructions
echo.
pause
