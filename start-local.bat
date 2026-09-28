@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js 20.9 or newer, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\next.cmd" (
  echo Installing project dependencies...
  call npm ci
  if errorlevel 1 (
    echo Dependency installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

echo Starting Grand Line Ledger at http://localhost:3000/
call npm run dev