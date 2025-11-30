"""
Simple test file to verify Aether works
"""

import pytest
from pathlib import Path


def test_imports():
    """Test that all modules can be imported"""
    from aether import __version__
    from aether.config import get_config
    from aether.utils import calculate_file_hash
    from aether.brain.scanner import FileScanner
    from aether.storage.database import get_database
    
    assert __version__ is not None
    assert get_config() is not None


def test_file_hash():
    """Test file hash calculation"""
    from aether.utils import calculate_file_hash
    
    # Create a temporary file
    test_file = Path("test_temp.txt")
    test_file.write_text("Hello, Aether!")
    
    # Calculate hash
    hash1 = calculate_file_hash(test_file)
    hash2 = calculate_file_hash(test_file)
    
    # Hashes should be consistent
    assert hash1 == hash2
    assert len(hash1) == 64  # SHA-256 is 64 hex characters
    
    # Clean up
    test_file.unlink()


def test_file_type_detection():
    """Test file type detection"""
    from aether.utils import get_file_type
    
    assert get_file_type(Path("test.pdf")) == "pdf"
    assert get_file_type(Path("test.py")) == "code"
    assert get_file_type(Path("test.jpg")) == "image"
    assert get_file_type(Path("test.docx")) == "document"


def test_safe_filename():
    """Test safe filename conversion"""
    from aether.utils import safe_filename
    
    assert safe_filename("hello world") == "hello world"
    assert safe_filename("file:name") == "file_name"
    assert safe_filename("test<>|.txt") == "test_.txt"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
