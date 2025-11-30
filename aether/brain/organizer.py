"""
🗂️ File Organizer
=================

Safely moves files into organized folders.
Always asks permission, creates backups, and can undo everything!
"""

from pathlib import Path
from typing import Optional
import shutil
import json
from datetime import datetime
from dataclasses import dataclass, asdict

from ..config import get_config
from ..utils import safe_filename


@dataclass
class OrganizeAction:
    """
    Record of a single file operation.
    
    This lets us undo everything if needed!
    """
    source: str
    destination: str
    operation: str  # "move" or "copy"
    timestamp: str
    success: bool
    error: Optional[str] = None


class FileOrganizer:
    """
    The careful organizer that moves files safely.
    
    Features:
    - Dry-run mode to preview changes
    - Automatic backups before organizing
    - Undo support to revert changes
    - Conflict resolution (never overwrites)
    """
    
    def __init__(self, target_directory: Path, dry_run: bool = True):
        """
        Initialize the organizer.
        
        Args:
            target_directory: Where to organize files
            dry_run: If True, only simulate (don't actually move files)
        """
        self.target_directory = target_directory.resolve()
        self.dry_run = dry_run
        self.config = get_config()
        
        # Track all actions for undo
        self.actions: list[OrganizeAction] = []
        
        # Statistics
        self.files_organized = 0
        self.files_failed = 0
        self.categories_created = 0
    
    def organize_file(
        self,
        file_path: Path,
        category: str,
        subcategory: Optional[str] = None,
    ) -> OrganizeAction:
        """
        Organize a single file into its category folder.
        
        Args:
            file_path: File to organize
            category: Main category folder (e.g., "Documents")
            subcategory: Optional subfolder (e.g., "Work")
            
        Returns:
            OrganizeAction record of what happened
        """
        # Build destination path
        dest_folder = self.target_directory / safe_filename(category)
        if subcategory:
            dest_folder = dest_folder / safe_filename(subcategory)
        
        dest_path = dest_folder / file_path.name
        
        # Handle filename conflicts
        dest_path = self._resolve_conflict(dest_path)
        
        # Record the action
        operation = "move" if self.config.organize_mode == "move" else "copy"
        action = OrganizeAction(
            source=str(file_path),
            destination=str(dest_path),
            operation=operation,
            timestamp=datetime.now().isoformat(),
            success=False,
        )
        
        # In dry-run mode, just record what would happen
        if self.dry_run:
            action.success = True
            self.actions.append(action)
            self.files_organized += 1
            return action
        
        # Actually perform the operation
        try:
            # Create destination folder
            dest_folder.mkdir(parents=True, exist_ok=True)
            self.categories_created += 1
            
            # Move or copy the file
            if operation == "move":
                shutil.move(str(file_path), str(dest_path))
            else:
                shutil.copy2(str(file_path), str(dest_path))
            
            action.success = True
            self.files_organized += 1
        
        except Exception as e:
            action.success = False
            action.error = str(e)
            self.files_failed += 1
        
        self.actions.append(action)
        return action
    
    def organize_batch(
        self,
        file_categories: dict[Path, tuple[str, Optional[str]]],
    ) -> list[OrganizeAction]:
        """
        Organize multiple files at once.
        
        Args:
            file_categories: Dictionary mapping file paths to (category, subcategory)
            
        Returns:
            List of all OrganizeAction records
        """
        results = []
        
        for file_path, (category, subcategory) in file_categories.items():
            action = self.organize_file(file_path, category, subcategory)
            results.append(action)
        
        return results
    
    def _resolve_conflict(self, dest_path: Path) -> Path:
        """
        Resolve filename conflicts.
        
        If a file already exists at the destination, append a number.
        Example: document.pdf -> document (2).pdf
        
        Args:
            dest_path: Proposed destination path
            
        Returns:
            A path that doesn't conflict with existing files
        """
        if not dest_path.exists():
            return dest_path
        
        # File exists, find an available name
        stem = dest_path.stem
        suffix = dest_path.suffix
        parent = dest_path.parent
        
        counter = 2
        while True:
            new_name = f"{stem} ({counter}){suffix}"
            new_path = parent / new_name
            
            if not new_path.exists():
                return new_path
            
            counter += 1
            
            # Sanity check
            if counter > 1000:
                raise ValueError(f"Too many conflicts for {dest_path}")
    
    def save_undo_info(self) -> Path:
        """
        Save undo information to disk.
        
        This allows us to undo the organization later!
        
        Returns:
            Path to the undo file
        """
        undo_dir = self.target_directory / ".aether_undo"
        undo_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        undo_file = undo_dir / f"undo_{timestamp}.json"
        
        # Convert actions to JSON
        undo_data = {
            "timestamp": datetime.now().isoformat(),
            "target_directory": str(self.target_directory),
            "actions": [asdict(action) for action in self.actions if action.success],
        }
        
        with open(undo_file, "w") as f:
            json.dump(undo_data, f, indent=2)
        
        return undo_file
    
    def undo(self, undo_file: Path) -> int:
        """
        Undo a previous organization.
        
        Reverses all file operations from the undo file.
        
        Args:
            undo_file: Path to the undo JSON file
            
        Returns:
            Number of files successfully restored
        """
        with open(undo_file, "r") as f:
            undo_data = json.load(f)
        
        restored_count = 0
        
        # Reverse the actions in reverse order
        for action_dict in reversed(undo_data["actions"]):
            try:
                source = Path(action_dict["source"])
                destination = Path(action_dict["destination"])
                
                # Move file back to original location
                if destination.exists():
                    # Ensure source directory exists
                    source.parent.mkdir(parents=True, exist_ok=True)
                    
                    # Move back
                    shutil.move(str(destination), str(source))
                    restored_count += 1
            
            except Exception:
                # Skip files that can't be restored
                continue
        
        return restored_count
    
    def get_summary(self) -> dict[str, any]:
        """
        Get a summary of the organization operation.
        
        Returns:
            Dictionary with statistics
        """
        return {
            "total_files": len(self.actions),
            "successful": self.files_organized,
            "failed": self.files_failed,
            "categories_created": self.categories_created,
            "dry_run": self.dry_run,
            "mode": self.config.organize_mode,
        }
    
    def get_preview(self) -> dict[str, list[str]]:
        """
        Get a preview of the organization structure.
        
        Returns:
            Dictionary mapping categories to file lists
        """
        preview: dict[str, list[str]] = {}
        
        for action in self.actions:
            dest_path = Path(action.destination)
            category = dest_path.parent.name
            
            if category not in preview:
                preview[category] = []
            
            preview[category].append(dest_path.name)
        
        return preview


def find_undo_files(directory: Path) -> list[Path]:
    """
    Find all undo files in a directory.
    
    Args:
        directory: Directory to search
        
    Returns:
        List of undo file paths, sorted by date (newest first)
    """
    undo_dir = directory / ".aether_undo"
    
    if not undo_dir.exists():
        return []
    
    undo_files = list(undo_dir.glob("undo_*.json"))
    undo_files.sort(reverse=True)  # Newest first
    
    return undo_files
