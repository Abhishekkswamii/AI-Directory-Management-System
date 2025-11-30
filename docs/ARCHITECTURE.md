# 🏗️ Aether Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    👤 USER INTERACTION                      │
│                   (Command Line Interface)                   |
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    🎨 CLI LAYER (Typer)                      │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  scan    │  think   │ organize │   find   │   undo   │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               🧠 BRAIN LAYER (Intelligence)                 │ 
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Scanner  → Reader → Thinker → Organizer → Searcher  │   │
│  │    🔍        📖       🧠          🗂️          🔎       │  
│  └──────────────────────────────────────────────────────┘   │
│                                                              |
│  Scanner:   Discovers files, calculates hashes              │
│  Reader:    Extracts text from PDFs, docs, images           │
│  Thinker:   AI categorization (Ollama/OpenAI)               │
│  Organizer: Safely moves files with undo support            │
│  Searcher:  Natural language search                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              💾 STORAGE LAYER (Persistence)                 │
│  ┌─────────────────────┬───────────────────────────────┐    │
│  │   SQLite Database   │   ChromaDB (Vectors)          │   │
│  │   ┌──────────────┐  │   ┌─────────────────────┐    │   │
│  │   │ File Records │  │   │ Semantic Embeddings │    │   │
│  │   │ - Paths      │  │   │ - Content vectors   │    │   │
│  │   │ - Hashes     │  │   │ - Smart search      │    │   │
│  │   │ - Categories │  │   └─────────────────────┘    │   │
│  │   │ - Metadata   │  │                               │   │
│  │   └──────────────┘  │                               │   │
│  └─────────────────────┴───────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                 🎨 UI LAYER (Rich)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Progress Bars │ Tables │ Trees │ Panels │ Colors   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Scanning Flow

```
User Command: aether scan ~/Downloads
         ↓
    [CLI Parser]
         ↓
    [FileScanner]
         ↓
    Walk directory tree
    For each file:
         ↓
    ├── Get file stats (size, dates)
    ├── Calculate SHA-256 hash
    ├── Detect file type
    └── Create ScannedFile object
         ↓
    [Database]
         ↓
    Save FileRecord
         ↓
    [Rich UI]
         ↓
    Display beautiful table
```

### Thinking Flow

```
User Command: aether think
         ↓
    [CLI Parser]
         ↓
    [Database]
    Load all FileRecords
         ↓
    For each file:
         ↓
    [FileReader]
    Extract content
         ↓
    [AI Thinker]
         ↓
    Choose AI Provider
    ├── Ollama (local)
    └── OpenAI (cloud)
         ↓
    Send prompt:
    "Analyze this file and suggest category"
         ↓
    AI Response:
    {
      "category": "Tax Documents 2024",
      "confidence": 0.95,
      "reasoning": "Contains tax forms"
    }
         ↓
    [Database]
    Update FileRecord with category
         ↓
    [Rich UI]
    Show organization preview
```

### Organizing Flow

```
User Command: aether organize --execute
         ↓
    [CLI Parser]
         ↓
    [Database]
    Load categorized files
         ↓
    [FileOrganizer]
         ↓
    If dry_run:
         ├── Simulate organization
         ├── Build preview tree
         └── Display (no files moved)
         ↓
    If execute:
         ├── Create category folders
         ├── Resolve filename conflicts
         ├── Move/copy files
         ├── Save undo information
         └── Track all actions
         ↓
    [File System]
    Files moved to new locations
         ↓
    [Undo File]
    Save undo_TIMESTAMP.json
         ↓
    [Rich UI]
    Show success summary
```

### Search Flow

```
User Command: aether find "tax 2024"
         ↓
    [CLI Parser]
         ↓
    [SmartSearcher]
         ↓
    [Database]
    Load all FileRecords
         ↓
    For each file:
         ├── Score filename match
         ├── Score content match
         ├── Score category match
         └── Calculate total score
         ↓
    Sort by relevance
         ↓
    [Optional: Vector Search]
    Check ChromaDB for semantic matches
         ↓
    Combine results
         ↓
    [Rich UI]
    Display ranked results table
```

## Module Dependencies

```
main.py
  ├── config.py
  │     └── pydantic-settings
  ├── brain/
  │     ├── scanner.py
  │     │     └── utils.py
  │     ├── reader.py
  │     │     ├── PyPDF2
  │     │     ├── python-docx
  │     │     └── pytesseract
  │     ├── thinker.py
  │     │     ├── openai
  │     │     └── requests (Ollama)
  │     ├── organizer.py
  │     │     └── shutil
  │     └── searcher.py
  │           └── storage/database.py
  ├── storage/
  │     ├── database.py
  │     │     └── sqlmodel
  │     └── memory.py
  │           └── chromadb
  └── ui/
        └── beauty.py
              └── rich
```

## File Structure Details

