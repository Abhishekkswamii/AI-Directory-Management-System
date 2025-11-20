# 🏗️ LUMINA Architecture

## System Overview

LUMINA is a full-stack AI-powered file organization system built with modern web technologies. The architecture follows a client-server model with AI processing capabilities.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (Client)                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ Landing  │→ │Workspace │→ │ Preview  │           │  │
│  │  │   Page   │  │   Page   │  │   Page   │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │      File Processor (Client-Side)               │  │  │
│  │  │  • PDF.js   • Mammoth.js   • Tesseract.js      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         Zustand State Management                │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕ HTTP/REST                        │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (Server)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  API Endpoints                        │  │
│  │  /api/analyze  /api/search  /api/collections         │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                Core Modules                           │  │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐            │  │
│  │  │ Scanner │→ │Extractor │→ │Embeddings│            │  │
│  │  └─────────┘  └──────────┘  └──────────┘            │  │
│  │                     ↓                                 │  │
│  │  ┌────────────────────────────────────┐              │  │
│  │  │      AI Thinker (Brain)            │              │  │
│  │  │  • Analyzes files                  │              │  │
│  │  │  • Creates 3-level hierarchy       │              │  │
│  │  │  • Uses Ollama or Gemini           │              │  │
│  │  └────────────────────────────────────┘              │  │
│  │                     ↓                                 │  │
│  │  ┌────────────────────────────────────┐              │  │
│  │  │         Organizer                  │              │  │
│  │  │  • Saves to SQLite                 │              │  │
│  │  │  • Manages ChromaDB vectors        │              │  │
│  │  └────────────────────────────────────┘              │  │
│  └───────────────────────────────────────────────────────┘  │
│                   ↓              ↓                          │
│  ┌──────────────────┐  ┌────────────────────────┐          │
│  │ SQLite Database  │  │  ChromaDB (Vectors)    │          │
│  │  • Collections   │  │  • Embeddings          │          │
│  │  • File records  │  │  • Semantic search     │          │
│  └──────────────────┘  └────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                     AI Services                             │
│  ┌──────────────────┐        ┌──────────────────┐          │
│  │ Ollama (Local)   │   OR   │  Gemini (Cloud)  │          │
│  │  • llama3.2      │        │  • gemini-pro    │          │
│  │  • nomic-embed   │        │  • embedding-001 │          │
│  └──────────────────┘        └──────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Components

```
App (Router)
│
├── CosmicBackground (Global)
├── CustomCursor (Global)
│
└── Routes
    ├── LandingPage
    │   ├── Animated gradients
    │   └── OrbButton
    │
    ├── WorkspacePage
    │   ├── OrbitalMenu
    │   ├── GlassCard (upload)
    │   └── FileProcessor
    │
    ├── PreviewPage
    │   ├── OrbitalMenu
    │   ├── Category rings
    │   └── File tree
    │
    ├── SuccessPage
    │   ├── Particle effects
    │   └── Download options
    │
    ├── SearchPage
    │   ├── OrbitalMenu
    │   └── Search results
    │
    ├── CollectionsPage
    │   ├── OrbitalMenu
    │   └── Collection grid
    │
    └── SettingsPage
        ├── OrbitalMenu
        └── AI configuration
```

---

## Data Flow

### 1. File Upload & Analysis Flow

```
User selects folder
      ↓
File System Access API
      ↓
Client-side file reading
      ↓
Text extraction (PDF.js, Mammoth.js, Tesseract.js)
      ↓
POST /api/analyze
      ↓
Backend receives files with extracted text
      ↓
Generate embeddings (Ollama/Gemini)
      ↓
AI Thinker creates organization structure
      ↓
Save to SQLite + ChromaDB
      ↓
Return organized structure
      ↓
Display preview in orbital rings
      ↓
User confirms
      ↓
Download ZIP or write to file system
```

### 2. Semantic Search Flow

```
User enters query
      ↓
POST /api/search
      ↓
Generate query embedding
      ↓
ChromaDB vector similarity search
      ↓
Retrieve matching files
      ↓
Return results with scores
      ↓
Display in search UI
```

### 3. Collection Management Flow

```
User views collections
      ↓
GET /api/collections
      ↓
Retrieve from SQLite
      ↓
Return collection metadata
      ↓
Display in grid view
      ↓
User selects collection
      ↓
GET /api/collections/{id}
      ↓
Return full structure
      ↓
Display organized files
```

---

## Database Schema

### SQLite Tables

