# Project Architecture Flowchart

```mermaid
graph TD
    User((User))
    
    subgraph "Aether System"
        
        subgraph "UI Module"
            CLI[Main Module (CLI)]
            Beauty[Beauty (Rich UI)]
        end
        
        subgraph "Brain Module"
            Scanner[File Scanner]
            Reader[File Reader]
            Thinker[AI Thinker]
            Organizer[File Organizer]
            Searcher[Smart Searcher]
        end
        
        subgraph "Storage Module"
            DB[(Database - SQLModel)]
            VectorDB[(Vector Memory - ChromaDB)]
        end
        
        subgraph "External"
            LLM[LLM Provider (Ollama/OpenAI)]
        end

        %% User Interactions
        User -->|Commands: scan, think, organize, find| CLI
        CLI -->|Display Output| Beauty
        Beauty -->|Visuals| User

        %% Main Flow
        CLI -->|1. Scan| Scanner
        CLI -->|2. Read Content| Reader
        CLI -->|3. Analyze| Thinker
        CLI -->|4. Organize| Organizer
        CLI -->|5. Search| Searcher

        %% Data Flow
        Scanner -->|File Metadata| DB
        Reader -->|Text Content| Thinker
        Thinker -->|Prompt| LLM
        LLM -->|JSON Response| Thinker
        Thinker -->|Category/Tags| DB
        Reader -->|Content| VectorDB
        
        %% Search Flow
        Searcher -->|Query| DB
        Searcher -->|Semantic Query| VectorDB
        
        %% Organization Flow
        Organizer -->|Move/Copy| FileSystem[File System]
        Organizer -->|Log Action| DB
    end
```
