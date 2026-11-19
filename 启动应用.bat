@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instala Node.js primeiro.
  echo 未找到 Node.js，请先安装：https://nodejs.org
  pause
  exit /b 1
)
start "" /b powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:8788'"
node server.js
pause
