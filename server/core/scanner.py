"""
File Scanner - Analyzes and categorizes files by type
"""
from typing import List, Dict, Any
from pathlib import Path


class FileScanner:
    """Scans and analyzes file metadata"""

    # File type categories
    CATEGORIES = {
        "documents": [
            "pdf",
            "doc",
            "docx",
            "txt",
            "md",
            "rtf",
            "odt",
            "pages",
        ],
        "spreadsheets": ["xls", "xlsx", "csv", "numbers", "ods"],
        "presentations": ["ppt", "pptx", "key", "odp"],
        "images": ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "tiff", "ico"],
        "videos": ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm", "m4v"],
        "audio": ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"],
        "code": [
            "py",
            "js",
            "ts",
            "jsx",
            "tsx",
            "java",
            "cpp",
            "c",
            "h",
            "cs",
            "php",
            "rb",
            "go",
            "rs",
            "swift",
            "kt",
            "scala",
            "r",
        ],
        "web": ["html", "css", "scss", "sass", "less"],
        "data": ["json", "xml", "yaml", "yml", "toml", "ini", "conf"],
        "archives": ["zip", "rar", "7z", "tar", "gz", "bz2"],
        "executables": ["exe", "dmg", "app", "deb", "rpm"],
    }

    @staticmethod
    def get_file_category(filename: str) -> str:
        """Determine file category based on extension"""
        ext = Path(filename).suffix.lstrip(".").lower()

        for category, extensions in FileScanner.CATEGORIES.items():
            if ext in extensions:
                return category

        return "other"

    @staticmethod
    def analyze_files(files: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze file collection and return statistics"""
        stats = {
            "total_files": len(files),
            "total_size": sum(f.get("size", 0) for f in files),
            "categories": {},
            "extensions": {},
        }

        for file in files:
            # Category
            category = FileScanner.get_file_category(file["name"])
            stats["categories"][category] = stats["categories"].get(category, 0) + 1

            # Extension
            ext = Path(file["name"]).suffix.lstrip(".").lower() or "no_extension"
            stats["extensions"][ext] = stats["extensions"].get(ext, 0) + 1

        return stats
