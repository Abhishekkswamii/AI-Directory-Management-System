# 🌟 LUMINA - AI-Powered File Organization System

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![React](https://img.shields.io/badge/react-18+-61dafb.svg)
![FastAPI](https://img.shields.io/badge/fastapi-0.100+-009688.svg)

**LUMINA** is an intelligent, AI-powered file organization system that automatically categorizes and structures your files into a logical hierarchy. Built with React, FastAPI, and Electron, powered by Ollama or Gemini AI.

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [Usage](#-usage) • [Deployment](#-deployment) • [Troubleshooting](#-troubleshooting)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📥 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [▶️ Running the Application](#️-running-the-application)
- [🤖 AI Setup](#-ai-setup)
- [🌐 Deployment](#-deployment)
- [🛠️ Development](#️-development)
- [🐛 Troubleshooting](#-troubleshooting)
- [📚 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### Core Capabilities
- 🧠 **AI-Powered Organization** - Intelligent file categorization using Ollama or Gemini
- 🔍 **Semantic Search** - Natural language file search with vector embeddings
- 📊 **Smart Hierarchy** - Automatically creates 3-level organization structures
- 📦 **Multi-Format Support** - PDF, DOCX, images (with OCR), text files, and more
- 🗄️ **Collection Management** - Save, view, and manage multiple organizations

### User Experience
- 🎨 **Cosmic UI Design** - Futuristic interface with glassmorphism and nebula gradients
- 🖥️ **Desktop & Web** - Runs as Electron desktop app or in browser
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎯 **Drag & Drop** - Intuitive file upload interface
- ⚡ **Real-time Updates** - Live progress tracking during organization

### Technical Features
- 🌐 **Dual AI Support** - Choose between local (Ollama) or cloud (Gemini) AI
- 🔒 **Privacy Focused** - Local AI option keeps your data private
- 💾 **Export Options** - Download as ZIP or write back to file system
- 🔄 **Batch Processing** - Handle thousands of files efficiently
- 📈 **Progress Tracking** - Real-time status updates with percentage completion

---

## 🏗️ Architecture

LUMINA follows a modern full-stack architecture:

```
┌──────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript + Vite)                │
│  ├─ UI Components (Glassmorphic Design)             │
│  ├─ State Management (Zustand)                      │
│  └─ File Processing (PDF.js, Mammoth, Tesseract)    │
└──────────────────┬───────────────────────────────────┘
                   │ REST API
┌──────────────────▼───────────────────────────────────┐
│  Backend (FastAPI + Python)                          │
│  ├─ API Endpoints                                    │
│  ├─ File Scanner & Extractor                        │
│  ├─ AI Thinker (Organization Logic)                 │
│  └─ Database Management                             │
└──────────┬───────────────────┬───────────────────────┘
           │                   │
┌──────────▼────────┐  ┌──────▼──────────────┐
│  SQLite Database  │  │  ChromaDB (Vectors) │
│  (Metadata)       │  │  (Semantic Search)  │
└───────────────────┘  └─────────────────────┘
           │
┌──────────▼───────────────────────────────────────────┐
│  AI Services                                         │
│  ├─ Ollama (Local) - llama3.2, nomic-embed-text    │
│  └─ Gemini (Cloud) - gemini-pro, embedding-001     │
└──────────────────────────────────────────────────────┘
```

For detailed architecture, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://www.python.org/downloads/))
- **Git** ([Download](https://git-scm.com/downloads))

### AI Provider Selection

| Provider | Setup Time | Cost | Privacy | Best For |
|----------|-----------|------|---------|----------|
| **Ollama** | 10-15 min | Free | 🔒 Local | Privacy, offline use |
| **Gemini** | 2 min | Free tier | ☁️ Cloud | Quick setup, no install |

### One-Line Install

**macOS/Linux:**
```bash
git clone https://github.com/Abhishekkswamii/AI-Directory-Management-System.git && \
cd AI-Directory-Managment-System && \
chmod +x setup.sh && ./setup.sh
```

**Windows:**
```cmd
git clone https://github.com/Abhishekkswamii/AI-Directory-Management-System.git && cd AI-Directory-Managment-System && setup.bat
```

---

## 📥 Installation

### Automatic Setup (Recommended)

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

The setup script will:
- ✅ Create Python virtual environment
- ✅ Install all dependencies (Frontend + Backend + Electron)
- ✅ Set up environment files
- ✅ Verify installation

### Manual Installation

<details>
<summary>Click to expand manual installation steps</summary>

#### 1. Install Root Dependencies (for Electron)

```bash
npm install
```

#### 2. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

#### 3. Install Backend Dependencies

**macOS/Linux:**
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

**Windows (PowerShell):**
```powershell
cd server
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..
```

</details>

---

## ⚙️ Configuration

### Environment Files

#### Server Configuration (`server/.env`)

Create `server/.env` with the following content:

```env
# Environment
ENVIRONMENT=development

# AI Provider: "ollama" (local) or "gemini" (cloud)
AI_PROVIDER=ollama

# Ollama Configuration (Local AI)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text

# Gemini Configuration (Cloud AI)
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
GEMINI_EMBEDDING_MODEL=models/embedding-001

# Database
DATABASE_URL=sqlite:///./lumina.db
CHROMA_PERSIST_DIR=./chroma_db

# Server
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://127.0.0.1:3000","http://127.0.0.1:5173"]
MAX_FILE_SIZE=52428800
MAX_FILES_PER_BATCH=10000

# AI Settings
MAX_TOKENS=4000
TEMPERATURE=0.7
EMBEDDING_BATCH_SIZE=100
```

#### Client Configuration (`client/.env`)

Create `client/.env`:

```env
VITE_API_URL=http://localhost:8000
```

### Switching AI Providers

Simply change the `AI_PROVIDER` variable in `server/.env`:
- For **Ollama** (local): `AI_PROVIDER=ollama`
- For **Gemini** (cloud): `AI_PROVIDER=gemini`

Then restart the backend server.

---

## 🤖 AI Setup

### Option 1: Ollama (Local AI - Recommended for Privacy)

#### Install Ollama

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from [ollama.ai](https://ollama.ai)

#### Download Required Models

```bash
# Language model for organization
ollama pull llama3.2

# Embedding model for semantic search
ollama pull nomic-embed-text
```

#### Start Ollama Service

**macOS/Linux:**
```bash
ollama serve
```

**Windows:**
Runs automatically as a service after installation.

#### Verify Installation

```bash
curl http://localhost:11434/api/tags
```

You should see both models listed.

### Option 2: Gemini (Cloud AI - Fastest Setup)

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `server/.env`:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Restart the backend server

⚠️ **Security Note**: Never commit `.env` files to version control!

---

## ▶️ Running the Application

### Quick Start (All Components)

**From project root:**
```bash
npm run dev
```

This starts:
- ✅ Backend API → `http://localhost:8000`
- ✅ Frontend Web → `http://localhost:5173`
- ✅ Electron Desktop App

### Run Individual Components

<details>
<summary>Click to expand individual run commands</summary>

#### Terminal 1: Backend Server

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
INFO: Application startup complete.
```

#### Terminal 2: Frontend Development Server

```bash
cd client
npm run dev
```

**Expected Output:**
```
VITE v5.4.21 ready in 2276 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Vite Shortcuts:**
- `o + enter` - Open in browser
- `r + enter` - Restart server
- `c + enter` - Clear console
- `q + enter` - Quit

#### Terminal 3: Electron Desktop App

**macOS/Linux:**
```bash
NODE_ENV=development npx electron .
```

**Windows (PowerShell):**
```powershell
$env:NODE_ENV="development"
npx electron .
```

</details>

### Access Points

| Interface | URL | Description |
|-----------|-----|-------------|
| 🌐 **Web App** | http://localhost:5173 | Browser interface |
| 🖥️ **Desktop App** | Auto-opens | Electron frameless window |
| 📚 **API Docs** | http://localhost:8000/docs | Swagger documentation |
| 📖 **ReDoc** | http://localhost:8000/redoc | Alternative API docs |
| ❤️ **Health Check** | http://localhost:8000/ | Server status |

### Stopping the Application

To stop all servers, press `Ctrl+C` in each terminal window.

---

## 🌐 Deployment

### Deploy Frontend (Vercel)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure build settings:
   ```
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   ```
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

### Deploy Backend (Railway)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

3. Configure environment variables in Railway dashboard
4. Note your deployed backend URL for frontend configuration

### Deploy with Docker

<details>
<summary>Click to expand Docker deployment</summary>

#### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Individual Containers

**Backend:**
```bash
cd server
docker build -t lumina-backend .
docker run -p 8000:8000 lumina-backend
```

**Frontend:**
```bash
cd client
docker build -t lumina-frontend .
docker run -p 5173:5173 lumina-frontend
```

</details>

---

## 🛠️ Development

### Project Structure

```
AI-Directory-Managment-System/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   └── utils/         # Utilities
│   └── package.json
├── server/                 # FastAPI backend
│   ├── core/              # Core AI modules
│   │   ├── scanner.py     # File scanning
│   │   ├── extractor.py   # Text extraction
│   │   ├── embeddings.py  # Vector embeddings
│   │   ├── thinker.py     # AI organization logic
│   │   └── organizer.py   # Database operations
│   ├── database/          # Database models
│   ├── main.py            # API endpoints
│   └── requirements.txt
├── electron/              # Electron wrapper
│   ├── main.js           # Main process
│   └── preload.js        # Preload script
└── package.json          # Root package.json
```

### Adding New Features

1. **Frontend**: Add components in `client/src/components/`
2. **Backend**: Add endpoints in `server/main.py`
3. **AI Logic**: Modify `server/core/thinker.py`

### Running Tests

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
source venv/bin/activate
pytest
```

---

## 🐛 Troubleshooting

### White Screen in Electron

**Symptoms:** Electron window opens but shows white screen.

**Solutions:**
1. Verify backend is running: http://localhost:8000/docs
2. Verify frontend is running: http://localhost:5173
3. Press `F12` in Electron to open DevTools
4. Press `Ctrl+R` to refresh the Electron window
5. Wait 5-10 seconds after starting backend before launching Electron

---

### Backend Not Starting

**Symptoms:** "No module named uvicorn" or module import errors.

**Solution:**
```bash
cd server
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Ensure you always use the virtual environment Python:
```bash
# macOS/Linux
./venv/bin/python -m uvicorn main:app --reload

# Windows
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```

---

### Ollama Not Responding

**Symptoms:** Ollama connection errors or timeouts.

**Check if Ollama is running:**
```bash
curl http://localhost:11434/api/tags
```

**Start Ollama:**
```bash
ollama serve
```

**Pull models if missing:**
```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

**Alternative:** Switch to Gemini in `server/.env`:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_api_key_here
```

---

### Port Already in Use

**Symptoms:** "Address already in use" error.

**macOS/Linux:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Windows (PowerShell):**
```powershell
# Kill port 8000
$processes = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) { $processes | ForEach-Object { Stop-Process -Id $_ -Force } }

# Kill port 5173
$processes = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) { $processes | ForEach-Object { Stop-Process -Id $_ -Force } }
```

---

### Frontend Build Errors

**Symptoms:** npm install or build failures.

**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### CORS Errors

**Symptoms:** API requests blocked by CORS policy.

**Solution:** Update `CORS_ORIGINS` in `server/.env`:
```env
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://127.0.0.1:3000","http://127.0.0.1:5173"]
```

Restart the backend server after changes.

---

### Database Errors

**Symptoms:** SQLite or ChromaDB errors.

**Solution:**
```bash
cd server
rm lumina.db
rm -rf chroma_db/
# Restart backend - databases will be recreated
```

---

## 📚 API Documentation

### Interactive Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

#### File Analysis
```http
POST /api/analyze
Content-Type: application/json

{
  "files": [
    {
      "name": "document.pdf",
      "content": "base64_encoded_content",
      "metadata": {}
    }
  ]
}
```

#### Semantic Search
```http
POST /api/search
Content-Type: application/json

{
  "query": "financial reports from 2023",
  "collection_id": "uuid"
}
```

#### Collections
```http
GET /api/collections
GET /api/collections/{collection_id}
DELETE /api/collections/{collection_id}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Code Style

- **Frontend**: Follow React best practices, use TypeScript
- **Backend**: Follow PEP 8 Python style guide
- **Commits**: Use conventional commits format

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) - Local AI inference
- [Google Gemini](https://ai.google.dev/) - Cloud AI services
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [React](https://react.dev/) - Frontend framework
- [ChromaDB](https://www.trychroma.com/) - Vector database
- [Electron](https://www.electronjs.org/) - Desktop app framework

---

## 📞 Support

- 📧 **Email**: support@lumina.ai
- 🐛 **Issues**: [GitHub Issues](https://github.com/Abhishekkswamii/AI-Directory-Management-System/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Abhishekkswamii/AI-Directory-Management-System/discussions)

---

<div align="center">

**Made with ❤️ by the LUMINA Team**

[⬆ Back to Top](#-lumina---ai-powered-file-organization-system)

</div>
