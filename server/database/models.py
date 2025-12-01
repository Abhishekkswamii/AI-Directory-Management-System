from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional, Dict, Any
from datetime import datetime
import json


class Collection(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    collection_id: str = Field(index=True, unique=True)
    total_files: int
    organized_structure: str  # JSON string
    categories: str  # JSON string (list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class FileRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    file_id: str = Field(index=True)
    collection_id: str = Field(index=True)
    name: str
    path: str
    type: str
    size: int
    extracted_text: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    folder: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Database engine
engine = None


def init_db():
    """Initialize database"""
    global engine
    from config import settings

    engine = create_engine(settings.DATABASE_URL, echo=False)
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get database session"""
    return Session(engine)
