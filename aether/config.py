"""
⚙️ Configuration Manager
========================

Beautiful, intelligent configuration with sensible defaults.
Users can customize everything, but it works perfectly out of the box.
"""

from pathlib import Path
from typing import Literal, Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class AetherConfig(BaseSettings):
    """
    Aether's brain configuration.
    
    All settings with beautiful defaults that just work!
    Users can customize via environment variables or .env file.
    """
    
    # AI Provider Settings
    # ====================
    
    ai_provider: Literal["ollama", "openai"] = Field(
        default="ollama",
        description="Which AI brain to use: 'ollama' (free, local) or 'openai' (super smart)"
    )
    
    ollama_host: str = Field(
        default="http://localhost:11434",
        description="Where Ollama is running (usually localhost)"
    )
    
    ollama_model: str = Field(
        default="llama2",
        description="Which Ollama model to use (llama2, mistral, etc.)"
    )
    
    openai_api_key: Optional[str] = Field(
        default=None,
        description="Your OpenAI API key (only needed if using OpenAI)"
    )
    
    openai_model: str = Field(
        default="gpt-3.5-turbo",
        description="Which OpenAI model to use"
    )
    
    # Storage Settings
    # ================
    
    database_path: Path = Field(
        default=Path.home() / ".aether" / "aether.db",
        description="Where to store the file knowledge database"
    )
    
    vector_db_path: Path = Field(
        default=Path.home() / ".aether" / "vector_store",
        description="Where to store vector embeddings for smart search"
    )
    
    # Organization Settings
    # =====================
    
    organize_mode: Literal["copy", "move"] = Field(
        default="move",
        description="Should Aether move or copy files when organizing?"
    )
    
    create_backup: bool = Field(
        default=True,
        description="Create safety backups before organizing (highly recommended!)"
    )
    
    max_file_size_mb: int = Field(
        default=100,
        description="Maximum file size to process (in MB). Larger files are skipped."
    )
    
    # Scanning Settings
    # =================
    
    scan_hidden_files: bool = Field(
        default=False,
        description="Should Aether look at hidden files? (Usually you don't want this)"
    )
    
    follow_symlinks: bool = Field(
        default=False,
        description="Follow symbolic links during scanning?"
    )
    
    # UI Settings
    # ===========
    
    use_emojis: bool = Field(
        default=True,
        description="Show beautiful emojis in output? 🎨"
    )
    
    color_theme: Literal["auto", "light", "dark"] = Field(
        default="auto",
        description="Console color theme"
    )
    
    verbose: bool = Field(
        default=False,
        description="Show detailed logs for debugging?"
    )
    
    # Category Settings
    # =================
    
    default_categories: list[str] = Field(
        default=[
            "Documents",
            "Spreadsheets",
            "Presentations",
            "Images",
            "Videos",
            "Audio",
            "Code",
            "Archives",
            "PDFs",
            "Other"
        ],
        description="Default folder categories for organization"
    )
    
    smart_categories: bool = Field(
        default=True,
        description="Let AI create intelligent custom categories based on content?"
    )
    
    class Config:
        """Pydantic configuration"""
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_prefix = "AETHER_"
        case_sensitive = False
    
    def ensure_directories(self) -> None:
        """
        Create necessary directories if they don't exist.
        
        Called on startup to make sure everything is ready!
        """
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        self.vector_db_path.mkdir(parents=True, exist_ok=True)
    
    def get_display_config(self) -> dict[str, str]:
        """
        Get a pretty display of current configuration.
        
        Returns:
            Dictionary of setting names and values for display
        """
        return {
            "AI Provider": self.ai_provider.upper(),
            "Model": self.ollama_model if self.ai_provider == "ollama" else self.openai_model,
            "Database": str(self.database_path),
            "Organize Mode": self.organize_mode.title(),
            "Backups": "✅ Enabled" if self.create_backup else "❌ Disabled",
            "Smart Categories": "✅ Yes" if self.smart_categories else "❌ No",
        }


# Global configuration instance
# ==============================
# This is created once and used throughout the application

_config: Optional[AetherConfig] = None


def get_config() -> AetherConfig:
    """
    Get the global configuration instance.
    
    Creates it on first call, then returns the same instance.
    This ensures consistent configuration throughout the app.
    
    Returns:
        The global AetherConfig instance
    """
    global _config
    if _config is None:
        _config = AetherConfig()
        _config.ensure_directories()
    return _config


def reload_config() -> AetherConfig:
    """
    Reload configuration from environment/files.
    
    Useful if settings change during runtime.
    
    Returns:
        Fresh AetherConfig instance
    """
    global _config
    _config = AetherConfig()
    _config.ensure_directories()
    return _config
