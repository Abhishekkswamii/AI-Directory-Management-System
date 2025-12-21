# LUMINA - Quick Start & Command Reference

This is a quick reference guide for running LUMINA. For complete documentation, see [README.md](README.md).

---

## 🚀 Prerequisites

- **Node.js** 18+
- **Python** 3.11+
- **Git**
- **Ollama** (for local AI) or **Gemini API Key** (for cloud AI)

---

## ⚡ Quick Start Commands

### 1. Clone & Install

```bash
git clone https://github.com/Abhishekkswamii/AI-Directory-Management-System.git
cd AI-Directory-Managment-System
./setup.sh  # On Windows: setup.bat
```

### 2. Start All Services

```bash
npm run dev
```

That's it! The application will open automatically.

---

## 📍 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Web App** | http://localhost:5173 | Browser interface |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **Health Check** | http://localhost:8000/ | Backend status |
| **Desktop App** | Auto-opens | Electron application |

---

## 🔧 Individual Service Commands

### Backend Server

**macOS/Linux:**
```bash
cd server
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Windows (PowerShell):**
```powershell
cd server
.\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
✅ Ollama embedding client initialized: nomic-embed-text
✅ Ollama LLM client initialized: llama3.2
INFO: Uvicorn running on http://0.0.0.0:8000
```

---

### Frontend Server

```bash
cd client
npm run dev
```

**Expected Output:**
```
VITE v5.4.21 ready in 2276 ms
➜  Local:   http://localhost:5173/
```

**Keyboard Shortcuts:**
- `o + enter` - Open in browser
- `r + enter` - Restart
- `c + enter` - Clear console
- `q + enter` - Quit

---

### Electron Desktop App

**macOS/Linux:**
```bash
NODE_ENV=development npx electron .
```

**Windows:**
```powershell
$env:NODE_ENV="development"
npx electron .
```

---

## 🤖 AI Configuration

### Ollama (Local AI)

**Install:**
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: Download from ollama.ai
```

**Download Models:**
```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

**Start Service:**
```bash
ollama serve
```

**Verify:**
```bash
curl http://localhost:11434/api/tags
```

---

### Gemini (Cloud AI)

1. Get API key: https://makersuite.google.com/app/apikey
2. Edit `server/.env`:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Restart backend

---

## 🔄 Common Tasks

### Switch AI Provider

Edit `server/.env`:
```env
AI_PROVIDER=ollama  # or "gemini"
```

Then restart backend.

---

### Reinstall Dependencies

```bash
# Root
npm install

# Frontend
cd client && npm install

# Backend
cd server
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

### Build for Production

**Frontend:**
```bash
cd client
npm run build
```

**Electron:**
```bash
npm run build:electron
```

---

### Kill Processes on Ports

**macOS/Linux:**
```bash
# Port 8000 (Backend)
lsof -ti:8000 | xargs kill -9

# Port 5173 (Frontend)
lsof -ti:5173 | xargs kill -9
```

**Windows (PowerShell):**
```powershell
# Port 8000
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess -Unique | 
  ForEach-Object { Stop-Process -Id $_ -Force }

# Port 5173
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess -Unique | 
  ForEach-Object { Stop-Process -Id $_ -Force }
```

---

## 🐛 Quick Troubleshooting

### White Screen in Electron
1. Check backend is running: http://localhost:8000/docs
2. Check frontend is running: http://localhost:5173
3. Press `F12` in Electron for DevTools
4. Press `Ctrl+R` to refresh

---

### Backend Won't Start
```bash
cd server
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

### Ollama Not Responding
```bash
# Check if running
curl http://localhost:11434/api/tags

# Start service
ollama serve

# Pull models
ollama pull llama3.2
ollama pull nomic-embed-text
```

---

### Port Already in Use
Use the "Kill Processes on Ports" commands above.

---

### CORS Errors
Update `server/.env`:
```env
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://127.0.0.1:3000","http://127.0.0.1:5173"]
```

Restart backend.

---

### Database Issues
```bash
cd server
rm lumina.db
rm -rf chroma_db/
# Restart backend - databases will recreate automatically
```

---

## 📦 Environment Files

### server/.env

```env
ENVIRONMENT=development
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-pro
GEMINI_EMBEDDING_MODEL=models/embedding-001
DATABASE_URL=sqlite:///./lumina.db
CHROMA_PERSIST_DIR=./chroma_db
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://127.0.0.1:3000","http://127.0.0.1:5173"]
MAX_FILE_SIZE=52428800
MAX_FILES_PER_BATCH=10000
MAX_TOKENS=4000
TEMPERATURE=0.7
EMBEDDING_BATCH_SIZE=100
```

### client/.env

```env
VITE_API_URL=http://localhost:8000
```

---

## 🎯 Development Workflow

1. **Start Backend** → Wait for "Application startup complete"
2. **Start Frontend** → Wait for "ready" message
3. **Start Electron** (optional) → Opens automatically
4. **Access Web** → http://localhost:5173

---

## 📚 Additional Resources

- **Full Documentation**: [README.md](README.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **API Docs**: http://localhost:8000/docs (when running)
- **GitHub Issues**: https://github.com/Abhishekkswamii/AI-Directory-Management-System/issues

---

## 🛑 Stopping Services

Press `Ctrl+C` in each terminal window to stop services gracefully.

---

<div align="center">

**Quick Reference Guide for LUMINA**

[⬆ Back to Top](#lumina---quick-start--command-reference)

</div>