#### `collections` Table
```sql
CREATE TABLE collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id TEXT UNIQUE NOT NULL,
    total_files INTEGER,
    organized_structure TEXT,  -- JSON
    categories TEXT,            -- JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `file_records` Table
```sql
CREATE TABLE file_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id TEXT NOT NULL,
    collection_id TEXT NOT NULL,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    type TEXT,
    size INTEGER,
    extracted_text TEXT,
    category TEXT,
    subcategory TEXT,
    folder TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections(collection_id)
);
```

### ChromaDB Collections

**Collection Name:** `lumina_files`

**Structure:**
- **Documents**: File name + text preview (first 500 chars)
- **Embeddings**: Vector representations (768 or 1536 dimensions)
- **Metadata**:
  ```json
  {
    "collection_id": "uuid",
    "file_id": "uuid",
    "name": "document.pdf",
    "type": "pdf",
    "path": "work/documents/document.pdf"
  }
  ```

---

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Analyze and organize files |
| GET | `/api/search` | Semantic search |
| GET | `/api/collections` | List all collections |
| GET | `/api/collections/{id}` | Get specific collection |

### Request/Response Examples

#### POST /api/analyze

**Request:**
```json
{
  "files": [
    {
      "id": "abc123",
      "name": "report.pdf",
      "path": "work/report.pdf",
      "type": "pdf",
      "size": 102400,
      "extractedText": "This is a quarterly report..."
    }
  ]
}
```

**Response:**
```json
{
  "collection_id": "uuid-here",
  "organized_structure": {
    "Work": {
      "Reports": {
        "Quarterly Reports": [
          {
            "id": "abc123",
            "name": "report.pdf",
            "type": "pdf",
            "size": 102400
          }
        ]
      }
    }
  },
  "total_files": 1,
  "categories": ["Work"]
}
```

---

## AI Integration

### AI Provider: Ollama (Local)

**Configuration:**
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

**Process:**
1. Text analysis via llama3.2
2. Category generation with structured prompts
3. Embedding generation via nomic-embed-text
4. Store in ChromaDB

### AI Provider: Gemini (Cloud)

**Configuration:**
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-pro
GEMINI_EMBEDDING_MODEL=models/embedding-001
```

**Process:**
1. Text analysis via Gemini API
2. Category generation with prompts
3. Embedding generation via Gemini embeddings
4. Store in ChromaDB

### AI Thinker Logic

```python
async def organize_files(files: List[FileItem]) -> OrganizedStructure:
    # 1. Generate embeddings for all files
    embeddings = await generate_embeddings(files)
    
    # 2. Create AI prompt with file summaries
    prompt = f"""
    Analyze these {len(files)} files and create a 3-level hierarchy:
    - Level 1: Main categories (Work, Personal, etc.)
    - Level 2: Subcategories (Documents, Photos, etc.)
    - Level 3: Specific folders (Reports, Receipts, etc.)
    
    Rules:
    - NO "Miscellaneous" or "Other" folders
    - Every file must have a meaningful category
    - Use file content, not just names
    """
    
    # 3. Get structure from AI
    structure = await ai_provider.generate(prompt)
    
    # 4. Map files to structure
    organized = map_files_to_structure(files, structure)
    
    # 5. Save to databases
    await save_to_sqlite(organized)
    await save_to_chromadb(files, embeddings)
    
    return organized
```

---

## State Management (Zustand)

```typescript
interface AppState {
  // Files
  files: FileItem[]
  setFiles: (files: FileItem[]) => void
  
  // Processing
  isProcessing: boolean
  processingMessage: string
  progress: number
  setProgress: (progress: number) => void
  
  // Organization
  organizedStructure: OrganizedStructure | null
  collectionId: string | null
  
  // UI
  currentView: 'landing' | 'workspace' | 'preview' | 'success'
  
  // Actions
  reset: () => void
  setOrganizedStructure: (structure: OrganizedStructure) => void
}
```

---

## Security Architecture

### Client-Side Security
- File processing happens in browser (privacy)
- No file upload to server (only metadata + text)
- HTTPS in production
- Input sanitization

### Server-Side Security
- CORS configuration
- Environment variable protection
- API rate limiting (configurable)
- File size limits
- SQL injection prevention (SQLModel ORM)

### Data Protection
- `.env` files in `.gitignore`
- API keys never exposed
- Database files excluded from git
- No sensitive data in logs

---

## Performance Optimizations

### Frontend
1. **Lazy Loading** - Components load on demand
2. **Memoization** - React.memo for expensive components
3. **Virtual Scrolling** - For large file lists
4. **Debounced Search** - Reduce API calls
5. **Client-side Processing** - Offload from server

