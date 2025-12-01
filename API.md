# 🔌 LUMINA API Documentation

Base URL: `http://localhost:8000`

## Overview

LUMINA's REST API provides endpoints for file analysis, organization, search, and collection management.

---

## Endpoints

### 1. Health Check

**GET** `/api/health`

Check if the API is operational.

**Response**
```json
{
  "status": "healthy",
  "service": "lumina-api"
}
```

---

### 2. Analyze Files

**POST** `/api/analyze`

Main endpoint to analyze and organize files using AI.

**Request Body**
```json
{
  "files": [
    {
      "id": "uuid-string",
      "name": "document.pdf",
      "path": "folder/document.pdf",
      "type": "pdf",
      "size": 102400,
      "extractedText": "This is the content..."
    }
  ]
}
```

**Response**
```json
{
  "collection_id": "uuid-string",
  "organized_structure": {
    "Work": {
      "Projects": {
        "Client Documents": [
          {
            "id": "file-id",
            "name": "document.pdf",
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

### 3. Semantic Search

**GET** `/api/search?query=<search_term>&limit=10`

Search across all collections using semantic understanding.

**Query Parameters**
- `query` (required): Search term
- `limit` (optional): Max results (default: 10)

**Response**
```json
{
  "results": [
    {
      "id": "file-id",
      "name": "document.pdf",
      "type": "pdf"
    }
  ]
}
```

---

### 4. Get Collection

**GET** `/api/collections/{collection_id}`

Retrieve a specific collection by ID.

**Response**
```json
{
  "collection_id": "uuid",
  "total_files": 100,
  "organized_structure": { ... },
  "categories": ["Work", "Personal"],
  "created_at": "2025-01-01T00:00:00"
}
```

---

### 5. Get All Collections

**GET** `/api/collections`

List all collections.

**Response**
```json
{
  "collections": [
    {
      "collection_id": "uuid",
      "total_files": 100,
      "categories": ["Work"],
      "created_at": "2025-01-01T00:00:00"
    }
  ]
}
```

---

## Data Models

### FileItem
```typescript
interface FileItem {
  id: string              // Unique identifier
  name: string            // Filename
  path: string            // Full path
  type: string            // File extension
  size: number            // Size in bytes
  content?: string        // Optional file content
  extractedText?: string  // Extracted text content
  category?: string       // Assigned category
  tags?: string[]         // Optional tags
  embedding?: number[]    // Vector embedding
}
```

### OrganizedStructure
```typescript
interface OrganizedStructure {
  [category: string]: {
    [subcategory: string]: {
      [folder: string]: FileItem[]
    }
  }
}
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format**
```json
{
  "detail": "Error message here"
}
```

---

## Rate Limiting

- No rate limiting in development
- Production: 100 requests/minute per IP

---

## Authentication

Currently no authentication required. For production:
- Add API key authentication
- Implement user-specific collections
- Add OAuth support

---

## Example Usage

### JavaScript/TypeScript

```typescript
import axios from 'axios'

const API_BASE = 'http://localhost:8000'

// Analyze files
async function analyzeFiles(files: FileItem[]) {
  const response = await axios.post(`${API_BASE}/api/analyze`, { files })
  return response.data
}

// Search
async function searchFiles(query: string) {
  const response = await axios.get(`${API_BASE}/api/search`, {
    params: { query, limit: 20 }
  })
  return response.data.results
}

// Get collection
async function getCollection(collectionId: string) {
  const response = await axios.get(
    `${API_BASE}/api/collections/${collectionId}`
  )
  return response.data
}
```

### Python

```python
import requests

API_BASE = "http://localhost:8000"

# Analyze files
def analyze_files(files):
    response = requests.post(f"{API_BASE}/api/analyze", json={"files": files})
    return response.json()

# Search
def search_files(query, limit=10):
    response = requests.get(
        f"{API_BASE}/api/search",
        params={"query": query, "limit": limit}
    )
    return response.json()["results"]
```

---

## WebSocket Support (Future)

Real-time progress updates coming soon:

```typescript
const ws = new WebSocket('ws://localhost:8000/ws/analyze')

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log(`Progress: ${data.progress}%`)
  console.log(`Message: ${data.message}`)
}
```

---

## OpenAPI/Swagger

Interactive API documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

---

## Support

For API issues or questions:
- GitHub Issues: [lumina/issues](https://github.com/yourusername/lumina/issues)
- Email: api@lumina.app
