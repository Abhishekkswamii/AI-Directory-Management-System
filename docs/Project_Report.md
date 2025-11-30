ACADEMIC TASK - 2

**Title:**
AI-Powered Directory Management System (Aether)

**Operating Systems (CSE-316)**

**By**

| Sr. No. | Registration No | Name of Student |
| :--- | :--- | :--- |
| 1 | 12408831 | Kulwinder Kour |

**Submitted To:**
[Instructor Name]
Lovely Professional University
Jalandhar, Punjab

---

# OVERVIEW

**Aether** is an advanced AI-powered directory management system designed to bring order to digital chaos. Unlike traditional file managers that rely on manual sorting, Aether leverages Large Language Models (LLMs) to intelligently analyze, categorize, and organize files based on their content and context.

The project provides a beautiful command-line interface (CLI) that allows users to scan directories, let AI "think" about the best folder structure, and automatically move files into logical categories. Beyond simple organization, Aether features a semantic search engine, allowing users to find files using natural language queries (e.g., "find my tax documents from last year") rather than exact keyword matches.

Developed in Python, Aether uses a modular architecture separating the "Brain" (AI logic), "Storage" (Database/Memory), and "UI" (User Interaction). It supports local execution with Ollama or cloud-based analysis via OpenAI, making it versatile for different privacy and performance needs.

# MODULE-WISE BREAKDOWN

Aether follows a clean, modular architecture to ensure maintainability and scalability. The system is divided into several core packages, each responsible for a specific domain of the application.

### 1. Main Module (`main.py`)
This is the entry point of the application. It utilizes the **Typer** library to define CLI commands and routes user inputs to the appropriate modules.
*   **Key Functions:**
    *   `scan()`: Initiates the file discovery process.
    *   `think()`: Triggers AI analysis to categorize files.
    *   `organize()`: Executes the file organization (move/copy) based on AI suggestions.
    *   `find()`: Performs natural language search across the file database.
    *   `undo()`: Reverts the last organization action using saved history.
    *   `stats()`: Displays visual statistics about the file collection.
*   **Responsibility:** Orchestrates the flow of data between the UI, Brain, and Storage components and handles user interaction via the command line.

### 2. Configuration & Utilities
*   **Config (`aether/config.py`):**
    *   **Class `AetherConfig`:** Manages application settings using **Pydantic**. Handles environment variables, default values for AI providers (Ollama/OpenAI), database paths, and organization preferences (move vs. copy).
*   **Utils (`aether/utils.py`):**
    *   **Functions:** `calculate_file_hash()` (SHA-256 fingerprinting), `get_file_type()` (intelligent mime-type detection), `safe_filename()` (sanitization), and `format_file_size()`.

### 3. Brain Module (`aether/brain/`)
The core intelligence of the system, responsible for processing files and making decisions.

*   **Scanner (`scanner.py`):**
    *   **Class `FileScanner`:** Recursively scans directories to discover files.
    *   **Features:** Respects `.gitignore` patterns, handles hidden files, detects symbolic links, and generates `ScannedFile` objects with metadata.
*   **Reader (`reader.py`):**
    *   **Class `FileReader`:** A universal file reader that extracts text content for AI analysis.
    *   **Capabilities:** Supports PDF (`PyPDF2`), Word (`python-docx`), Images (OCR via `pytesseract`), and various code/text formats.
*   **Thinker (`thinker.py`):**
    *   **Class `AIThinker`:** The bridge to Large Language Models.
    *   **Functionality:** Constructs prompts with file metadata and content previews, sends them to the configured AI provider (Ollama or OpenAI), and parses the JSON response to determine the optimal category and subcategory.
*   **Organizer (`organizer.py`):**
    *   **Class `FileOrganizer`:** Executes the physical organization of files.
    *   **Safety Features:**
        *   **Dry Run:** Simulates actions without moving files.
        *   **Conflict Resolution:** Automatically renames files to avoid overwrites (e.g., `file (1).txt`).
        *   **Undo System:** Records every action in a JSON log, allowing full reversal of operations.
*   **Searcher (`searcher.py`):**
    *   **Class `SmartSearcher`:** Implements a hybrid search engine.
    *   **Logic:** Combines exact filename matching, keyword search, and semantic similarity (vector search) to find files based on user queries.

### 4. Storage Module (`aether/storage/`)
Manages data persistence and state.

*   **Database (`database.py`):**
    *   **Class `Database`:** A wrapper around **SQLModel** (SQLite).
    *   **Model `FileRecord`:** Stores comprehensive metadata: paths, hashes, sizes, timestamps, AI-assigned categories, and content previews.
