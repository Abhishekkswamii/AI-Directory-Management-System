"""
🛠️ Utility Functions
====================

Beautiful helper functions that make life easier.
Clean, simple, and reusable.
"""

import hashlib
import mimetypes
from pathlib import Path
from typing import Optional
from datetime import datetime


def calculate_file_hash(file_path: Path) -> str:
    """
    Calculate a unique fingerprint (SHA-256 hash) for a file.
    
    This helps us detect duplicate files and track file changes.
    Like a fingerprint, but for files!
    
    Args:
        file_path: Path to the file
        
    Returns:
        A unique hash string representing the file's content
    """
    sha256_hash = hashlib.sha256()
    
    try:
        with open(file_path, "rb") as f:
            # Read in chunks to handle large files efficiently
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except Exception:
        # If we can't read the file, return empty hash
        return ""


def get_file_type(file_path: Path) -> str:
    """
    Guess what type of file this is (PDF, image, code, etc.).
    
    Uses both file extension and MIME type detection for accuracy.
    
    Args:
        file_path: Path to the file
        
    Returns:
        A friendly file type name like "pdf", "image", "code", "document"
    """
    if not file_path.is_file():
        return "unknown"
    
    # Get MIME type
    mime_type, _ = mimetypes.guess_type(str(file_path))
    suffix = file_path.suffix.lower()
    
    # Map common types to friendly names
    if suffix in [".pdf"]:
        return "pdf"
    elif suffix in [".doc", ".docx", ".odt", ".rtf"]:
        return "document"
    elif suffix in [".txt", ".md", ".markdown"]:
        return "text"
    elif suffix in [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"]:
        return "image"
    elif suffix in [".mp4", ".avi", ".mov", ".mkv", ".webm"]:
        return "video"
    elif suffix in [".mp3", ".wav", ".flac", ".m4a", ".ogg"]:
        return "audio"
    elif suffix in [".py", ".js", ".ts", ".java", ".cpp", ".c", ".h", ".go", ".rs"]:
        return "code"
    elif suffix in [".json", ".xml", ".yaml", ".yml", ".toml"]:
        return "data"
    elif suffix in [".zip", ".tar", ".gz", ".rar", ".7z"]:
        return "archive"
    elif suffix in [".exe", ".dmg", ".app", ".msi"]:
        return "application"
    elif mime_type:
        # Fall back to MIME type category
        if mime_type.startswith("image/"):
            return "image"
        elif mime_type.startswith("video/"):
            return "video"
        elif mime_type.startswith("audio/"):
            return "audio"
        elif mime_type.startswith("text/"):
            return "text"
    
    return "other"


def format_file_size(size_bytes: int) -> str:
    """
    Convert bytes to human-readable format (KB, MB, GB).
    
    Makes file sizes beautiful and easy to understand!
    
    Args:
        size_bytes: File size in bytes
        
    Returns:
        Formatted string like "1.5 MB" or "234 KB"
    """
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} PB"


def safe_filename(text: str) -> str:
    """
    Convert any text into a safe filename.
    
    Removes special characters and keeps it clean for all operating systems.
    
    Args:
        text: Any text to convert
        
    Returns:
        A safe filename string
    """
    # Remove or replace problematic characters
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        text = text.replace(char, "_")
    
    # Clean up multiple underscores
    while "__" in text:
        text = text.replace("__", "_")
    
    # Trim and limit length
    text = text.strip("_").strip()
    return text[:200]  # Keep it reasonable


def get_timestamp() -> str:
    """
    Get current timestamp in a beautiful format.
    
    Returns:
        Formatted timestamp like "2025-11-26 14:30:45"
    """
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def is_hidden_file(file_path: Path) -> bool:
    """
    Check if a file or folder is hidden.
    
    On Windows, checks for hidden attribute.
    On Unix, checks if name starts with dot.
    
    Args:
        file_path: Path to check
        
    Returns:
        True if the file/folder is hidden
    """
    # Check if name starts with dot (Unix hidden files)
    if file_path.name.startswith("."):
        return True
    
    # On Windows, check hidden attribute
    try:
        import os
        import stat
        return bool(file_path.stat().st_file_attributes & stat.FILE_ATTRIBUTE_HIDDEN)
    except (AttributeError, OSError):
        return False


def should_ignore_file(file_path: Path) -> bool:
    """
    Check if we should ignore this file (system files, temp files, etc.).
    
    We want to organize real user files, not system junk!
    
    Args:
        file_path: Path to check
        
    Returns:
        True if file should be ignored
    """
    ignore_patterns = [
        "thumbs.db",
        "desktop.ini",
        ".ds_store",
        "~$",  # Temp Office files
        ".tmp",
        ".temp",
        ".cache",
    ]
    
    name_lower = file_path.name.lower()
    
    # Check ignore patterns
    for pattern in ignore_patterns:
        if pattern in name_lower:
            return True
    
    # Ignore hidden files
    if is_hidden_file(file_path):
        return True
    
    return False
