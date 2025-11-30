"""
✨ Beautiful Console UI
=======================

Gorgeous output with Rich library.
Makes file organization feel like art!
"""

from typing import Optional, List, Dict
from pathlib import Path

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.tree import Tree
from rich.text import Text
from rich.prompt import Confirm
from rich import box

from ..brain.scanner import ScannedFile
from ..brain.organizer import OrganizeAction
from ..brain.searcher import SearchResult
from ..storage.database import FileRecord
from ..utils import format_file_size


# Beautiful console instance
console = Console()


def print_welcome() -> None:
    """Display a warm welcome message"""
    welcome_text = """
[bold cyan]✨ Aether[/bold cyan] - Your AI File Butler

[dim]Organizing chaos into beauty, one file at a time.[/dim]
"""
    console.print(Panel(welcome_text, box=box.ROUNDED, border_style="cyan"))


def print_config(config_dict: Dict[str, str]) -> None:
    """
    Display current configuration beautifully.
    
    Args:
        config_dict: Dictionary of config settings
    """
    table = Table(title="⚙️ Current Configuration", box=box.ROUNDED)
    table.add_column("Setting", style="cyan", no_wrap=True)
    table.add_column("Value", style="white")
    
    for key, value in config_dict.items():
        table.add_row(key, value)
    
    console.print(table)


def print_scan_summary(
    files_count: int,
    total_size: str,
    errors: int,
    target_path: str,
) -> None:
    """
    Display scan results summary.
    
    Args:
        files_count: Number of files found
        total_size: Formatted total size
        errors: Number of errors encountered
        target_path: Directory that was scanned
    """
    summary = f"""
[bold green]✅ Scan Complete![/bold green]

Found [bold]{files_count}[/bold] files
Total size: [bold]{total_size}[/bold]
Directory: [dim]{target_path}[/dim]
"""
    
    if errors > 0:
        summary += f"\n[yellow]⚠️ {errors} errors encountered[/yellow]"
    
    console.print(Panel(summary, box=box.ROUNDED, border_style="green"))


def print_file_table(files: List[ScannedFile], limit: int = 20) -> None:
    """
    Display files in a beautiful table.
    
    Args:
        files: List of ScannedFile objects
        limit: Maximum files to display
    """
    table = Table(title=f"📁 Discovered Files (showing {min(len(files), limit)} of {len(files)})", 
                  box=box.ROUNDED)
    
    table.add_column("Name", style="cyan", no_wrap=False)
    table.add_column("Type", style="magenta")
    table.add_column("Size", style="green", justify="right")
    table.add_column("Modified", style="dim")
    
    for file in files[:limit]:
        # Format modified date
        modified = file.modified_at.strftime("%Y-%m-%d")
        
        # Add row
        table.add_row(
            file.name,
            file.file_type,
            file.size_formatted,
            modified,
        )
    
    console.print(table)
    
    if len(files) > limit:
        console.print(f"[dim]... and {len(files) - limit} more files[/dim]\n")


def print_organization_preview(preview: Dict[str, List[str]]) -> None:
    """
    Display organization structure preview as a beautiful tree.
    
    Args:
        preview: Dictionary mapping categories to file lists
    """
    console.print("\n[bold cyan]📂 Organization Preview[/bold cyan]\n")
    
    tree = Tree("📁 Organized Files", style="bold cyan")
    
    for category, files in preview.items():
        category_branch = tree.add(f"📂 [cyan]{category}[/cyan] ({len(files)} files)")
        
        # Show first few files in each category
        for file in files[:5]:
            category_branch.add(f"📄 [dim]{file}[/dim]")
        
        if len(files) > 5:
            category_branch.add(f"[dim]... and {len(files) - 5} more[/dim]")
    
    console.print(tree)


def print_organize_summary(summary: Dict[str, any]) -> None:
    """
    Display organization operation summary.
    
    Args:
        summary: Dictionary with operation statistics
    """
    mode = summary.get("mode", "move").title()
    successful = summary.get("successful", 0)
    failed = summary.get("failed", 0)
    dry_run = summary.get("dry_run", False)
    
    if dry_run:
        message = f"""
[bold yellow]🔍 Dry Run Complete[/bold yellow]

This is a preview - no files were actually moved.
[bold]{successful}[/bold] files would be organized
[bold]{summary.get('categories_created', 0)}[/bold] categories would be created
"""
        border_style = "yellow"
    else:
        message = f"""
[bold green]✅ Organization Complete![/bold green]

Successfully organized [bold]{successful}[/bold] files
Created [bold]{summary.get('categories_created', 0)}[/bold] categories
Mode: [bold]{mode}[/bold]
"""
        border_style = "green"
        
        if failed > 0:
            message += f"\n[yellow]⚠️ {failed} files failed[/yellow]"
    
    console.print(Panel(message, box=box.ROUNDED, border_style=border_style))