*   **Memory (`memory.py`):**
    *   **Class `VectorMemory`:** Manages vector embeddings using **ChromaDB**.
    *   **Purpose:** Converts file content into high-dimensional vectors, enabling the system to understand the "meaning" of files for semantic search.

### 5. UI Module (`aether/ui/`)
Provides a polished user experience in the terminal.

*   **Beauty (`beauty.py`):**
    *   **Library:** Built on top of **Rich**.
    *   **Components:**
        *   `print_file_table()`: Renders scanned files in a sortable table.
        *   `print_organization_preview()`: Shows a tree view of the proposed folder structure.
        *   `create_progress()`: Displays animated progress bars for long-running tasks.
        *   `print_statistics()`: Visualizes file distribution by type and category.

# FUNCTIONALITIES

Aether offers a comprehensive suite of tools for file management, designed to be both powerful and safe.

### 1. Intelligent File Scanning
The scanning module is the first step in the organization pipeline.
*   **Deep Recursion:** Capable of traversing deep directory structures to find every file.
*   **Smart Filtering:** Automatically ignores system files (e.g., `.DS_Store`, `Thumbs.db`), hidden directories, and temporary files to focus only on user content.
*   **Performance Optimization:** Skips files larger than 100MB (configurable) to prevent memory exhaustion and ensures fast processing even on large drives.
*   **Metadata Extraction:** Captures essential file attributes including size, creation/modification dates, and SHA-256 hashes for duplicate detection.

### 2. AI-Driven Categorization (`think` command)
This is the core innovation of Aether, replacing rigid rules with flexible AI understanding.
*   **Contextual Analysis:** Instead of just looking at file extensions, Aether reads the first 500 characters of text-based files (PDFs, Docs, Code) to understand the *content*.
*   **Prompt Engineering:** Constructs a structured prompt for the LLM (Ollama/OpenAI) containing the filename, file type, and content preview.
*   **Structured Output:** Forces the AI to respond in JSON format, providing a suggested `category`, `subcategory`, `confidence` score, and `reasoning` for the decision.
*   **Fallback Mechanism:** If the AI provider is offline or fails, the system gracefully degrades to a robust rule-based categorization engine (e.g., classifying "invoice.pdf" as "Financial" based on keywords).

### 3. Automated Organization (`organize` command)
The organizer module executes the physical restructuring of the file system.
*   **Dual Modes:**
    *   **Move Mode:** Relocates files to their new destinations (default).
    *   **Copy Mode:** Duplicates files, leaving the originals untouched for safety.
*   **Conflict Resolution:** Never overwrites existing files. If `Report.pdf` exists in the destination, Aether automatically renames the new file to `Report (2).pdf`.
*   **Dry Run:** By default, runs in "preview" mode, showing exactly what will happen without making any changes. Users must explicitly pass `--execute` to apply changes.
*   **Batch Processing:** Handles files in efficient batches, updating a real-time progress bar.

### 4. Natural Language Search (`find` command)
Aether implements a "Hybrid Search" engine that goes beyond simple filename matching.
*   **Keyword Matching:** Scores files based on the presence of query terms in the filename.
*   **Content Search:** If a file's content has been indexed, Aether searches within the document text itself.
*   **Semantic Search (Vector):** Uses embeddings (via ChromaDB) to understand the intent of the query. A search for "vacation" can find image files named "IMG_2024.jpg" if they are semantically related in the vector space.
*   **Relevance Scoring:** Combines scores from all search methods to rank results by relevance, ensuring the most likely matches appear at the top.

### 5. Safety & Undo System
Recognizing that automated file movement can be risky, Aether includes robust safety nets.
*   **Transaction Logging:** Every organization operation records a detailed JSON log file in a hidden `.aether_undo` directory.
*   **Full Reversibility:** The `undo` command reads the latest log file and reverses every action in reverse order (LIFO), restoring files to their exact original paths.
*   **Atomic Operations:** File moves are handled individually, so a failure in one file doesn't corrupt the entire batch.

### 6. Visual Analytics (`stats` command)
Provides users with insights into their digital footprint.
*   **Storage Distribution:** Visualizes which file types (Video, Audio, Documents) are consuming the most space.
*   **Category Breakdown:** Shows how files are distributed across the AI-generated categories.
*   **Rich Visuals:** Uses the **Rich** library to render colorful bar charts and tables directly in the terminal.

# TECHNOLOGY USED

Aether is built with a modern Python stack focusing on developer experience and performance:

### 1. Programming Language
*   **Python 3.10+**: Chosen for its rich ecosystem of AI and data libraries.

