@echo off
echo 🌟 LUMINA Installation Script
echo ==============================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python 3.11+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ %PYTHON_VERSION% found

REM Install root dependencies
echo.
echo 📦 Installing root dependencies...
call npm install

REM Install client dependencies
echo.
echo 📦 Installing client dependencies...
cd client
call npm install
cd ..

REM Install server dependencies
echo.
echo 📦 Installing server dependencies...
cd server
python -m pip install -r requirements.txt
cd ..

REM Create .env files if they don't exist
echo.
echo ⚙️ Setting up configuration...

if not exist "server\.env" (
    echo Creating server\.env from example...
    copy server\.env.example server\.env >nul
    echo ⚠️ Don't forget to add your OPENAI_API_KEY to server\.env
)

if not exist "client\.env" (
    echo Creating client\.env from example...
    copy client\.env.example client\.env >nul
)

echo.
echo ✨ Installation complete!
echo.
echo Next steps:
echo 1. Edit server\.env and add your OPENAI_API_KEY
echo 2. Run 'npm run dev' to start both servers
echo 3. Visit http://localhost:3000
echo.
echo Enjoy LUMINA! 🚀
pause
