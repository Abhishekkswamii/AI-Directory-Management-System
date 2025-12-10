# LUMINA - Complete Setup & Run Commands

This guide contains the exact commands used to set up and run the LUMINA AI-Powered File Organization System.

---

## 🚀 Prerequisites

- **Node.js** 18 or higher
- **Python** 3.11 or higher
- **Git**
- **Ollama** (for local AI) or **Gemini API Key** (for cloud AI)

---

## 📦 Initial Setup

### 1. Clone the Repository

```powershell
git clone https://github.com/kulwinderkour/AI-Directory-Managment-System.git
cd AI-Directory-Managment-System
```

### 2. Environment Configuration

The project already has `.env` files configured. If you need to modify them:

**Server Environment** (`server/.env`):
- `AI_PROVIDER=ollama` (or `gemini` for cloud AI)
- `CORS_ORIGINS` includes both port 3000 and 5173
- Other settings are pre-configured

**Client Environment** (`client/.env`):
- `VITE_API_URL=http://localhost:8000`

---

## 🔧 Installation Commands

### Install Root Dependencies (for Electron)

```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System"
npm install
```

### Install Client Dependencies

```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\client"
npm install
```

### Install Server Dependencies

```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\server"
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## ▶️ Running the Application

You need **3 separate terminal windows** to run all components.

### Terminal 1: Backend Server

```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\server"
.\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
✅ Ollama embedding client initialized: nomic-embed-text
✅ Ollama LLM client initialized: llama3.2
LUMINA Backend initialized successfully
INFO:     Application startup complete.
```

**✅ Verification:** Open http://localhost:8000/docs in your browser to see the API documentation.

---

### Terminal 2: Frontend Server

```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\client"
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in 2276 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Vite Shortcuts:**
- Press `o + enter` to open in browser
- Press `r + enter` to restart the server
- Press `c + enter` to clear console
- Press `q + enter` to quit

**✅ Verification:** Open http://localhost:5173 in your browser to see the web interface.

---

### Terminal 3: Electron Desktop App

```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System"
$env:NODE_ENV="development"
npx electron .
```

**Result:** The LUMINA desktop application window will open with a frameless design and custom window controls.

**✅ Verification:** The Electron app should load the interface from http://localhost:5173 automatically.

---

## 🌐 Access Points

| Interface | URL | Description |
|-----------|-----|-------------|
| **Electron Desktop App** | Automatically opens | Native desktop application with frameless window |
| **Web Browser** | http://localhost:5173 | Full web interface (same as Electron) |
| **Backend API Docs** | http://localhost:8000/docs | Interactive Swagger API documentation |
| **Backend API** | http://localhost:8000 | REST API endpoint |
| **ReDoc** | http://localhost:8000/redoc | Alternative API documentation |

**Status Check:**
- Backend Health: http://localhost:8000/
- Frontend Status: http://localhost:5173 (should show LUMINA landing page)

---

## 🛑 Stopping the Application

To stop all servers:

1. **Backend Terminal**: Press `Ctrl+C`
2. **Frontend Terminal**: Press `Ctrl+C`
3. **Electron App**: Close the window or press `Ctrl+C` in terminal

---

## 🔄 Restart Commands (If Servers Stop)

### Kill Processes on Ports (if needed)

**Kill Port 8000 (Backend):**
```powershell
$processes = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) { $processes | ForEach-Object { Stop-Process -Id $_ -Force } }
```

**Kill Port 5173 (Frontend):**
```powershell
$processes = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) { $processes | ForEach-Object { Stop-Process -Id $_ -Force } }
```

### Then Restart All Servers

Follow the "Running the Application" section above.

---

## 🐛 Troubleshooting

### White Screen in Electron

**Symptoms:** Electron window opens but shows only a white screen.

**Solutions:**
1. **Verify Backend is Running:** Open http://localhost:8000/docs
   - If it doesn't load, backend is not running
2. **Verify Frontend is Running:** Open http://localhost:5173
   - If it doesn't load, frontend is not running
3. **Check Electron DevTools:** Press `F12` in Electron window to see console errors
4. **Refresh Electron:** Press `Ctrl+R` in Electron window
5. **Check Terminal Outputs:** Ensure all servers show "ready" or "complete" messages

**Common Cause:** Backend not fully initialized before Electron loads. Wait 5-10 seconds after starting backend before launching Electron.

---

### "No module named uvicorn" or Missing Python Dependencies

**Symptoms:** Backend fails to start with module import errors.

