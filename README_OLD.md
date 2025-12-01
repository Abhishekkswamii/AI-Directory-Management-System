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

### One-Line Install (macOS/Linux)

```bash
git clone https://github.com/Abhishekkswamii/AI-Directory-Management-System.git && \
cd AI-Directory-Managment-System && \
chmod +x setup.sh && ./setup.sh
GEMINI_EMBEDDING_MODEL=models/embedding-001

# Database Configuration
DATABASE_URL=sqlite:///./lumina.db
CHROMA_PERSIST_DIR=./chroma_db

# Server Configuration
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
MAX_FILE_SIZE=52428800
MAX_FILES_PER_BATCH=10000

# AI Configuration
MAX_TOKENS=4000
TEMPERATURE=0.7
EMBEDDING_BATCH_SIZE=100
```

**To switch AI providers:**
- For **Ollama** (local): Set `AI_PROVIDER=ollama`
- For **Gemini** (cloud): Set `AI_PROVIDER=gemini` and add your API key

#### **Client Environment** (`client/.env`)

```bash
# Navigate to client directory (from project root)
cd client

# Create .env file from example
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:8000
```

---

## 📥 Installation

### Automatic Installation (Recommended)

**For macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**For Windows:**
```cmd
setup.bat
```

### Manual Installation

#### 1. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

#### 2. Install Backend Dependencies

**macOS/Linux:**
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

**Windows:**
```cmd
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

---

## 🤖 AI Configuration

LUMINA is configured with both AI providers in the same `.env` file. Simply change the `AI_PROVIDER` variable to switch between them.

### Option 1: Using Ollama (Local AI)

Set `AI_PROVIDER=ollama` in `server/.env`

#### Installation

**macOS:**
```bash
# Download and install from ollama.ai
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download installer from [ollama.ai](https://ollama.ai)

#### Pull Required Models

```bash
# Pull the language model
ollama pull llama3.2

# Pull the embedding model
ollama pull nomic-embed-text
```

#### Verify Installation

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# You should see a list of installed models
```

#### Start Ollama Service

**macOS/Linux:**
```bash
ollama serve
```

**Windows:**
Ollama runs as a service automatically after installation.

### Option 2: Using Gemini (Cloud AI)

Set `AI_PROVIDER=gemini` in `server/.env`

#### Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key
4. Update `GEMINI_API_KEY` in your existing `server/.env` file:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_actual_api_key_here
   ```
5. Restart the backend server

⚠️ **IMPORTANT**: Never commit your `.env` file with your actual API key to GitHub!

---

## ▶️ Running the Application

### Development Mode

#### Option 1: Run Both Servers Together

**From project root:**
```bash
npm run dev
```

This will start:
- Backend API at `http://localhost:8000`
- Frontend app at `http://localhost:5173`

#### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🌐 Deployment

### Deploy Frontend (Vercel)

```bash
cd client
npm install -g vercel
vercel
```

Set environment variable in Vercel dashboard:
- `VITE_API_URL` = `https://your-backend-url.com`

### Deploy Backend (Railway)

```bash
cd server
npm install -g @railway/cli
railway login
railway init
railway up
```

Set environment variables in Railway dashboard:
- Copy all variables from `server/.env.example`
- Add your `GEMINI_API_KEY` if using Gemini
- Update `CORS_ORIGINS` to include your frontend URL

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

Access:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "ModuleNotFoundError" in Python

**Solution:**
```bash
cd server
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 2. "Cannot connect to API"

**Solution:**
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in `client/.env`
- Verify CORS settings in `server/config.py`

#### 3. Ollama not responding

**Solution:**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not, start Ollama
ollama serve
```

#### 4. "GEMINI_API_KEY not found"

**Solution:**
- Verify `server/.env` has `GEMINI_API_KEY=your_key`
- Ensure `AI_PROVIDER=gemini` in `server/.env`
- Restart the backend server

#### 5. Port already in use

**macOS/Linux:**
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Windows:**
```cmd
# Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Find and kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

#### 6. Build errors in client

**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 7. Database errors

**Solution:**
```bash
cd server
rm lumina.db
rm -rf chroma_db/
# Restart the server - databases will be recreated
```

---

## 📁 Project Structure

```
AI-Directory-Managment-System/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── store/          # State management
│   │   └── utils/          # Helper functions
│   ├── .env                # Frontend environment (create this)
│   └── .env.example        # Frontend template
│
├── server/                 # FastAPI backend
│   ├── core/              # AI engine
│   ├── database/          # Database models
│   ├── .env               # Backend environment (create this)
│   └── .env.example       # Backend template
│
├── docker-compose.yml     # Docker configuration
├── setup.sh              # Unix setup script
├── setup.bat             # Windows setup script
└── README.md             # This file
```

---

## 🔐 Security Notes

### Files to NEVER Commit to GitHub

The following are already in `.gitignore`:

- `client/.env` - Contains API URLs
- `server/.env` - Contains API keys and secrets
- `server/lumina.db` - Your database
- `server/chroma_db/` - Vector database
- `node_modules/` - Dependencies
- `venv/` - Python virtual environment

### Before Pushing to GitHub

1. ✅ Verify `.env` files are not tracked:
   ```bash
   git status
   # Should NOT show .env files
   ```

2. ✅ Only `.env.example` files should be committed (with placeholder values)

3. ✅ If you accidentally committed secrets:
   - Remove from git history
   - Rotate all API keys immediately
   - Update `.gitignore`

---

## 🎯 Usage Guide

### 1. Upload Files

- Click "Begin" on landing page
- Drag and drop a folder or click to browse
- Files are processed client-side for privacy

### 2. AI Analysis

- LUMINA extracts text from your files
- AI analyzes content and creates categories
- 3-level hierarchy is generated (no "Misc" folders)

### 3. Preview Organization

- View files organized in orbital rings
- Expand categories to see structure
- Review before finalizing

### 4. Export

- Download as ZIP file
- Or write back to file system
- Access anytime from Collections

### 5. Search

- Use natural language queries
- Semantic search across all files
- Find files by content, not just name

---

## 🛠️ Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand (state management)

### Backend
- FastAPI (Python)
- SQLModel + SQLite
- ChromaDB (vector database)
- Ollama / Gemini (AI)

---

## 📖 API Documentation

Once the backend is running, access interactive API docs at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript/Python best practices
- Add tests for new features
- Update documentation as needed
- Follow commit message conventions

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) - Local AI models
- [Google Gemini](https://ai.google.dev/) - Cloud AI
- [ChromaDB](https://www.trychroma.com/) - Vector database
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python framework
- [React](https://react.dev/) - UI framework

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/abhishekkswamii/AI-Directory-Managment-System/issues)
- **Discussions**: [GitHub Discussions](https://github.com/abhishekkswamiiAI-Directory-Managment-System/discussions)

---

## 🌟 Star History

If you find LUMINA useful, please consider giving it a ⭐ on GitHub!

---

**Built with 💜 by the LUMINA team**

Transform your digital chaos into cosmic order. ✨
