"""
Embedding Engine - Generate embeddings using Ollama or Gemini
"""
from typing import List, Dict, Any
import asyncio
from config import settings


class EmbeddingEngine:
    """Generate embeddings for semantic understanding"""

    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        self.client = None
        self.model = None

        if self.provider == "ollama":
            # Ollama setup
            try:
                import httpx
                self.client = httpx.AsyncClient(base_url=settings.OLLAMA_BASE_URL)
                self.model = settings.OLLAMA_EMBEDDING_MODEL
                print(f"✅ Ollama embedding client initialized: {self.model}")
            except Exception as e:
                print(f"Warning: Ollama not available: {e}")
        
        elif self.provider == "gemini":
            # Gemini setup
            try:
                import google.generativeai as genai
                if not settings.GEMINI_API_KEY:
                    print("⚠️ Warning: GEMINI_API_KEY not set")
                else:
                    genai.configure(api_key=settings.GEMINI_API_KEY)
                    self.client = genai
                    self.model = settings.GEMINI_EMBEDDING_MODEL
                    print(f"✅ Gemini embedding client initialized: {self.model}")
            except Exception as e:
                print(f"Warning: Gemini not available: {e}")
        
        else:
            print(f"⚠️ Unknown AI provider: {self.provider}. Using Ollama as default.")
            self.provider = "ollama"

    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text"""
        if not self.client:
            # Return dummy embedding if no client available
            return [0.0] * 768

        try:
            if self.provider == "ollama":
                # Ollama - truncate text for faster processing
                response = await self.client.post(
                    "/api/embeddings",
                    json={"model": self.model, "prompt": text[:1000]},
                    timeout=30.0,
                )
                data = response.json()
                return data.get("embedding", [0.0] * 768)
            
            elif self.provider == "gemini":
                # Gemini - use their embedding API
                result = self.client.embed_content(
                    model=self.model,
                    content=text[:1000],
                    task_type="retrieval_document"
                )
                return result['embedding']
            
            else:
                return [0.0] * 768

        except Exception as e:
            print(f"Error generating embedding: {e}")
            return [0.0] * 768

    async def generate_embeddings(self, files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate embeddings for all files - OPTIMIZED"""
        print(f"⚡ Fast-generating embeddings for {len(files)} files...")

        async def process_file(file_data: Dict[str, Any]) -> Dict[str, Any]:
            # Create text representation of file for embedding (reduced size for speed)
            text_parts = [
                file_data.get("name", ""),
                file_data.get("path", ""),
            ]

            # Add extracted text if available (reduced from 2000 to 500 for speed)
            if file_data.get("extractedText"):
                text_parts.append(file_data["extractedText"][:500])

            text = " ".join(text_parts)

            # Generate embedding
            embedding = await self.generate_embedding(text)
            file_data["embedding"] = embedding

            return file_data

        # Process in larger batches for better concurrency
        batch_size = settings.EMBEDDING_BATCH_SIZE
        results = []

        for i in range(0, len(files), batch_size):
            batch = files[i : i + batch_size]
            # Use asyncio.gather with return_exceptions to not fail entire batch
            batch_results = await asyncio.gather(
                *[process_file(file_data) for file_data in batch],
                return_exceptions=True
            )
            # Filter out exceptions
            valid_results = [r for r in batch_results if not isinstance(r, Exception)]
            results.extend(valid_results)
            print(f"⚡ Processed {len(results)}/{len(files)} files")

        return results
