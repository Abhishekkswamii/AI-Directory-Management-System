# LUMINA - AI That Organizes Your Entire Digital Life

## Project Structure
- `client/`: React + Vite + TypeScript frontend
- `server/`: FastAPI + Python backend

## Prerequisites
- Node.js (v18+)
- Python (v3.11+)

## Quick Start

### 1. Backend Setup (Server)
Open a terminal in the `server` directory:

```powershell
cd server
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your OpenAI/Ollama keys
uvicorn main:app --reload
```

The API will run at `http://localhost:8000`.

### 2. Frontend Setup (Client)
Open a new terminal in the `client` directory:

```powershell
cd client
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

## Features
- **Cosmic UI**: Immersive 3D background and glassmorphism.
- **AI Brain**: Analyzes files using OpenAI/Ollama.
- **Auto-Organization**: Categorizes files into a logical hierarchy.
