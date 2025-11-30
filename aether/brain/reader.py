"""
📖 File Reader
==============

Reads and understands different types of files.
PDFs, Word docs, images (with OCR), code files, and more!
"""

from pathlib import Path
from typing import Optional
import mimetypes

# We'll handle import errors gracefully
try:
    from PyPDF2 import PdfReader
    HAS_PDF = True
except ImportError:
    HAS_PDF = False

try:
    from docx import Document
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False

try:
    from PIL import Image
    import pytesseract
    HAS_OCR = True
except ImportError:
    HAS_OCR = False


class FileReader:
    """
    An intelligent file reader that understands many formats.
    
    Can extract text from:
    - PDFs
    - Word documents (.docx)
    - Text files
    - Code files
    - Images (with OCR)
    - And more!
    """
    
    def __init__(self):
        """Initialize the reader with available capabilities"""
        self.capabilities = {
            "pdf": HAS_PDF,
            "docx": HAS_DOCX,
            "ocr": HAS_OCR,
        }
    
    def read_file(self, file_path: Path, max_chars: int = 10000) -> Optional[str]:
        """
        Read and extract text content from a file.
        
        Automatically detects file type and uses the appropriate reader.
        
        Args:
            file_path: Path to the file
            max_chars: Maximum characters to extract (prevents memory issues)
            
        Returns:
            Extracted text content, or None if file can't be read
        """
        if not file_path.exists() or not file_path.is_file():
            return None
        
        suffix = file_path.suffix.lower()
        
        try:
            # PDF files
            if suffix == ".pdf":
                return self._read_pdf(file_path, max_chars)
            
            # Word documents
            elif suffix in [".docx", ".doc"]:
                return self._read_docx(file_path, max_chars)
            
            # Plain text and code files
            elif suffix in [
                ".txt", ".md", ".py", ".js", ".java", ".cpp", ".c", ".h",
                ".json", ".xml", ".yaml", ".yml", ".toml", ".ini", ".cfg",
                ".html", ".css", ".ts", ".go", ".rs", ".sh", ".bat"
            ]:
                return self._read_text(file_path, max_chars)
            
            # Images (with OCR if available)
            elif suffix in [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]:
                return self._read_image(file_path, max_chars)
            
            # Try as text if mime type suggests it's text
            else:
                mime_type, _ = mimetypes.guess_type(str(file_path))
                if mime_type and mime_type.startswith("text/"):
                    return self._read_text(file_path, max_chars)
            
            return None
        
        except Exception as e:
            # Gracefully handle any reading errors
            return f"[Error reading file: {str(e)}]"
    
    def _read_pdf(self, file_path: Path, max_chars: int) -> Optional[str]:
        """Extract text from PDF files"""
        if not HAS_PDF:
            return "[PDF reading not available - install PyPDF2]"
        
        try:
            reader = PdfReader(str(file_path))
            text_parts = []
            total_chars = 0
            
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
                    total_chars += len(page_text)
                    
                    if total_chars >= max_chars:
                        break
            
            full_text = "\n".join(text_parts)
            return full_text[:max_chars] if full_text else None
        
        except Exception as e:
            return f"[PDF error: {str(e)}]"
    
    def _read_docx(self, file_path: Path, max_chars: int) -> Optional[str]:
        """Extract text from Word documents"""
        if not HAS_DOCX:
            return "[Word document reading not available - install python-docx]"
        
        try:
            doc = Document(str(file_path))
            text_parts = []
            total_chars = 0
            
            for paragraph in doc.paragraphs:
                text = paragraph.text.strip()
                if text:
                    text_parts.append(text)
                    total_chars += len(text)
                    
                    if total_chars >= max_chars:
                        break
            
            full_text = "\n".join(text_parts)
            return full_text[:max_chars] if full_text else None
        
        except Exception as e:
            return f"[Word document error: {str(e)}]"
    
    def _read_text(self, file_path: Path, max_chars: int) -> Optional[str]:
        """Read plain text files"""
        try:
            # Try different encodings
            for encoding in ["utf-8", "latin-1", "cp1252"]:
                try:
                    with open(file_path, "r", encoding=encoding) as f:
                        content = f.read(max_chars)
                        return content
                except UnicodeDecodeError:
                    continue
            
            return "[Unable to decode text file]"
        
        except Exception as e:
            return f"[Text file error: {str(e)}]"
    
    def _read_image(self, file_path: Path, max_chars: int) -> Optional[str]:
        """Extract text from images using OCR"""
        if not HAS_OCR:
            return "[OCR not available - install pytesseract and Pillow]"
        
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text[:max_chars] if text else None
        
        except Exception as e:
            return f"[OCR error: {str(e)}]"
    
    def get_file_metadata(self, file_path: Path) -> dict[str, any]:
        """
        Extract useful metadata from a file.
        
        Args:
            file_path: Path to the file
            
        Returns:
            Dictionary with metadata like keywords, dates, etc.
        """
        metadata = {
            "filename": file_path.name,
            "extension": file_path.suffix.lower(),
            "size": file_path.stat().st_size,
        }
        
        # Extract content preview
        content = self.read_file(file_path, max_chars=500)
        if content:
            metadata["preview"] = content[:200]
            metadata["has_content"] = True
        else:
            metadata["has_content"] = False
        
        return metadata


# Singleton instance for convenience
_reader: Optional[FileReader] = None


def get_reader() -> FileReader:
    """
    Get the global FileReader instance.
    
    Returns:
        FileReader instance
    """
    global _reader
    if _reader is None:
        _reader = FileReader()
    return _reader
