"""
🎯 Main CLI Application
========================

Beautiful command-line interface powered by Typer.
Your gateway to AI-powered file organization!
"""

from pathlib import Path
from typing import Optional
import typer
from typing_extensions import Annotated

from .config import get_config
from .brain.scanner import FileScanner, ScannedFile
from .brain.reader import get_reader
from .brain.thinker import get_thinker
from .brain.organizer import FileOrganizer, find_undo_files
from .brain.searcher import get_searcher
from .storage.database import get_database, FileRecord
from .ui.beauty import (
    print_welcome,
    print_config,
    print_scan_summary,
    print_file_table,
    print_organization_preview,
    print_organize_summary,
    print_search_results,
    print_statistics,
    print_error,
    print_success,
    print_info,
    print_thinking,
    ask_confirmation,
    create_progress,
)

# Create Typer app with beautiful styling
app = typer.Typer(
    name="aether",
    help="✨ Aether - Your AI file butler that organizes chaos into beauty",
    add_completion=False,
    rich_markup_mode="rich",
)


@app.command()
def scan(
    directory: Annotated[
        Optional[Path],
        typer.Argument(help="Directory to scan (default: current directory)")
    ] = None,
    include_hidden: Annotated[
        bool,
        typer.Option("--hidden", help="Include hidden files")
    ] = False,
    save: Annotated[
        bool,
        typer.Option("--save", help="Save scan results to database")
    ] = True,
) -> None:
    """
    🔍 Scan a directory and discover all your files.
    
    This is the first step - Aether looks at all your files
    and tries to understand them.
    """
    print_welcome()
    
    # Default to current directory
    target_dir = directory or Path.cwd()
    
    if not target_dir.exists():
        print_error(f"Directory not found: {target_dir}")
        raise typer.Exit(1)
    
    print_info(f"Scanning: {target_dir}")
    print_thinking("Discovering files...")
    
    # Create scanner
    scanner = FileScanner(
        target_path=target_dir,
        include_hidden=include_hidden,
    )
    
    # Scan with progress bar
    files = []
    with create_progress() as progress:
        task = progress.add_task("Scanning...", total=None)
        
        for scanned_file in scanner.scan():
            files.append(scanned_file)
            progress.update(task, description=f"Scanning... ({len(files)} files)")
    
    # Show summary
    summary = scanner.get_summary()
    print_scan_summary(
        files_count=summary["files_found"],
        total_size=summary["total_size_formatted"],
        errors=summary["errors"],
        target_path=str(target_dir),
    )
    
    # Show file preview
    if files:
        print_file_table(files, limit=15)
    
    # Save to database if requested
    if save and files:
        print_thinking("Saving to database...")
        
        db = get_database()
        reader = get_reader()
        
        with create_progress() as progress:
            task = progress.add_task("Saving...", total=len(files))
            
            for scanned_file in files:
                # Read file content
                content = reader.read_file(scanned_file.path, max_chars=500)
                
                # Create database record
                file_record = FileRecord(
                    filepath=str(scanned_file.path),
                    filename=scanned_file.name,
                    file_hash=scanned_file.hash,
                    extension=scanned_file.extension,
                    file_type=scanned_file.file_type,
                    size_bytes=scanned_file.size_bytes,
                    content_preview=content[:200] if content else None,
                    has_readable_content=bool(content),
                    created_at=scanned_file.created_at,
                    modified_at=scanned_file.modified_at,
                )
                
                # Save to database
                db.add_file(file_record)
                
                progress.update(task, advance=1)
        
        print_success(f"Saved {len(files)} files to database!")


@app.command()
def think(
    provider: Annotated[
        Optional[str],
        typer.Option(help="AI provider: 'ollama' or 'openai'")
    ] = None,
) -> None:
    """
    🧠 Let AI think about how to organize your files.
    
    Aether's AI brain analyzes your files and suggests
    the perfect folder structure.
    """
    print_welcome()
    
    db = get_database()
    all_files = db.get_all_files()
    
    if not all_files:
        print_error("No files in database. Run 'aether scan' first!")
        raise typer.Exit(1)
    
    print_info(f"Analyzing {len(all_files)} files...")
    print_thinking("AI is thinking hard...")
    
    # Initialize AI thinker
    thinker = get_thinker()
    
    if not thinker.available:
        print_error(f"AI not available: {thinker.error}")
        print_info("Falling back to rule-based categorization...")
    
    # Categorize files
    reader = get_reader()
    categorized = {}
    
    with create_progress() as progress:
        task = progress.add_task("Categorizing...", total=len(all_files))
        
        for file_record in all_files:
            # Get AI's opinion
            result = thinker.categorize_file(
                filename=file_record.filename,
                content=file_record.content_preview,
                file_type=file_record.file_type,
            )
            
            # Update database record
            file_record.category = result["category"]
            file_record.ai_confidence = result["confidence"]
            file_record.ai_reasoning = result["reasoning"]
            
            db.update_file(file_record)
            
            # Track categories
            category = result["category"]
            if category not in categorized:
                categorized[category] = []
            categorized[category].append(file_record.filename)
            
            progress.update(task, advance=1)
    
    print_success("AI analysis complete!")
    print_info(f"Suggested {len(categorized)} categories")
    
    # Show preview
    preview_dict = {cat: files[:10] for cat, files in categorized.items()}
    print_organization_preview(preview_dict)


