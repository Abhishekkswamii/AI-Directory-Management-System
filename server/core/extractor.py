"""
Text Extractor - Server-side text extraction (backup for client-side)
"""
from typing import Optional
import mimetypes


class TextExtractor:
    """Extract text from various file types"""

    @staticmethod
    def extract_text(file_data: dict) -> Optional[str]:
        """
        Extract text from file data.
        In this implementation, we rely on client-side extraction.
        This is a fallback/validation layer.
        """
        # If client already extracted text, use it
        if file_data.get("extractedText"):
            return file_data["extractedText"]

        # If file content is provided as text
        if file_data.get("content"):
            content = file_data["content"]
            if isinstance(content, str):
                return content

        return None

    @staticmethod
    def should_have_text(filename: str) -> bool:
        """Check if file type typically contains extractable text"""
        text_extensions = {
            "txt",
            "md",
            "pdf",
            "doc",
            "docx",
            "json",
            "xml",
            "html",
            "css",
            "js",
            "py",
            "java",
            "cpp",
            "c",
            "h",
        }

        ext = filename.split(".")[-1].lower()
        return ext in text_extensions
