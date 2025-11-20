from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
from contextlib import asynccontextmanager

from core.scanner import FileScanner
from core.extractor import TextExtractor
from core.embeddings import EmbeddingEngine
from core.thinker import AIThinker
from core.organizer import FileOrganizer
from database.models import init_db
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup"""
    # Initialize database
    init_db()
    
    # Initialize AI services
    app.state.embedding_engine = EmbeddingEngine()
    app.state.ai_thinker = AIThinker()
    app.state.organizer = FileOrganizer()
    
    print("LUMINA Backend initialized successfully")
    yield
    
    # Cleanup
    print("LUMINA Backend shutting down")


app = FastAPI(
    title="LUMINA API",
    description="AI That Organizes Your Entire Digital Life",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware - configured for Electron
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Electron compatibility
    allow_credentials=False,  # Must be False when allow_origins is "*"
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Request/Response Models
class FileItem(BaseModel):
    id: str
    name: str
    path: str
    type: str
    size: int
    content: Optional[str] = None
    extractedText: Optional[str] = None


class AnalyzeRequest(BaseModel):
    files: List[FileItem]


class AnalyzeResponse(BaseModel):
    collection_id: str
    organized_structure: Dict[str, Any]
    total_files: int
    categories: List[str]


class SearchRequest(BaseModel):
    query: str
    limit: int = 10


class SearchResponse(BaseModel):
    results: List[FileItem]


class SettingsRequest(BaseModel):
    ai_provider: str


class SettingsResponse(BaseModel):
    ai_provider: str
    gemini_api_key: str


@app.get("/")
async def root():
    return {
        "message": "LUMINA API - AI That Organizes Your Entire Digital Life",
        "version": "1.0.0",
        "status": "operational",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "lumina-api"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_files(request: AnalyzeRequest):
    """
    Main endpoint: Analyze files and create organized structure
    """
    try:
        if not request.files:
            raise HTTPException(status_code=400, detail="No files provided")

        # Convert to dict format
        files_data = [file.model_dump() for file in request.files]

        # Step 1: Generate embeddings for files
        embedding_engine = app.state.embedding_engine
        files_with_embeddings = await embedding_engine.generate_embeddings(files_data)

        # Step 2: Use AI to create intelligent organization structure
        ai_thinker = app.state.ai_thinker
        organized_structure = await ai_thinker.organize_files(files_with_embeddings)

        # Step 3: Save to database and vector store
        organizer = app.state.organizer
        collection_id = await organizer.save_collection(
            files_with_embeddings, organized_structure
        )

        # Get categories
        categories = list(organized_structure.keys())

        return AnalyzeResponse(
            collection_id=collection_id,
            organized_structure=organized_structure,
            total_files=len(request.files),
            categories=categories,
        )

    except Exception as e:
        print(f"Error in analyze_files: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/search", response_model=SearchResponse)
async def search_files(query: str, limit: int = 10):
    """
    Semantic search across all collections
    """
    try:
        organizer = app.state.organizer
        results = await organizer.semantic_search(query, limit)

        return SearchResponse(results=results)

    except Exception as e:
        print(f"Error in search_files: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/collections/{collection_id}")
async def get_collection(collection_id: str):
    """
    Retrieve a specific collection
    """
    try:
        organizer = app.state.organizer
        collection = await organizer.get_collection(collection_id)

        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")

        return collection

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_collection: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/collections")
async def get_all_collections():
    """
    Get all collections
    """
    try:
        organizer = app.state.organizer
        collections = await organizer.get_all_collections()

        return {"collections": collections}

    except Exception as e:
        print(f"Error in get_all_collections: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/settings", response_model=SettingsResponse)
async def get_settings():
    """
    Get current AI provider settings
    """
    return SettingsResponse(
        ai_provider=settings.AI_PROVIDER,
        gemini_api_key="configured" if settings.GEMINI_API_KEY else ""
    )


@app.post("/api/settings")
async def update_settings(request: SettingsRequest):
    """
    Update AI provider settings (switches between Ollama and Gemini)
    """
    try:
        from pathlib import Path
        
        # Validate provider
        if request.ai_provider not in ["ollama", "gemini"]:
            raise HTTPException(status_code=400, detail="Invalid AI provider. Must be 'ollama' or 'gemini'")
        
        # If switching to Gemini, check if API key is configured
        if request.ai_provider == "gemini" and not settings.GEMINI_API_KEY:
            raise HTTPException(
                status_code=400, 
                detail="GEMINI_API_KEY not configured in .env file. Please add it before switching to Gemini."
            )
        
        # Update settings in memory
        settings.AI_PROVIDER = request.ai_provider
        
        # Save to .env file
        env_path = Path(__file__).parent / ".env"
        env_lines = []
        
        # Read existing .env if it exists
        if env_path.exists():
            with open(env_path, 'r') as f:
                env_lines = f.readlines()
        
        # Update AI_PROVIDER
        updated_provider = False
        for i, line in enumerate(env_lines):
            if line.startswith('AI_PROVIDER='):
                env_lines[i] = f'AI_PROVIDER={request.ai_provider}\n'
                updated_provider = True
                break
        
        # Add if not found
        if not updated_provider:
            env_lines.append(f'AI_PROVIDER={request.ai_provider}\n')
        
        # Write back to .env
        with open(env_path, 'w') as f:
            f.writelines(env_lines)
        
        # Reinitialize AI services with new settings
        app.state.embedding_engine = EmbeddingEngine()
        app.state.ai_thinker = AIThinker()
        
        return {"status": "success", "message": f"Switched to {request.ai_provider.upper()} successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating settings: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info",
    )
