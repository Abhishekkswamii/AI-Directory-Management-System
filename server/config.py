from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-large"

    # Ollama (alternative)
    USE_OLLAMA: bool = False
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2"
    OLLAMA_EMBEDDING_MODEL: str = "nomic-embed-text"

    # Database
    DATABASE_URL: str = "sqlite:///./lumina.db"
    CHROMA_PERSIST_DIR: str = "./chroma_db"

    # Server
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"  # Allow all for development to fix Electron/local file issues
    ]
    MAX_FILE_SIZE: int = 52428800  # 50MB
    MAX_FILES_PER_BATCH: int = 10000

    # AI
    MAX_TOKENS: int = 4000
    TEMPERATURE: float = 0.7
    EMBEDDING_BATCH_SIZE: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
