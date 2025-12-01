"""
Embedding Engine - Generate embeddings using OpenAI or Ollama
"""
from typing import List, Dict, Any
import asyncio
from config import settings


class EmbeddingEngine:
    """Generate embeddings for semantic understanding"""

    def __init__(self):
        self.use_ollama = settings.USE_OLLAMA
        
        if not self.use_ollama:
            # OpenAI
            try:
                from openai import AsyncOpenAI
                self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                self.model = settings.OPENAI_EMBEDDING_MODEL
            except Exception as e:
                print(f"Warning: OpenAI not available: {e}")
                self.client = None
        else:
            # Ollama
            try:
                import httpx
                self.client = httpx.AsyncClient(base_url=settings.OLLAMA_BASE_URL)
                self.model = settings.OLLAMA_EMBEDDING_MODEL
            except Exception as e:
                print(f"Warning: Ollama not available: {e}")
                self.client = None

    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text"""
        if not self.client:
            # Return dummy embedding if no client available
            return [0.0] * 1536

        try:
            if not self.use_ollama:
                # OpenAI
                response = await self.client.embeddings.create(
                    model=self.model,
                    input=text[:8000],  # Limit text length
                )
                return response.data[0].embedding
            else:
                # Ollama
                response = await self.client.post(
                    "/api/embeddings",
                    json={"model": self.model, "prompt": text[:8000]},
                )
                data = response.json()
                return data.get("embedding", [0.0] * 768)

        except Exception as e:
            print(f"Error generating embedding: {e}")
            return [0.0] * (1536 if not self.use_ollama else 768)

    async def generate_embeddings(self, files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate embeddings for all files"""
        print(f"Generating embeddings for {len(files)} files...")

        async def process_file(file_data: Dict[str, Any]) -> Dict[str, Any]:
            # Create text representation of file for embedding
            text_parts = [
                file_data.get("name", ""),
                file_data.get("path", ""),
            ]

            # Add extracted text if available
            if file_data.get("extractedText"):
                text_parts.append(file_data["extractedText"][:2000])

            text = " ".join(text_parts)

            # Generate embedding
            embedding = await self.generate_embedding(text)
            file_data["embedding"] = embedding

            return file_data

        # Process in batches
        batch_size = settings.EMBEDDING_BATCH_SIZE
        results = []

        for i in range(0, len(files), batch_size):
            batch = files[i : i + batch_size]
            batch_results = await asyncio.gather(
                *[process_file(file_data) for file_data in batch]
            )
            results.extend(batch_results)
            print(f"Processed {len(results)}/{len(files)} files")

        return results