@app.command()
def organize(
    directory: Annotated[
        Optional[Path],
        typer.Argument(help="Directory to organize (default: current directory)")
    ] = None,
    dry_run: Annotated[
        bool,
        typer.Option("--dry-run/--execute", help="Preview only or actually organize")
    ] = True,
    force: Annotated[
        bool,
        typer.Option("--force", help="Skip confirmation prompt")
    ] = False,
) -> None:
    """
    🗂️ Organize files into beautiful folders.
    
    By default, this is a dry-run (preview only).
    Use --execute to actually move files.
    """
    print_welcome()
    
    target_dir = directory or Path.cwd()
    
    db = get_database()
    all_files = db.get_all_files()
    
    if not all_files:
        print_error("No files in database. Run 'aether scan' and 'aether think' first!")
        raise typer.Exit(1)
    
    # Check if files have categories
    uncategorized = [f for f in all_files if not f.category]
    if uncategorized:
        print_warning(f"{len(uncategorized)} files don't have categories yet.")
        print_info("Run 'aether think' first to categorize them!")
    
    # Create organizer
    organizer = FileOrganizer(target_directory=target_dir, dry_run=dry_run)
    
    # Build file list
    file_categories = {}
    for file_record in all_files:
        if file_record.category:
            file_path = Path(file_record.filepath)
            if file_path.exists():
                file_categories[file_path] = (file_record.category, None)
    
    if not file_categories:
        print_error("No files ready to organize!")
        raise typer.Exit(1)
    
    # Show what we're about to do
    print_info(f"Ready to organize {len(file_categories)} files")
    
    # Ask for confirmation (unless forced or dry-run)
    if not dry_run and not force:
        if not ask_confirmation("Ready to organize? This will move files!", default=False):
            print_info("Cancelled. Nothing was changed.")
            raise typer.Exit(0)
    
    # Organize!
    with create_progress() as progress:
        task = progress.add_task("Organizing...", total=len(file_categories))
        
        for file_path, (category, subcategory) in file_categories.items():
            organizer.organize_file(file_path, category, subcategory)
            progress.update(task, advance=1)
    
    # Show results
    summary = organizer.get_summary()
    print_organize_summary(summary)
    
    # Show preview
    if dry_run:
        preview = organizer.get_preview()
        print_organization_preview(preview)
        print_info("Run with --execute to actually organize files!")
    else:
        # Save undo information
        undo_file = organizer.save_undo_info()
        print_success(f"Undo info saved: {undo_file}")
        print_info("Run 'aether undo' if you want to reverse this!")


@app.command()
def find(
    query: Annotated[str, typer.Argument(help="What to search for")],
    limit: Annotated[int, typer.Option(help="Maximum results")] = 20,
) -> None:
    """
    🔎 Find files with natural language.
    
    Examples:
      aether find "tax documents 2024"
      aether find "machine learning papers"
      aether find "vacation photos"
    """
    print_welcome()
    print_info(f"Searching for: {query}")
    
    searcher = get_searcher()
    results = searcher.search(query, limit=limit)
    
    print_search_results(results)


@app.command()
def stats() -> None:
    """
    📊 Show statistics about your file collection.
    """
    print_welcome()
    
    db = get_database()
    stats_dict = db.get_statistics()
    
    print_statistics(stats_dict)


@app.command()
def undo(
    directory: Annotated[
        Optional[Path],
        typer.Argument(help="Directory to undo (default: current directory)")
    ] = None,
) -> None:
    """
    ⏮️ Undo the last organization.
    
    Reverses file movements and restores original structure.
    """
    print_welcome()
    
    target_dir = directory or Path.cwd()
    
    # Find undo files
    undo_files = find_undo_files(target_dir)
    
    if not undo_files:
        print_error("No undo information found!")
        print_info("Nothing to undo.")
        raise typer.Exit(1)
    
    # Use most recent undo file
    undo_file = undo_files[0]
    print_info(f"Found undo file: {undo_file.name}")
    
    # Confirm
    if not ask_confirmation("Undo the last organization?", default=True):
        print_info("Cancelled.")
        raise typer.Exit(0)
    
    # Perform undo
    print_thinking("Reversing organization...")
    organizer = FileOrganizer(target_directory=target_dir, dry_run=False)
    restored = organizer.undo(undo_file)
    
    print_success(f"Restored {restored} files to their original locations!")


@app.command()
def config_cmd() -> None:
    """
    ⚙️ Show current configuration.
    """
    print_welcome()
    
    config = get_config()
    config_dict = config.get_display_config()
    
    print_config(config_dict)


@app.command()
def version() -> None:
    """
    Show Aether version.
    """
    from . import __version__
    print_success(f"Aether version {__version__}")


# Main entry point
def main() -> None:
    """Main entry point for the CLI"""
    app()


if __name__ == "__main__":
    main()
