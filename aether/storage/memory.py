"""
🧠 Vector Memory
================

Smart semantic search using embeddings.
Find files based on meaning, not just keywords!
"""

from pathlib import Path
from typing import Optional, List
import json

from ..config import get_config


class VectorMemory:
    """
    Vector database for semantic search.
    
    Uses embeddings to understand the *meaning* of file content,
    allowing smart searches like "machine learning papers" even if
    those exact words don't appear in the filename!
    
    This is optional - Aether works fine without it, but it makes
    search much smarter.
    """
    
    def __init__(self, persist_directory: Optional[Path] = None):
        """
        Initialize vector memory.
        
        Args:
            persist_directory: Where to store vector data.
                              If None, uses path from config.
        """
        config = get_config()
        self.persist_directory = persist_directory or config.vector_db_path
        
        # Try to initialize ChromaDB
        self.available = False
        try:
            import chromadb
            from chromadb.config import Settings
            
            self.client = chromadb.Client(
                Settings(
                    persist_directory=str(self.persist_directory),
                    anonymized_telemetry=False,
                )
            )
            
            # Get or create collection
            self.collection = self.client.get_or_create_collection(
                name="aether_files",
                metadata={"description": "Aether file embeddings"},
            )
            
            self.available = True
        
        except ImportError:
            self.error = "ChromaDB not installed - vector search unavailable"
        except Exception as e:
            self.error = f"ChromaDB initialization failed: {str(e)}"
    
    def add_file(
        self,
        file_id: str,
        content: str,
        metadata: Optional[dict] = None,
    ) -> bool:
        """
        Add a file to the vector database.
        
        Args:
            file_id: Unique identifier for the file
            content: Text content to embed
            metadata: Optional metadata (filename, category, etc.)
            
        Returns:
            True if successful, False otherwise
        """
        if not self.available:
            return False
        
        try:
            # Add to collection
            self.collection.add(
                ids=[file_id],
                documents=[content],
                metadatas=[metadata] if metadata else None,
            )
            return True
        
        except Exception:
            return False
    
    def search(
        self,
        query: str,
        limit: int = 10,
        filter_metadata: Optional[dict] = None,
    ) -> List[dict]:
        """
        Search for files using semantic similarity.
        
        Args:
            query: Natural language search query
            limit: Maximum results to return
            filter_metadata: Optional metadata filters
            
        Returns:
            List of results with IDs, distances, and metadata
        """
        if not self.available:
            return []
        
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=limit,
                where=filter_metadata,
            )
            
            # Format results
            formatted_results = []
            
            if results["ids"] and results["ids"][0]:
                for i, file_id in enumerate(results["ids"][0]):
                    result = {
                        "id": file_id,
                        "distance": results["distances"][0][i],
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else None,
                    }
                    formatted_results.append(result)
            
            return formatted_results
        
        except Exception:
            return []
    
    def delete_file(self, file_id: str) -> bool:
        """
        Remove a file from the vector database.
        
        Args:
            file_id: ID of the file to remove
            
        Returns:
            True if successful, False otherwise
        """
        if not self.available:
            return False
        
        try:
            self.collection.delete(ids=[file_id])
            return True
        except Exception:
            return False
    
    def clear_all(self) -> bool:
        """
        Clear all vectors from the database.
        
        ⚠️ Use with caution!
        
        Returns:
            True if successful, False otherwise
        """
        if not self.available:
            return False
        
        try:
            # Delete and recreate collection
            self.client.delete_collection(name="aether_files")
            self.collection = self.client.create_collection(
                name="aether_files",
                metadata={"description": "Aether file embeddings"},
            )
            return True
        except Exception:
            return False
    
    def get_count(self) -> int:
        """
        Get the number of vectors stored.
        
        Returns:
            Number of file vectors
        """
        if not self.available:
            return 0
        
        try:
            return self.collection.count()
        except Exception:
            return 0


# Global instance
_vector_memory: Optional[VectorMemory] = None


def get_vector_memory() -> VectorMemory:
    """
    Get the global vector memory instance.
    
    Returns:
        VectorMemory instance
    """
    global _vector_memory
    if _vector_memory is None:
        _vector_memory = VectorMemory()
    return _vector_memory
