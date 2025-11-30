"""
💾 Database Manager
===================

Simple SQLite database to remember everything about your files.
Fast, reliable, and no complicated setup needed!
"""

from pathlib import Path
from typing import Optional, List
from datetime import datetime

from sqlmodel import SQLModel, Field, create_engine, Session, select

from ..config import get_config


class FileRecord(SQLModel, table=True):
    """
    A record of a file in the database.
    
    Stores everything we know about a file!
    """
    __tablename__ = "files"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # File identification
    filepath: str = Field(index=True)  # Full path to the file
    filename: str = Field(index=True)  # Just the filename
    file_hash: Optional[str] = Field(default=None, index=True)  # SHA-256 hash
    
    # File properties
    extension: str
    file_type: str  # pdf, image, document, etc.
    size_bytes: int
    
    # Content information
    content_preview: Optional[str] = None  # First few hundred chars
    has_readable_content: bool = False
    
    # Organization
    category: Optional[str] = Field(default=None, index=True)
    subcategory: Optional[str] = None
    tags: Optional[str] = None  # JSON array of tags
    
    # Metadata
    created_at: datetime
    modified_at: datetime
    scanned_at: datetime = Field(default_factory=datetime.now)
    
    # AI insights
    ai_confidence: Optional[float] = None
    ai_reasoning: Optional[str] = None


class Database:
    """
    Simple database manager for Aether.
    
    Handles all file record storage and retrieval.
    """
    
    def __init__(self, database_path: Optional[Path] = None):
        """
        Initialize the database.
        
        Args:
            database_path: Path to SQLite database file.
                          If None, uses path from config.
        """
        config = get_config()
        self.database_path = database_path or config.database_path
        
        # Ensure directory exists
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Create engine
        database_url = f"sqlite:///{self.database_path}"
        self.engine = create_engine(database_url, echo=False)
        
        # Create tables
        SQLModel.metadata.create_all(self.engine)
    
    def add_file(self, file_record: FileRecord) -> FileRecord:
        """
        Add a file record to the database.
        
        Args:
            file_record: FileRecord to add
            
        Returns:
            The saved FileRecord with ID
        """
        with Session(self.engine) as session:
            session.add(file_record)
            session.commit()
            session.refresh(file_record)
            return file_record
    
    def get_file_by_path(self, filepath: str) -> Optional[FileRecord]:
        """
        Get a file record by its path.
        
        Args:
            filepath: Full path to the file
            
        Returns:
            FileRecord if found, None otherwise
        """
        with Session(self.engine) as session:
            statement = select(FileRecord).where(FileRecord.filepath == filepath)
            return session.exec(statement).first()
    
    def get_file_by_hash(self, file_hash: str) -> List[FileRecord]:
        """
        Find files with a specific hash (for duplicate detection).
        
        Args:
            file_hash: SHA-256 hash
            
        Returns:
            List of matching FileRecord objects
        """
        with Session(self.engine) as session:
            statement = select(FileRecord).where(FileRecord.file_hash == file_hash)
            return list(session.exec(statement).all())
    
    def get_all_files(self) -> List[FileRecord]:
        """
        Get all file records from the database.
        
        Returns:
            List of all FileRecord objects
        """
        with Session(self.engine) as session:
            statement = select(FileRecord)
            return list(session.exec(statement).all())
    
    def get_files_by_category(self, category: str) -> List[FileRecord]:
        """
        Get all files in a specific category.
        
        Args:
            category: Category name
            
        Returns:
            List of FileRecord objects
        """
        with Session(self.engine) as session:
            statement = select(FileRecord).where(FileRecord.category == category)
            return list(session.exec(statement).all())
    
    def update_file(self, file_record: FileRecord) -> FileRecord:
        """
        Update an existing file record.
        
        Args:
            file_record: FileRecord with updated data
            
        Returns:
            Updated FileRecord
        """
        with Session(self.engine) as session:
            session.add(file_record)
            session.commit()
            session.refresh(file_record)
            return file_record
    
    def delete_file(self, file_id: int) -> bool:
        """
        Delete a file record from the database.
        
        Args:
            file_id: ID of the file record
            
        Returns:
            True if deleted, False if not found
        """
        with Session(self.engine) as session:
            statement = select(FileRecord).where(FileRecord.id == file_id)
            file_record = session.exec(statement).first()
            
            if file_record:
                session.delete(file_record)
                session.commit()
                return True
            
            return False
    
    def search_files(self, query: str, limit: int = 20) -> List[FileRecord]:
        """
        Simple text search across filename and content.
        
        Args:
            query: Search query
            limit: Maximum results
            
        Returns:
            List of matching FileRecord objects
        """
        with Session(self.engine) as session:
            # Search in filename and content preview
            statement = (
                select(FileRecord)
                .where(
                    (FileRecord.filename.contains(query)) |
                    (FileRecord.content_preview.contains(query))
                )
                .limit(limit)
            )
            return list(session.exec(statement).all())
    
    def get_statistics(self) -> dict[str, any]:
        """
        Get database statistics.
        
        Returns:
            Dictionary with statistics
        """
        with Session(self.engine) as session:
            total_files = len(list(session.exec(select(FileRecord)).all()))
            
            if total_files == 0:
                return {"total_files": 0}
            
            # Get total size
            all_files = session.exec(select(FileRecord)).all()
            total_size = sum(f.size_bytes for f in all_files)
            
            # Count by type
            type_counts: dict[str, int] = {}
            category_counts: dict[str, int] = {}
            
            for file_record in all_files:
                # Count types
                file_type = file_record.file_type
                type_counts[file_type] = type_counts.get(file_type, 0) + 1
                
                # Count categories
                category = file_record.category or "Uncategorized"
                category_counts[category] = category_counts.get(category, 0) + 1
            
            return {
                "total_files": total_files,
                "total_size_bytes": total_size,
                "file_types": type_counts,
                "categories": category_counts,
            }
    
    def clear_all(self) -> int:
        """
        Clear all file records from the database.
        
        ⚠️ Use with caution! This deletes everything!
        
        Returns:
            Number of records deleted
        """
        with Session(self.engine) as session:
            statement = select(FileRecord)
            all_files = list(session.exec(statement).all())
            count = len(all_files)
            
            for file_record in all_files:
                session.delete(file_record)
            
            session.commit()
            return count


# Global database instance
_database: Optional[Database] = None


def get_database() -> Database:
    """
    Get the global database instance.
    
    Returns:
        Database instance
    """
    global _database
    if _database is None:
        _database = Database()
    return _database


def reset_database() -> Database:
    """
    Reset the database (useful for testing or fresh start).
    
    Returns:
        New Database instance
    """
    global _database
    _database = Database()
    return _database
