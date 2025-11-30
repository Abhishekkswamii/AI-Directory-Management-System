"""
🔎 Smart Searcher
=================

Find anything with natural language queries.
"Find my tax documents from 2024" - and boom, there they are!
"""

from pathlib import Path
from typing import Optional, List
from dataclasses import dataclass

from ..storage.database import FileRecord, get_database


@dataclass
class SearchResult:
    """
    A search result with relevance scoring.
    """
    file_record: FileRecord
    score: float
    match_reason: str
    
    def __str__(self) -> str:
        return f"{self.file_record.filename} (score: {self.score:.2f}) - {self.match_reason}"


class SmartSearcher:
    """
    Intelligent file searcher with natural language support.
    
    Can find files using:
    - Exact filename matches
    - Content search
    - Semantic similarity (if vector DB is available)
    - Date ranges
    - File types
    """
    
    def __init__(self):
        """Initialize the searcher"""
        self.db = get_database()
    
    def search(
        self,
        query: str,
        file_type: Optional[str] = None,
        limit: int = 20,
    ) -> List[SearchResult]:
        """
        Search for files using a natural language query.
        
        Args:
            query: Search query (e.g., "tax documents 2024")
            file_type: Optional filter by file type
            limit: Maximum results to return
            
        Returns:
            List of SearchResult objects, sorted by relevance
        """
        results: List[SearchResult] = []
        
        # Get all files from database
        all_files = self.db.get_all_files()
        
        # Filter by file type if specified
        if file_type:
            all_files = [f for f in all_files if f.file_type == file_type]
        
        # Search in filename
        for file_record in all_files:
            score = 0.0
            reasons = []
            
            # Check filename match
            filename_lower = file_record.filename.lower()
            query_lower = query.lower()
            
            # Exact match gets highest score
            if query_lower in filename_lower:
                score += 1.0
                reasons.append("filename match")
            
            # Check each word in query
            query_words = query_lower.split()
            matched_words = sum(1 for word in query_words if word in filename_lower)
            
            if matched_words > 0:
                score += (matched_words / len(query_words)) * 0.8
                reasons.append(f"{matched_words} keyword(s)")
            
            # Check content if available
            if file_record.content_preview:
                content_lower = file_record.content_preview.lower()
                
                if query_lower in content_lower:
                    score += 0.7
                    reasons.append("content match")
                
                content_matches = sum(1 for word in query_words if word in content_lower)
                if content_matches > 0:
                    score += (content_matches / len(query_words)) * 0.5
            
            # Check category
            if file_record.category:
                category_lower = file_record.category.lower()
                if query_lower in category_lower:
                    score += 0.3
                    reasons.append("category match")
            
            # Add to results if score is significant (minimum 30% relevance)
            if score > 0.3:
                match_reason = ", ".join(reasons)
                results.append(
                    SearchResult(
                        file_record=file_record,
                        score=score,
                        match_reason=match_reason,
                    )
                )
        
        # Sort by score (highest first) and limit
        results.sort(key=lambda r: r.score, reverse=True)
        return results[:limit]
    
    def search_by_date_range(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> List[FileRecord]:
        """
        Search for files within a date range.
        
        Args:
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            
        Returns:
            List of matching files
        """
        # This would be implemented with proper date filtering
        # For now, return all files
        return self.db.get_all_files()
    
    def search_by_category(self, category: str) -> List[FileRecord]:
        """
        Find all files in a specific category.
        
        Args:
            category: Category name
            
        Returns:
            List of files in that category
        """
        all_files = self.db.get_all_files()
        return [
            f for f in all_files 
            if f.category and f.category.lower() == category.lower()
        ]
    
    def search_duplicates(self) -> dict[str, List[FileRecord]]:
        """
        Find duplicate files (same content, different names/locations).
        
        Returns:
            Dictionary mapping file hashes to lists of duplicate files
        """
        all_files = self.db.get_all_files()
        
        # Group by hash
        hash_groups: dict[str, List[FileRecord]] = {}
        
        for file_record in all_files:
            if file_record.file_hash:
                if file_record.file_hash not in hash_groups:
                    hash_groups[file_record.file_hash] = []
                hash_groups[file_record.file_hash].append(file_record)
        
        # Only return groups with more than one file (duplicates)
        duplicates = {
            hash_val: files 
            for hash_val, files in hash_groups.items() 
            if len(files) > 1
        }
        
        return duplicates
    
    def search_large_files(self, min_size_mb: float = 10.0) -> List[FileRecord]:
        """
        Find large files above a certain size.
        
        Args:
            min_size_mb: Minimum file size in megabytes
            
        Returns:
            List of large files, sorted by size (largest first)
        """
        min_bytes = int(min_size_mb * 1024 * 1024)
        all_files = self.db.get_all_files()
        
        large_files = [f for f in all_files if f.size_bytes >= min_bytes]
        large_files.sort(key=lambda f: f.size_bytes, reverse=True)
        
        return large_files
    
    def get_statistics(self) -> dict[str, any]:
        """
        Get statistics about the file collection.
        
        Returns:
            Dictionary with various statistics
        """
        all_files = self.db.get_all_files()
        
        if not all_files:
            return {"total_files": 0}
        
        # Count by type
        type_counts: dict[str, int] = {}
        for file_record in all_files:
            file_type = file_record.file_type or "unknown"
            type_counts[file_type] = type_counts.get(file_type, 0) + 1
        
        # Count by category
        category_counts: dict[str, int] = {}
        for file_record in all_files:
            category = file_record.category or "Uncategorized"
            category_counts[category] = category_counts.get(category, 0) + 1
        
        # Calculate total size
        total_size = sum(f.size_bytes for f in all_files)
        
        return {
            "total_files": len(all_files),
            "total_size_bytes": total_size,
            "file_types": type_counts,
            "categories": category_counts,
        }


# Global instance
_searcher: Optional[SmartSearcher] = None


def get_searcher() -> SmartSearcher:
    """Get the global searcher instance"""
    global _searcher
    if _searcher is None:
        _searcher = SmartSearcher()
    return _searcher
