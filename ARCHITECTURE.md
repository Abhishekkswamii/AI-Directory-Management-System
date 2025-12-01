# 🏗️ LUMINA Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    React Frontend                       │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │    │
│  │  │  Landing   │  │  Workspace │  │  Preview   │         │    │
│  │  │   Page     │→ │    Page    │→ │    Page    │         │    │
│  │  └────────────┘  └────────────┘  └────────────┘         │    │
│  │         ↓                ↓                ↓             │    │
│  │  ┌────────────────────────────────────────────────┐     │    │
│  │  │         File Processor (Client-Side)           │     │    │
│  │  │  • PDF.js     • Mammoth.js    • Tesseract.js  │      │    │
│  │  └────────────────────────────────────────────────┘     │    │
│  │         ↓                                                │  │
│  │  ┌────────────────────────────────────────────────┐     │  │
│  │  │              Zustand Store                     │     │  │
│  │  │  • Files     • Processing     • Structure     │     │  │
│  │  └────────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↕ HTTP/REST                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   API Endpoints                           │  │
│  │  /api/analyze  /api/search  /api/collections            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Core Modules                            │  │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────┐             │  │
│  │  │ Scanner  │→ │ Extractor │→ │Embeddings│             │  │
│  │  └──────────┘  └───────────┘  └──────────┘             │  │
│  │                      ↓                                    │  │
│  │  ┌──────────────────────────────────────┐               │  │
│  │  │        AI Thinker (Brain)            │               │  │
│  │  │  • Analyzes files                    │               │  │
│  │  │  • Creates 3-level hierarchy         │               │  │
│  │  │  • No "Misc" folders                 │               │  │
│  │  └──────────────────────────────────────┘               │  │
│  │                      ↓                                    │  │
│  │  ┌──────────────────────────────────────┐               │  │
│  │  │          Organizer                   │               │  │
│  │  │  • Saves to database                 │               │  │
│  │  │  • Manages vector store              │               │  │
│  │  └──────────────────────────────────────┘               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                    ↓                    ↓                        │
│  ┌─────────────────────┐  ┌──────────────────────────┐         │
│  │   SQLite Database   │  │    ChromaDB (Vectors)    │         │
│  │  • Collections      │  │  • Embeddings            │         │
│  │  • File records     │  │  • Semantic search       │         │
│  └─────────────────────┘  └──────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AI Services                                 │
│  ┌──────────────────────┐        ┌──────────────────────┐       │
│  │   OpenAI API         │   OR   │   Ollama (Local)     │       │
│  │  • GPT-4o            │        │  • llama3.2          │       │
│  │  • text-embed-3-large│        │  • nomic-embed-text  │       │
│  └──────────────────────┘        └──────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. File Upload Flow

```
User selects folder
       ↓
File System Access API / webkitdirectory
       ↓
Client-side processing (PDF.js, Mammoth.js, etc.)
       ↓
Extract text from each file
       ↓
Send to backend: POST /api/analyze
       ↓
Backend generates embeddings
       ↓
AI Thinker creates organization structure
       ↓
Save to SQLite + ChromaDB
       ↓
Return organized structure to client
       ↓
Display preview with orbital rings
```

### 2. AI Organization Flow

```
Receive files with extracted text
       ↓
Generate embeddings for each file
       ↓
Analyze file types and content
       ↓
LLM prompt: "Create 3-level structure"
       ↓
GPT-4o/Ollama generates categories
       ↓
Map files to structure intelligently
       ↓
Ensure no "Misc" folders
       ↓
Return JSON hierarchy
```

### 3. Search Flow

```
User enters search query
       ↓
Generate query embedding
       ↓
ChromaDB vector similarity search
       ↓
Retrieve matching files
       ↓
Return results to client
       ↓
Display in search results
```

---

## Component Hierarchy

```
App
├── CosmicBackground (global)
├── CustomCursor (global)
└── Router
    ├── LandingPage
    │   ├── Animated gradients
    │   ├── Glowing text
    │   └── OrbButton
    │
    ├── WorkspacePage
    │   ├── OrbitalMenu
    │   ├── GlassCard (upload area)
    │   ├── OrbButton (actions)
    │   └── Processing overlay
    │
    ├── PreviewPage
    │   ├── OrbitalMenu
    │   ├── Category rings (animated)
    │   ├── File tree preview
    │   └── OrbButton (make it real)
    │
    ├── SuccessPage
    │   ├── Particle explosion
    │   ├── Stats cards (GlassCard)
    │   └── OrbButton (download/restart)
    │
    ├── SearchPage
    │   ├── OrbitalMenu
    │   ├── Search bar (GlassCard)
    │   └── Results list
    │
    ├── CollectionsPage
    │   ├── OrbitalMenu
    │   └── Collection grid (GlassCard)
    │
    └── SettingsPage
        ├── OrbitalMenu
        └── Settings sections (GlassCard)
```