def print_search_results(results: List[SearchResult]) -> None:
    """
    Display search results beautifully.
    
    Args:
        results: List of SearchResult objects
    """
    if not results:
        console.print("[yellow]No results found 😔[/yellow]")
        return
    
    console.print(f"\n[bold green]🔍 Found {len(results)} results![/bold green]\n")
    
    table = Table(box=box.ROUNDED)
    table.add_column("Score", style="green", justify="right", width=6)
    table.add_column("File", style="cyan", no_wrap=False)
    table.add_column("Type", style="magenta", width=10)
    table.add_column("Category", style="blue", width=15)
    table.add_column("Why?", style="dim", no_wrap=False)
    
    for result in results:
        file = result.file_record
        score_percent = f"{result.score * 100:.0f}%"
        
        table.add_row(
            score_percent,
            file.filename,
            file.file_type,
            file.category or "—",
            result.match_reason,
        )
    
    console.print(table)


def print_statistics(stats: Dict[str, any]) -> None:
    """
    Display file collection statistics.
    
    Args:
        stats: Dictionary with statistics
    """
    total_files = stats.get("total_files", 0)
    
    if total_files == 0:
        console.print("[yellow]No files in database yet![/yellow]")
        return
    
    # Overview
    total_size_formatted = format_file_size(stats.get("total_size_bytes", 0))
    
    console.print(f"\n[bold cyan]📊 Your File Collection[/bold cyan]\n")
    console.print(f"Total files: [bold]{total_files}[/bold]")
    console.print(f"Total size: [bold]{total_size_formatted}[/bold]\n")
    
    # File types table
    file_types = stats.get("file_types", {})
    if file_types:
        type_table = Table(title="By Type", box=box.SIMPLE)
        type_table.add_column("Type", style="cyan")
        type_table.add_column("Count", style="green", justify="right")
        
        for file_type, count in sorted(file_types.items(), key=lambda x: x[1], reverse=True):
            type_table.add_row(file_type.title(), str(count))
        
        console.print(type_table)
    
    # Categories table
    categories = stats.get("categories", {})
    if categories:
        console.print()
        category_table = Table(title="By Category", box=box.SIMPLE)
        category_table.add_column("Category", style="magenta")
        category_table.add_column("Count", style="green", justify="right")
        
        for category, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
            category_table.add_row(category, str(count))
        
        console.print(category_table)


def print_error(message: str) -> None:
    """
    Display an error message.
    
    Args:
        message: Error message
    """
    console.print(f"[bold red]❌ Error:[/bold red] {message}")


def print_success(message: str) -> None:
    """
    Display a success message.
    
    Args:
        message: Success message
    """
    console.print(f"[bold green]✅ {message}[/bold green]")


def print_warning(message: str) -> None:
    """
    Display a warning message.
    
    Args:
        message: Warning message
    """
    console.print(f"[bold yellow]⚠️ {message}[/bold yellow]")


def print_info(message: str) -> None:
    """
    Display an info message.
    
    Args:
        message: Info message
    """
    console.print(f"[cyan]ℹ️ {message}[/cyan]")


def ask_confirmation(message: str, default: bool = False) -> bool:
    """
    Ask user for confirmation.
    
    Args:
        message: Question to ask
        default: Default answer
        
    Returns:
        True if user confirms, False otherwise
    """
    return Confirm.ask(message, default=default)


def create_progress() -> Progress:
    """
    Create a beautiful progress bar.
    
    Returns:
        Rich Progress object
    """
    return Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TaskProgressColumn(),
        console=console,
    )


def print_thinking(message: str = "Thinking...") -> None:
    """
    Display thinking/processing indicator.
    
    Args:
        message: Message to show
    """
    console.print(f"[dim]🤔 {message}[/dim]")


def print_banner(text: str) -> None:
    """
    Print a beautiful banner.
    
    Args:
        text: Banner text
    """
    console.print(Panel(text, box=box.DOUBLE, border_style="bold cyan"))


def clear_screen() -> None:
    """Clear the console screen"""
    console.clear()
