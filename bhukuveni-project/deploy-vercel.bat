@echo off
echo.
echo ================================================
echo  Bhukuveni - Vercel Deployment
echo ================================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI is not installed!
    echo [INFO] Installing Vercel CLI...
    call npm install -g vercel
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install Vercel CLI
        echo [TIP] Try running: npm install -g vercel
        pause
        exit /b 1
    )
    echo [OK] Vercel CLI installed!
)

echo [OK] Vercel CLI is installed
call vercel --version
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [OK] Dependencies are ready
echo.

REM Test build
echo [INFO] Testing build locally...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    echo [TIP] Fix the errors above before deploying
    pause
    exit /b 1
)

echo [OK] Build successful!
echo.

REM Ask for deployment type
echo Select deployment type:
echo 1) Preview (test deployment)
echo 2) Production (live deployment)
set /p choice="Enter choice [1-2]: "

if "%choice%"=="1" (
    echo.
    echo [INFO] Deploying to Vercel (Preview)...
    echo.
    call vercel
) else if "%choice%"=="2" (
    echo.
    echo [INFO] Deploying to Vercel (Production)...
    echo.
    call vercel --prod
) else (
    echo [INFO] Invalid choice. Deploying as preview...
    call vercel
)

echo.
echo [OK] Deployment complete!
echo.
echo [SUCCESS] Your app is now live on Vercel!
echo.
echo Next steps:
echo 1. Visit the URL shown above
echo 2. Test all features
echo 3. Share with your team
echo.
pause