---

## Database Schema

### SQLite Tables

**collections**
```sql
CREATE TABLE collections (
    id INTEGER PRIMARY KEY,
    collection_id TEXT UNIQUE,
    total_files INTEGER,
    organized_structure TEXT,  -- JSON
    categories TEXT,            -- JSON array
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**file_records**
```sql
CREATE TABLE file_records (
    id INTEGER PRIMARY KEY,
    file_id TEXT,
    collection_id TEXT,
    name TEXT,
    path TEXT,
    type TEXT,
    size INTEGER,
    extracted_text TEXT,
    category TEXT,
    subcategory TEXT,
    folder TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections(collection_id)
);
```

### ChromaDB Collections

**lumina_files**
- Vector embeddings (1536 or 768 dimensions)
- Metadata: collection_id, file_id, name, type
- Documents: file name + text preview

---

## API Request/Response Flow

### POST /api/analyze

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
      "extractedText": "This is a report about..."
    }
  ]
}
```

**Processing:**
1. Generate embeddings for each file
2. Analyze file types and content
3. Create prompt for LLM with file summaries
4. Get organization structure from AI
5. Map files to structure
6. Save to database and vector store
7. Return result

**Response:**
```json
{
  "collection_id": "uuid-here",
  "organized_structure": {
    "Work": {
      "Reports": {
        "Q4 Reports": [
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

## State Management (Zustand)

```typescript
interface AppState {
  // Files
  files: FileItem[]
  
  // Processing
  isProcessing: boolean
  processingMessage: string
  progress: number
  
  // Organization
  organizedStructure: OrganizedStructure | null
  collectionId: string | null
  
  // Actions
  setFiles: (files: FileItem[]) => void
  setProgress: (progress: number) => void
  reset: () => void
}
```

---

## Animation System

### Framer Motion Variants

**Page transitions:**
```typescript
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -20 }
```

**Hover effects:**
```typescript
whileHover: { scale: 1.05, y: -5 }
whileTap: { scale: 0.95 }
```

**Orbital motion:**
```typescript
animate: {
  rotate: 360,
  x: [0, radius * cos, 0, -radius * cos, 0],
  y: [0, -radius * sin, 0, radius * sin, 0]
}
```

---

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────┐
│           Vercel (Frontend)             │
│  • CDN edge locations                   │
│  • Automatic HTTPS                      │
│  • Environment variables                │
└─────────────────────────────────────────┘
              ↓ API calls
┌─────────────────────────────────────────┐
│          Railway (Backend)              │
│  • FastAPI server                       │
│  • PostgreSQL (optional)                │
│  • Environment variables                │
│  • Automatic deployments                │
└─────────────────────────────────────────┘
              ↓ AI requests
┌─────────────────────────────────────────┐
│          OpenAI API / Ollama            │
│  • GPT-4o                               │
│  • Embeddings                           │
└─────────────────────────────────────────┘
```

---

## Performance Optimizations

1. **Client-side processing** - Reduces server load
2. **Batch embeddings** - Process 100 files at a time
3. **Lazy loading** - Components load on demand
4. **Memoization** - Prevent unnecessary re-renders
5. **Vector search** - Fast semantic queries
6. **Async operations** - Non-blocking I/O
7. **CDN caching** - Static assets cached globally

---

## Security Considerations

1. **API keys** - Stored in environment variables
2. **CORS** - Configured for specific origins
3. **File validation** - Type and size checks
4. **Rate limiting** - Prevent abuse
5. **Input sanitization** - Clean all user input
6. **HTTPS only** - In production
7. **No sensitive data** - Files processed client-side

---

## Scalability

### Current Limits
- Files per batch: 10,000
- File size: 50MB per file
- Requests: 100/minute (configurable)

### Scale-up Options
1. **Horizontal**: Add more Railway servers
2. **Vertical**: Upgrade server resources
3. **Database**: PostgreSQL for larger datasets
4. **Cache**: Redis for frequent queries
5. **CDN**: CloudFlare for global distribution
6. **Queue**: Celery for background processing

---

## Technology Choices - Why?

| Technology | Why Chosen |
|------------|------------|
| React | Industry standard, huge ecosystem |
| TypeScript | Type safety, better DX |
| Vite | Lightning fast dev server |
| Tailwind | Rapid styling, consistency |
| Framer Motion | Best animation library |
| FastAPI | Modern Python, async, auto docs |
| SQLModel | Type-safe SQL with Pydantic |
| ChromaDB | Easy vector storage |
| OpenAI | Best LLMs and embeddings |
| Ollama | Local AI alternative |

---

This architecture enables LUMINA to be fast, scalable, maintainable, and absolutely beautiful. 🌟