```
aether/
├── aether/                      # Main package
│   ├── __init__.py             # Version, package info
│   ├── main.py                 # CLI entry point (Typer app)
│   ├── config.py               # Configuration management
│   ├── utils.py                # Helper functions
│   │
│   ├── brain/                  # Intelligence modules
│   │   ├── __init__.py
│   │   ├── scanner.py          # File discovery
│   │   │   └── FileScanner class
│   │   ├── reader.py           # Content extraction
│   │   │   └── FileReader class
│   │   ├── thinker.py          # AI categorization
│   │   │   └── AIThinker class
│   │   ├── organizer.py        # File organization
│   │   │   └── FileOrganizer class
│   │   └── searcher.py         # Smart search
│   │       └── SmartSearcher class
│   │
│   ├── storage/                # Data persistence
│   │   ├── __init__.py
│   │   ├── database.py         # SQLite operations
│   │   │   ├── FileRecord model
│   │   │   └── Database class
│   │   └── memory.py           # Vector storage
│   │       └── VectorMemory class
│   │
│   └── ui/                     # User interface
│       ├── __init__.py
│       └── beauty.py           # Rich console UI
│           └── print_* functions
│
├── tests/                      # Test suite
│   ├── __init__.py
│   └── test_basic.py
│
├── docs/                       # Documentation
│   ├── GETTING_STARTED.md
│   ├── FULL_EXPLANATION.md
│   └── ARCHITECTURE.md (this file)
│
├── pyproject.toml              # Project config & dependencies
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment config example
├── LICENSE                     # MIT License
└── README.md                   # Main documentation
```

## Key Design Patterns

### 1. **Singleton Pattern**
Used for global instances:
```python
_config: Optional[AetherConfig] = None

def get_config() -> AetherConfig:
    global _config
    if _config is None:
        _config = AetherConfig()
    return _config
```

### 2. **Factory Pattern**
AI provider selection:
```python
if provider == "ollama":
    return OllamaClient()
elif provider == "openai":
    return OpenAIClient()
```

### 3. **Iterator Pattern**
Efficient file scanning:
```python
def scan(self) -> Iterator[ScannedFile]:
    for file in directory:
        yield process_file(file)
```

### 4. **Command Pattern**
CLI commands as discrete operations:
```python
@app.command()
def scan(...): ...

@app.command()
def think(...): ...
```

## Database Schema

### FileRecord Table
```sql
CREATE TABLE files (
    id INTEGER PRIMARY KEY,
    filepath TEXT NOT NULL,      -- Full path to file
    filename TEXT NOT NULL,       -- Just filename
    file_hash TEXT,               -- SHA-256 hash
    extension TEXT,               -- .pdf, .jpg, etc.
    file_type TEXT,               -- pdf, image, code, etc.
    size_bytes INTEGER,
    content_preview TEXT,         -- First 200 chars
    has_readable_content BOOLEAN,
    category TEXT,                -- AI-suggested category
    subcategory TEXT,
    tags TEXT,                    -- JSON array
    ai_confidence REAL,           -- 0.0 to 1.0
    ai_reasoning TEXT,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    scanned_at TIMESTAMP
);

CREATE INDEX idx_filepath ON files(filepath);
CREATE INDEX idx_file_hash ON files(file_hash);
CREATE INDEX idx_category ON files(category);
```

## Configuration Flow

```
1. Default values in AetherConfig class
         ↓
2. Load from .env file (if exists)
         ↓
3. Load from environment variables
         ↓
4. User overrides via CLI flags
         ↓
5. get_config() returns merged config
```

## Error Handling Strategy

```python
try:
    # Attempt operation
    result = risky_operation()
except PermissionError:
    # Handle gracefully
    print_warning("Permission denied")
    continue
except Exception as e:
    # Log and continue
    print_error(f"Error: {str(e)}")
    if config.verbose:
        traceback.print_exc()
```

## Security Considerations

1. **File System Access**
   - Respects OS permissions
   - Never uses `sudo` or admin elevation
   - Graceful error handling

2. **Data Privacy**
   - SQLite database is local
   - No telemetry or tracking
   - Optional cloud AI (user's choice)

3. **File Integrity**
   - Never overwrites files
   - Hash-based duplicate detection
   - Undo support for all operations

## Performance Optimizations

1. **Lazy Loading**
   - Iterator pattern for scanning
   - Don't load all files into memory

2. **Batch Operations**
   - Database commits in batches
   - Bulk file operations

3. **Caching**
   - Config singleton
   - AI client reuse

4. **Size Limits**
   - Skip files > 100 MB by default
   - Truncate content previews

## Future Enhancements

Possible additions:
- 📊 Web dashboard (Flask/FastAPI)
- 🔄 Watch mode (auto-organize new files)
- 🌐 Cloud sync support
- 🖼️ Image thumbnail generation
- 📊 File analytics and insights
- 🤖 More AI provider options
- 📱 Mobile app
- 🎨 Custom themes

---

**This architecture is designed for:**
- ✨ Clean, maintainable code
- 🧪 Easy testing
- 🔧 Simple extension
- 📚 Learning-friendly structure
- 🎨 Beautiful user experience