### Backend
1. **Async Operations** - Non-blocking I/O
2. **Batch Processing** - Process 100 embeddings at once
3. **Connection Pooling** - Database optimization
4. **Caching** - ChromaDB caches embeddings
5. **Lazy Loading** - Load collections on demand

### Database
1. **Indexes** - On collection_id, file_id
2. **Vector Indexing** - ChromaDB HNSW algorithm
3. **Pagination** - Limit query results
4. **Prepared Statements** - SQLModel ORM

---

## Deployment Architecture

### Development
```
localhost:5173 (Frontend - Vite)
     ↓
localhost:8000 (Backend - Uvicorn)
     ↓
localhost:11434 (Ollama - Optional)
```

### Production
```
Vercel CDN (Frontend)
     ↓
Railway/Cloud (Backend)
     ↓
Ollama Service / Gemini API
```

---

## File Processing Pipeline

### Supported File Types

| Type | Library | Extraction |
|------|---------|------------|
| PDF | PDF.js | Full text + metadata |
| Word | Mammoth.js | Text content |
| Excel | SheetJS | Cell data |
| Images | Tesseract.js | OCR text |
| Code | Native | Raw content |
| Text | Native | Raw content |

### Processing Flow

```typescript
async function processFile(file: File): Promise<FileItem> {
  let extractedText = ''
  
  switch (file.type) {
    case 'application/pdf':
      extractedText = await extractPdfText(file)
      break
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      extractedText = await extractWordText(file)
      break
    case 'image/png':
    case 'image/jpeg':
      extractedText = await extractImageText(file)
      break
    default:
      extractedText = await file.text()
  }
  
  return {
    id: generateId(),
    name: file.name,
    type: getFileExtension(file.name),
    size: file.size,
    extractedText: extractedText.slice(0, 10000) // Limit size
  }
}
```

---

## Scalability Considerations

### Current Limits
- Files per batch: 10,000
- File size: 50MB per file
- Concurrent requests: Based on server
- Database: SQLite (suitable for single-user)

### Scaling Options

#### Horizontal Scaling
- Multiple backend instances
- Load balancer
- Distributed ChromaDB

#### Vertical Scaling
- Increase server resources
- More memory for embeddings
- Faster CPUs for AI processing

#### Database Scaling
- PostgreSQL for multi-user
- Separate vector database server
- Redis for caching

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| Framer Motion | 11.x | Animations |
| Zustand | 4.x | State management |
| Axios | 1.x | HTTP client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Runtime |
| FastAPI | 0.104+ | Web framework |
| SQLModel | 0.0.14+ | ORM |
| ChromaDB | 0.4.x | Vector DB |
| Uvicorn | 0.24+ | ASGI server |

### AI
| Technology | Version | Purpose |
|------------|---------|---------|
| Ollama | Latest | Local AI |
| Gemini API | Latest | Cloud AI |

---

## Error Handling

### Frontend
```typescript
try {
  const result = await api.analyzeFiles(files)
  setOrganizedStructure(result)
} catch (error) {
  if (error.response?.status === 500) {
    showError('Server error. Please try again.')
  } else if (error.response?.status === 400) {
    showError('Invalid files. Please check and retry.')
  } else {
    showError('Connection error. Check your internet.')
  }
}
```

### Backend
```python
@app.post("/api/analyze")
async def analyze_files(request: AnalyzeRequest):
    try:
        # Process files
        result = await organizer.organize(request.files)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail="Internal error")
```

---

## Testing Strategy

### Frontend Testing
- Unit tests: Vitest
- Component tests: React Testing Library
- E2E tests: Playwright (optional)

### Backend Testing
- Unit tests: pytest
- API tests: FastAPI TestClient
- Integration tests: Test database

---

## Monitoring & Logging

### Backend Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
```

### Metrics to Track
- File processing time
- AI response time
- Database query time
- API response time
- Error rates

---

## Future Architecture Enhancements

1. **WebSocket Support** - Real-time progress updates
2. **Background Jobs** - Celery for long-running tasks
3. **Caching Layer** - Redis for frequently accessed data
4. **Microservices** - Separate AI service
5. **Multi-tenancy** - User authentication & isolation
6. **CDN Integration** - CloudFlare for assets
7. **Analytics** - Track usage patterns
8. **Mobile Apps** - React Native clients

---

**LUMINA Architecture** is designed to be scalable, maintainable, and extensible while providing a seamless user experience. 🌟
