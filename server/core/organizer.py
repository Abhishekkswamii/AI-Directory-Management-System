"""
File Organizer - Manages collections, vector store, and persistence
"""
from typing import List, Dict, Any, Optional
import json
from datetime import datetime
import uuid

from database.models import Collection, FileRecord, get_session
from config import settings


class FileOrganizer:
    """Manages file organization, storage, and retrieval"""

    def __init__(self):
        # Initialize ChromaDB for vector storage
        try:
            import chromadb
            self.chroma_client = chromadb.PersistentClient(
                path=settings.CHROMA_PERSIST_DIR
            )
            self.collection = self.chroma_client.get_or_create_collection(
                name="lumina_files",
                metadata={"description": "LUMINA organized files"},
            )
        except Exception as e:
            print(f"Warning: ChromaDB not available: {e}")
            self.chroma_client = None
            self.collection = None

    async def save_collection(
        self, files: List[Dict[str, Any]], organized_structure: Dict[str, Any]
    ) -> str:
        """Save collection to database and vector store"""
        collection_id = str(uuid.uuid4())

        try:
            session = get_session()

            # Save collection metadata
            categories = list(organized_structure.keys())
            collection = Collection(
                collection_id=collection_id,
                total_files=len(files),
                organized_structure=json.dumps(organized_structure),
                categories=json.dumps(categories),
            )
            session.add(collection)

            # Save individual files
            for file in files:
                # Find file location in organized structure
                location = self._find_file_location(file, organized_structure)

                file_record = FileRecord(
                    file_id=file["id"],
                    collection_id=collection_id,
                    name=file["name"],
                    path=file.get("path", ""),
                    type=file["type"],
                    size=file["size"],
                    extracted_text=file.get("extractedText", ""),
                    category=location.get("category"),
                    subcategory=location.get("subcategory"),
                    folder=location.get("folder"),
                )
                session.add(file_record)

            session.commit()
            session.close()

            # Add to vector store
            if self.collection and files:
                await self._add_to_vector_store(files, collection_id)

            print(f"✅ Saved collection {collection_id} with {len(files)} files")
            return collection_id

        except Exception as e:
            print(f"Error saving collection: {e}")
            raise

    def _find_file_location(
        self, file: Dict[str, Any], structure: Dict[str, Any]
    ) -> Dict[str, str]:
        """Find where a file is located in the organized structure"""
        for category, subcategories in structure.items():
            for subcategory, folders in subcategories.items():
                for folder, file_list in folders.items():
                    if any(f["id"] == file["id"] for f in file_list):
                        return {
                            "category": category,
                            "subcategory": subcategory,
                            "folder": folder,
                        }
        return {}

    async def _add_to_vector_store(self, files: List[Dict[str, Any]], collection_id: str):
        """Add files to ChromaDB vector store"""
        if not self.collection:
            return

        try:
            # Prepare data for ChromaDB
            ids = []
            embeddings = []
            documents = []
            metadatas = []

            for file in files:
                if file.get("embedding"):
                    ids.append(f"{collection_id}_{file['id']}")
                    embeddings.append(file["embedding"])

                    # Document text
                    doc = f"{file['name']} {file.get('extractedText', '')[:500]}"
                    documents.append(doc)

                    # Metadata
                    metadatas.append(
                        {
                            "collection_id": collection_id,
                            "file_id": file["id"],
                            "name": file["name"],
                            "type": file["type"],
                        }
                    )

            if ids:
                self.collection.add(
                    ids=ids,
                    embeddings=embeddings,
                    documents=documents,
                    metadatas=metadatas,
                )
                print(f"Added {len(ids)} files to vector store")

        except Exception as e:
            print(f"Error adding to vector store: {e}")

    async def semantic_search(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Semantic search across all files"""
        if not self.collection:
            return []

        try:
            # Generate query embedding
            from core.embeddings import EmbeddingEngine

            embedding_engine = EmbeddingEngine()
            query_embedding = await embedding_engine.generate_embedding(query)

            # Search in ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding], n_results=limit
            )

            # Format results
            formatted_results = []
            if results and results["metadatas"]:
                for metadata in results["metadatas"][0]:
                    formatted_results.append(
                        {
                            "id": metadata["file_id"],
                            "name": metadata["name"],
                            "type": metadata["type"],
                        }
                    )

            return formatted_results

        except Exception as e:
            print(f"Error in semantic search: {e}")
            return []

    async def get_collection(self, collection_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a collection by ID"""
        try:
            session = get_session()
            collection = session.query(Collection).filter(
                Collection.collection_id == collection_id
            ).first()
            session.close()

            if not collection:
                return None

            return {
                "collection_id": collection.collection_id,
                "total_files": collection.total_files,
                "organized_structure": json.loads(collection.organized_structure),
                "categories": json.loads(collection.categories),
                "created_at": collection.created_at.isoformat(),
            }

        except Exception as e:
            print(f"Error getting collection: {e}")
            return None

    async def get_all_collections(self) -> List[Dict[str, Any]]:
        """Get all collections"""
        try:
            session = get_session()
            collections = session.query(Collection).order_by(
                Collection.created_at.desc()
            ).all()
            session.close()

            return [
                {
                    "collection_id": c.collection_id,
                    "total_files": c.total_files,
                    "categories": json.loads(c.categories),
                    "created_at": c.created_at.isoformat(),
                }
                for c in collections
            ]

        except Exception as e:
            print(f"Error getting all collections: {e}")
            return []
