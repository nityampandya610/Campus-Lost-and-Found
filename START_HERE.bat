@echo off
setlocal
cd /d "%~dp0"
echo ======================================
echo   Campus Lost and Found Portal
 echo ======================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 18 or newer from https://nodejs.org/
  pause
  exit /b 1
)
if not exist node_modules\express (
  echo Installing required packages for first run...
  call npm install
  if errorlevel 1 (
    echo Package installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
echo Starting website. Keep this window open.
start "" http://localhost:3000
call npm start
pause