**Solution:**
```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\server"
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Note:** Always use `.\venv\Scripts\python.exe` to ensure virtual environment is used.

---

### Ollama Not Responding

**Symptoms:** Backend shows Ollama connection errors or timeouts.

**Check if Ollama is Running:**
```powershell
curl http://localhost:11434/api/tags
```

**Start Ollama Service:**
```bash
ollama serve
```

**Pull Required Models:**
```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

**Alternative:** Switch to Gemini by editing `server/.env`:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_api_key_here
```

---

### Port Already in Use

**Symptoms:** "Address already in use" error when starting servers.

**Solution:** Use the kill commands in the "Restart Commands" section above.

---

### npm/node Errors in Client

**Symptoms:** Frontend fails to start or shows dependency errors.

**Solution:**
```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\client"
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

---

### Virtual Environment Issues

**Symptoms:** Python commands fail or wrong Python version is used.

**Recreate Virtual Environment:**
```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\server"
Remove-Item -Recurse -Force venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## 📝 Quick Start Summary

**Complete setup and run in 3 terminals (IN THIS ORDER):**

### Step 1: Start Backend (Terminal 1)
```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\server"
.\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
**Wait for:** `INFO: Application startup complete.`

---

### Step 2: Start Frontend (Terminal 2)
```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\client"
npm run dev
```
**Wait for:** `➜ Local: http://localhost:5173/`

---

### Step 3: Start Electron (Terminal 3)
```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System"
npx electron .
```
**Result:** Desktop app opens immediately.

---

### ⚡ One-Liner Commands (Copy & Paste)

**Backend:**
```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\server"; .\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System\client"; npm run dev
```

**Electron:**
```powershell
cd "d:\Lumina os ca\AI-Directory-Managment-System"; $env:NODE_ENV="development"; npx electron .
```

---

## 🎯 Project Structure

```
AI-Directory-Managment-System/
├── client/          # React frontend (Vite)
│   ├── node_modules/
│   ├── .env         # Frontend config
│   └── package.json
│
├── server/          # FastAPI backend
│   ├── venv/        # Python virtual environment
│   ├── .env         # Backend config
│   ├── main.py      # Server entry point
│   └── requirements.txt
│
├── electron/        # Electron desktop app
│   ├── main.js
│   └── preload.js
│
└── package.json     # Root package for Electron
```

---

## 🔐 Important Configuration

### CORS Settings (server/.env)

```env
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000","http://localhost:5173","http://127.0.0.1:5173"]
```

This allows both the web frontend (5173) and any alternative ports (3000) to connect to the backend.

### Python Virtual Environment

Always use the virtual environment's Python:
```powershell
.\venv\Scripts\python.exe
```

Not the global Python installation.

---

## ✨ Features

- **AI-Powered Organization**: Using Ollama (llama3.2) or Gemini
- **Semantic Search**: Natural language file search
- **Desktop App**: Electron-based desktop application
- **Web Interface**: Browser-based access
- **Privacy-First**: Client-side file processing
- **Smart Directory Selection**: Single unified button for directory selection (uses modern API with automatic fallback)
- **Drag & Drop**: Simply drag folders into the interface
- **Export Options**: ZIP download or write back to filesystem

## 🎯 Recent Improvements

### UI Simplification (Dec 9, 2025)
- **Removed redundant "Select Files" button** - Both "Choose Directory" and "Select Files" were doing the exact same thing (selecting directories)
- **Unified approach** - Single "Choose Directory" button now intelligently uses modern File System Access API when available, with automatic fallback to traditional file input
- **Cleaner interface** - Simplified upload area with fewer confusing options
- **Better UX** - Users no longer need to choose between two buttons that do the same thing

### Enhanced Search Functionality (Dec 9, 2025)
- **✅ Search is now FULLY WORKING!**
- **📁 Shows ORGANIZED file location** - Each search result displays the AI-organized folder path
- **🎨 Improved UI** - Better visual design with folder icons and location badges
- **💡 Helpful hints** - Added guidance on how semantic search works
- **🔍 Better results display** - Shows file type, size, and full organized path hierarchy
- **🔧 Fixed path storage** - Now stores the organized path (Category/Subcategory/Folder) instead of original upload path
- **Example:** Search for "03_change.cs" and see results like:
  ```
  03_change.cs
  .cs • 1.2 KB
  📁 Location: Code / Backend / C# Files
  ```

**IMPORTANT:** After this update, you need to **re-organize your files** so they get indexed with the organized paths. Old collections will show original paths.

---

## 📞 Support

For issues, check the main README.md or open an issue on GitHub.

---

**Built with 💜 by the LUMINA team**