### 2. Libraries & Tools
*   **Typer**: For building the Command Line Interface (CLI).
*   **Rich**: For beautiful terminal formatting (colors, tables, progress bars).
*   **Pydantic**: For data validation and settings management.
*   **ChromaDB / SQLite**: For storing file metadata and vector embeddings.
*   **LangChain / OpenAI SDK**: For interfacing with Large Language Models.

### 3. Development Environment
*   **Git & GitHub**: For version control.
*   **Virtual Environment (venv)**: For dependency isolation.

# CONCLUSION AND FUTURE SCOPE

**Conclusion:**
Aether successfully demonstrates how Artificial Intelligence can be applied to everyday computing tasks like file management. By automating the tedious process of organizing files, it saves users time and reduces digital clutter. The modular design allows for easy extension, and the inclusion of semantic search transforms how users interact with their local data.

**Future Scope:**
1.  **GUI Implementation:** Develop a desktop graphical interface using Electron or PyQt.
2.  **Cloud Sync:** Integrate with Google Drive or Dropbox for cloud file organization.
3.  **Advanced Content Analysis:** Add support for image recognition (OCR) to categorize scanned documents and photos.
4.  **Plugin System:** Allow users to write custom organization rules and plugins.

# APPENDIX

## A. Problem Statement
**The Challenge of Digital Clutter**
In the modern digital age, users accumulate vast amounts of data—documents, images, code snippets, and downloads—often scattered across unstructured directories like "Desktop" or "Downloads." This disorganization leads to several critical issues:
1.  **Inefficiency:** Users waste significant time manually searching for specific files or sorting them into folders.
2.  **Data Loss:** Important documents (e.g., tax records, legal contracts) can become "lost" in a sea of irrelevant files.
3.  **Cognitive Load:** A cluttered digital environment increases stress and reduces productivity.
4.  **Scalability:** As storage capacities grow, manual organization becomes increasingly impractical.

**The Goal**
The objective is to develop an intelligent, automated system that can "understand" the content of files and organize them into a logical, human-friendly directory structure with minimal user intervention.

## B. Solution Overview
**Aether: The AI File Butler**
Aether addresses the problem of digital clutter through a four-stage pipeline:

1.  **Discovery (Scanning):** The system first maps the territory, identifying all files while respecting system boundaries (ignoring hidden files and system directories).
2.  **Cognition (Thinking):** Unlike traditional scripts that sort by extension (e.g., all `.jpg` to "Images"), Aether uses Large Language Models (LLMs) to analyze the *context*. A file named `invoice_2024.pdf` is recognized as a "Financial Document," while `vacation_2024.jpg` is categorized as "Personal Memory."
3.  **Action (Organization):** The system proposes a new structure. Users can review this plan via a "Dry Run" before any changes are made. When executed, files are moved safely, with conflict resolution ensuring no data is overwritten.
4.  **Retrieval (Search):** Post-organization, Aether provides a semantic search interface, allowing users to find files based on concepts (e.g., "work projects") rather than just keywords.

## C. Output Description
The application provides rich, visual feedback at every stage of the process:

### 1. Scan Output
*   **Visual:** A colorful summary table displaying the count of files found, total size, and a breakdown by file type (e.g., "Images: 150", "Documents: 45").
*   **Progress:** A real-time spinner indicates the scanning progress through deep directory trees.

### 2. Think Output (AI Analysis)
*   **Progress Bar:** A detailed progress bar shows the AI's processing status (e.g., "Analyzing file 45/100").
*   **Preview Tree:** Before organizing, Aether displays a hierarchical tree view of the *proposed* structure:
    ```
    📂 Organized Files
    ├── 📂 Documents
    │   ├── 📂 Financial (3 files)
    │   └── 📂 Work (12 files)
    └── 📂 Images
        └── 📂 Screenshots (5 files)
    ```

### 3. Organize Output
*   **Execution Log:** A real-time log of actions taken (e.g., "Moved `resume.pdf` -> `Documents/Career/resume.pdf`").
*   **Summary Panel:** A final success message showing the total number of files moved, categories created, and the location of the undo log.

### 4. Search Output
*   **Relevance Table:** Search results are ranked by a relevance score (0-100%) and displayed in a table showing the filename, matched category, and the "reason" for the match (e.g., "Content match", "Semantic similarity").

## D. Future Enhancements
1.  **GUI Application:** Developing a desktop application using Electron or PyQt for users uncomfortable with the command line.
2.  **Cloud Integration:** Direct integration with Google Drive, Dropbox, and OneDrive APIs to organize cloud storage.
3.  **Custom AI Models:** Fine-tuning smaller, local LLMs specifically for file organization to improve speed and privacy without relying on external APIs.
4.  **Automated Background Service:** A daemon mode that watches specific folders (like Downloads) and organizes new files instantly as they arrive.
