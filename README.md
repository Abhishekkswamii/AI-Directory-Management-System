# ✨ Aether — AI File Organizer

Aether is an AI-powered tool designed to automatically organize your messy folders into structured, meaningful categories. It reads and understands file content using AI models (Ollama or OpenAI) and intelligently suggests or performs file organization.

---

## 📌 What Aether Does

### ✅ Key Functions
- 📁 **Scans** any folder and analyzes file types  
- 🧠 **Understands file content** using AI  
- 📄 **Reads PDFs, DOCX, images (OCR), code files, text files**  
- 📂 **Automatically organizes** files into clean, meaningful folders  
- 🔍 **Supports natural-language search**  
- ♻️ **Provides safe dry-run & full undo support**

---

# 🚀 Installation Guide (Windows & Mac)

Below are the required steps to install dependencies and set up Aether from Git.

---

## 1️⃣ Clone the Repository (Git Only)

Same for Windows & macOS:

```bash
git clone https://github.com/kulwinderkour/aether.git
cd aether
```

## 2️⃣ Install Requirements

### 🪟 Windows
Install Python packages:

```powershell
pip install typer rich sqlmodel pydantic-settings python-dotenv PyPDF2 python-docx pillow pytesseract python-magic-bin openai requests chromadb
```

(Optional) Install Tesseract OCR:

Download: https://github.com/UB-Mannheim/tesseract/wiki

Add to PATH:

```makefile
C:\Program Files\Tesseract-OCR
```

### 🍎 macOS
Install Python packages:

```bash
pip3 install typer rich sqlmodel pydantic-settings python-dotenv PyPDF2 python-docx pillow pytesseract python-magic openai requests chromadb
```

(Optional) Install Tesseract OCR:

```bash
brew install tesseract
```

## 3️⃣ Setup AI (Recommended: Ollama)

Install Ollama:
https://ollama.ai

Pull an AI model:

```bash
ollama pull llama2
```

Create .env file:

```bash
cp .env.example .env     # macOS
Copy-Item .env.example .env   # Windows PowerShell
```

Inside .env, set:

```ini
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

---

## ▶️ How to Run Aether on Any Folder

**Scan a folder**
```bash
python -m aether.main scan "<directory path>"
```

**AI categorization**
```bash
python -m aether.main think
```

**Preview organization (safe mode)**
```bash
python -m aether.main organize --dry-run
```

**Organize files**
```bash
python -m aether.main organize
```

**Search files (natural language)**
```bash
python -m aether.main find "your query"
```

---

## ✅ Example Usage

```bash
python -m aether.main scan "C:\Users\YourName\Downloads"
python -m aether.main think
python -m aether.main organize

