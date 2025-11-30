"""
🔍 File Scanner
===============

Gently explores folders and discovers all your files.
Never intrusive, always respectful of your system.
"""

from pathlib import Path
from typing import Iterator, Optional
from dataclasses import dataclass
from datetime import datetime

from ..utils import get_file_type, should_ignore_file, calculate_file_hash, format_file_size


@dataclass
class ScannedFile:
    """
    A beautiful representation of a file we discovered.
    
    Contains everything we need to know about a file!
    """
    path: Path
    name: str
    extension: str
    file_type: str
    size_bytes: int
    size_formatted: str
    created_at: datetime
    modified_at: datetime
    hash: str
    
    def __str__(self) -> str:
        """Pretty string representation"""
        return f"{self.name} ({self.size_formatted}) - {self.file_type}"


class FileScanner:
    """
    A gentle, intelligent file scanner.
    
    Explores directories and discovers files without being invasive.
    Respects system boundaries and user preferences.
    """
    
    def __init__(
        self,
        target_path: Path,
        include_hidden: bool = False,
        follow_symlinks: bool = False,
        max_depth: Optional[int] = None,
    ):
        """
        Initialize the scanner.
        
        Args:
            target_path: Directory to scan
            include_hidden: Include hidden files?
            follow_symlinks: Follow symbolic links?
            max_depth: Maximum directory depth (None = unlimited)
        """
        self.target_path = target_path.resolve()
        self.include_hidden = include_hidden
        self.follow_symlinks = follow_symlinks
        self.max_depth = max_depth
        
        # Statistics
        self.files_found = 0
        self.total_size = 0
        self.errors: list[str] = []
    
    def scan(self) -> Iterator[ScannedFile]:
        """
        Scan the target directory and yield discovered files.
        
        This is a generator - it yields files one by one as they're discovered,
        making it memory-efficient even for huge directories!
        
        Yields:
            ScannedFile objects for each discovered file
        """
        if not self.target_path.exists():
            raise FileNotFoundError(f"Directory not found: {self.target_path}")
        
        if not self.target_path.is_dir():
            raise NotADirectoryError(f"Not a directory: {self.target_path}")
        
        # Start the recursive scan
        yield from self._scan_directory(self.target_path, depth=0)
    
    def _scan_directory(self, directory: Path, depth: int) -> Iterator[ScannedFile]:
        """
        Recursively scan a directory.
        
        Args:
            directory: Directory to scan
            depth: Current recursion depth
            
        Yields:
            ScannedFile objects
        """
        # Check depth limit
        if self.max_depth is not None and depth > self.max_depth:
            return
        
        try:
            # List all items in directory
            for item in directory.iterdir():
                # Handle symbolic links
                if item.is_symlink() and not self.follow_symlinks:
                    continue
                
                # Skip hidden files if configured
                if not self.include_hidden and should_ignore_file(item):
                    continue
                
                try:
                    if item.is_file():
                        # Process file
                        scanned_file = self._process_file(item)
                        if scanned_file:
                            self.files_found += 1
                            self.total_size += scanned_file.size_bytes
                            yield scanned_file
                    
                    elif item.is_dir():
                        # Recursively scan subdirectory
                        yield from self._scan_directory(item, depth + 1)
                
                except PermissionError:
                    self.errors.append(f"Permission denied: {item}")
                except Exception as e:
                    self.errors.append(f"Error processing {item}: {str(e)}")
        
        except PermissionError:
            self.errors.append(f"Permission denied: {directory}")
        except Exception as e:
            self.errors.append(f"Error scanning {directory}: {str(e)}")
    
    def _process_file(self, file_path: Path) -> Optional[ScannedFile]:
        """
        Process a single file and create a ScannedFile object.
        
        Args:
            file_path: Path to the file
            
        Returns:
            ScannedFile object or None if file should be skipped
        """
        try:
            # Get file stats
            stats = file_path.stat()
            
            # Skip if file is too large (> 100 MB by default)
            if stats.st_size > 100 * 1024 * 1024:  # 100 MB
                return None
            
            # Get file information
            file_type = get_file_type(file_path)
            file_hash = calculate_file_hash(file_path)
            
            return ScannedFile(
                path=file_path,
                name=file_path.name,
                extension=file_path.suffix.lower(),
                file_type=file_type,
                size_bytes=stats.st_size,
                size_formatted=format_file_size(stats.st_size),
                created_at=datetime.fromtimestamp(stats.st_ctime),
                modified_at=datetime.fromtimestamp(stats.st_mtime),
                hash=file_hash,
            )
        
        except Exception as e:
            self.errors.append(f"Error processing {file_path}: {str(e)}")
            return None
    
    def get_summary(self) -> dict[str, any]:
        """
        Get a summary of the scan results.
        
        Returns:
            Dictionary with scan statistics
        """
        return {
            "files_found": self.files_found,
            "total_size": self.total_size,
            "total_size_formatted": format_file_size(self.total_size),
            "errors": len(self.errors),
            "target_path": str(self.target_path),
        }


def quick_scan(directory: Path, include_hidden: bool = False) -> list[ScannedFile]:
    """
    Quick utility function to scan a directory and return all files.
    
    This is simpler than using FileScanner directly, but loads
    everything into memory at once.
    
    Args:
        directory: Directory to scan
        include_hidden: Include hidden files?
        
    Returns:
        List of all discovered files
    """
    scanner = FileScanner(directory, include_hidden=include_hidden)
    return list(scanner.scan())
