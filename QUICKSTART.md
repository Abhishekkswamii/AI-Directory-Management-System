# 🚀 Quick Start Guide

## Installation

### 1. Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- OpenAI API Key OR Ollama installed

### 2. Clone and Install
```bash
git clone https://github.com/yourusername/lumina.git
cd lumina
npm run install:all
```

### 3. Configure Backend
Create `server/.env`:
```env
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
```

### 4. Configure Frontend
Create `client/.env`:
```env
VITE_API_URL=http://localhost:8000
```

### 5. Start Development
```bash
npm run dev
```

Visit http://localhost:3000

## Using Ollama (Local AI)

1. Install Ollama: https://ollama.ai
2. Pull models:
```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

3. Update `server/.env`:
```env
USE_OLLAMA=true
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

## Deployment

### Vercel (Frontend)
```bash
cd client
vercel
```

### Railway (Backend)
```bash
cd server
railway login
railway init
railway up
```

## Troubleshooting

**Port already in use**
```bash
# Kill processes on ports 3000 and 8000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

**Module not found**
```bash
# Reinstall dependencies
npm run install:all
```

**API connection failed**
- Check backend is running on port 8000
- Verify VITE_API_URL in client/.env
- Check CORS settings in server/config.py

## Features Overview

✨ **Upload** - Drag & drop any folder  
🧠 **AI Analysis** - GPT-4o understands files  
🎨 **Preview** - See orbital category rings  
📦 **Export** - Download organized ZIP  
🔍 **Search** - Semantic file search  
📚 **History** - View all collections  

Enjoy LUMINA! 🌟
