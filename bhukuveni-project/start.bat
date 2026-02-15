@echo off
echo.
echo ========================================
echo  Bhukuveni Facility Manager - Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo [INFO] Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo [OK] npm is installed
call npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    echo [INFO] This may take a few minutes...
    echo.
    call npm install
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo [OK] Dependencies installed successfully!
    ) else (
        echo.
        echo [ERROR] Failed to install dependencies
        echo [TIP] Try running: npm install --legacy-peer-deps
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies already installed
)

echo.
echo [INFO] Starting development server...
echo [INFO] The app will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
pause
