# 📚 Getting Started with Aether

Welcome! This guide will help you get started with Aether in just a few minutes.

## Table of Contents

1. [Installation](#installation)
2. [First-Time Setup](#first-time-setup)
3. [Your First Organization](#your-first-organization)
4. [Common Use Cases](#common-use-cases)
5. [Troubleshooting](#troubleshooting)

---

## Installation

### Step 1: Install Python

Aether requires Python 3.11 or higher.

**Check your Python version:**
```bash
python --version
```

If you need to install or update Python:
- **Windows:** Download from [python.org](https://www.python.org/downloads/)
- **Mac:** `brew install python@3.11`
- **Linux:** `sudo apt install python3.11`

### Step 2: Install Poetry (Recommended)

Poetry makes dependency management easy:

```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Or on Windows (PowerShell)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

### Step 3: Install Aether

```bash
# Navigate to the aether directory
cd aether

# Install dependencies
poetry install

# Activate the environment
poetry shell

# Verify installation
aether --help
```

---

## First-Time Setup

### Choose Your AI Provider

Aether needs an AI brain to understand your files. Choose one:

#### Option A: Ollama (Recommended for Beginners)

**Pros:** Free, private, runs on your computer
**Cons:** Requires some disk space and RAM

```bash
# 1. Install Ollama from https://ollama.ai
# 2. Pull a model
ollama pull llama2

# 3. Test it
ollama run llama2 "Hello!"
```

Aether will automatically use Ollama by default!

#### Option B: OpenAI

**Pros:** Very accurate, no local setup
**Cons:** Costs money (but very cheap for personal use)

```bash
# 1. Get API key from https://platform.openai.com/api-keys
# 2. Set environment variable
export AETHER_OPENAI_API_KEY="sk-proj-..."
export AETHER_AI_PROVIDER="openai"

# Or create a .env file (see .env.example)
```

### Verify Setup

```bash
# Check configuration
aether config

# You should see your AI provider and other settings
```

---

## Your First Organization

Let's organize a folder! We'll use a test folder as an example.

### Step 1: Create a Test Folder

```bash
# Create a test directory with some files
mkdir ~/aether_test
cd ~/aether_test

# Create some example files
echo "Hello World" > document.txt
echo "# My Notes" > notes.md
echo "print('hello')" > script.py
```

### Step 2: Scan

```bash
# Scan the folder
aether scan ~/aether_test

# You should see a beautiful table showing your files!
```

**What happened?**
- Aether found all your files
- Calculated file hashes
- Detected file types
- Saved everything to a database

### Step 3: Think

```bash
# Let AI categorize your files
aether think

# Wait a moment while the AI thinks...
# You'll see a preview of suggested categories!
```

**What happened?**
- AI read each file
- Understood the content
- Suggested perfect categories
- Saved categories to the database

### Step 4: Preview Organization

```bash
# See what would happen (dry-run)
aether organize --dry-run

# You'll see a beautiful tree showing the new structure!
```

**This is safe!** Nothing is moved yet. It's just a preview.

### Step 5: Organize!

```bash
# Actually organize the files
aether organize --execute

# Confirm when prompted, or use --force to skip
```

**What happened?**
- Files moved to organized folders
- Undo information saved
- Beautiful summary displayed

### Step 6: Search

```bash
# Find files with natural language
aether find "python"
aether find "notes"

# Try searching for content!
```

---

## Common Use Cases

### Use Case 1: Clean Your Downloads Folder

```bash
# Scan Downloads
aether scan ~/Downloads

# Categorize
aether think

# Preview
aether organize --dry-run

# Execute
aether organize --execute
```

**Result:** Your Downloads folder now has organized subfolders!

### Use Case 2: Organize Work Documents

```bash
# Scan your Documents folder
aether scan ~/Documents/Work

# Let AI create smart categories
aether think

# Organize by project, client, or type
aether organize --execute
```

### Use Case 3: Find Lost Files

```bash
# You know what you're looking for, but not where it is
aether find "tax forms 2024"
aether find "project proposal client name"
aether find "vacation photos italy"

# Aether searches by content, not just filename!
```

### Use Case 4: Detect Duplicates

```bash
# Find duplicate files
aether stats

# Look for files with the same hash
# (Feature coming soon: aether duplicates)
```

---

## Troubleshooting

### Problem: "Command not found: aether"

**Solution:**
```bash
# Make sure you're in the Poetry environment
poetry shell

# Or run with poetry
poetry run aether --help
```

### Problem: "AI not available"

**Solution:**
```bash
# If using Ollama, make sure it's running
ollama list

# Test Ollama
ollama run llama2 "test"

# If using OpenAI, check your API key
echo $AETHER_OPENAI_API_KEY
```

### Problem: "No files in database"

**Solution:**
```bash
# You need to scan first!
aether scan ~/your-directory

# Then think
aether think

# Then organize
aether organize --execute
```

### Problem: "Permission denied"

**Solution:**
```bash
# Some folders require admin permissions
# Try a different folder, or run with appropriate permissions

# On Windows (PowerShell as Admin)
# On Mac/Linux (avoid using sudo with Aether)
```

### Problem: "Files not organized correctly"

**Solution:**
```bash
# Don't worry! You can undo
aether undo

# This restores everything to how it was
```

---

## Next Steps

Now that you're set up:

1. ⭐ **Star the repo** if you like Aether!
2. 📖 **Read the full [README.md](../README.md)** for advanced features
3. 🎨 **Customize** your [config](.env.example)
4. 🤝 **Contribute** if you want to make Aether better!

---

## Getting Help

- 📧 Email: support@aether-ai.dev
- 🐛 [Report issues](https://github.com/yourusername/aether/issues)
- 💬 [Ask questions](https://github.com/yourusername/aether/discussions)

**Happy organizing!** ✨
