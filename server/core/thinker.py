"""
AI Thinker - The brain that creates perfect organization
"""
from typing import List, Dict, Any
import json
from config import settings
from core.scanner import FileScanner


class AIThinker:
    """Uses LLM to create intelligent file organization"""

    def __init__(self):
        self.use_ollama = settings.USE_OLLAMA

        if not self.use_ollama:
            # OpenAI
            try:
                from openai import AsyncOpenAI
                self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                self.model = settings.OPENAI_MODEL
            except Exception as e:
                print(f"Warning: OpenAI not available: {e}")
                self.client = None
        else:
            # Ollama
            try:
                import httpx
                self.client = httpx.AsyncClient(base_url=settings.OLLAMA_BASE_URL)
                self.model = settings.OLLAMA_MODEL
            except Exception as e:
                print(f"Warning: Ollama not available: {e}")
                self.client = None

    async def organize_files(self, files: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Use AI to create perfect organization structure
        Returns: { Category: { Subcategory: { Folder: [files] } } }
        """
        print(f"🧠 AI Thinker analyzing {len(files)} files...")

        # Analyze file collection
        stats = FileScanner.analyze_files(files)

        # Create file summary for AI
        file_summaries = []
        for file in files[:500]:  # Limit to first 500 files for AI analysis
            summary = {
                "name": file["name"],
                "type": file["type"],
                "category": FileScanner.get_file_category(file["name"]),
                "has_text": bool(file.get("extractedText")),
            }
            if file.get("extractedText"):
                summary["preview"] = file["extractedText"][:200]
            file_summaries.append(summary)

        # Build prompt for LLM
        prompt = self._build_organization_prompt(file_summaries, stats)

        # Get AI response
        if self.client:
            print("🤖 Sending request to AI model...")
            structure = await self._get_ai_organization(prompt)
            print(f"🤖 AI Response Structure: {json.dumps(structure, indent=2)}")
        else:
            print("⚠️ No AI client available, using fallback...")
            # Fallback: rule-based organization
            structure = self._fallback_organization(files)

        # Map files to structure
        organized = self._map_files_to_structure(files, structure)
        print(f"📦 Final Organized Structure: {json.dumps(organized, indent=2)}")

        return organized

    def _build_organization_prompt(
        self, file_summaries: List[Dict], stats: Dict
    ) -> str:
        """Build prompt for AI organization"""
        return f"""You are LUMINA, an AI that creates perfect file organization.

Analyze these {stats['total_files']} files and create a beautiful, intuitive 3-level folder structure.

File Statistics:
{json.dumps(stats, indent=2)}

Sample Files (first 50):
{json.dumps(file_summaries[:50], indent=2)}

Your task:
1. Create 3-7 main categories (e.g., "Work", "Personal", "Creative", "Finance", "Education")
2. Each category should have 2-5 subcategories
3. Each subcategory should have 1-3 specific folders
4. NEVER use generic names like "Misc", "Other", "Unsorted"
5. Names should be clear, professional, and human-friendly
6. Think about how a real person would want to find these files

Return ONLY valid JSON in this exact format:
{{
  "structure": {{
    "Category Name": {{
      "Subcategory Name": [
        "Folder Name 1",
        "Folder Name 2"
      ]
    }}
  }},
  "rules": {{
    "file_name_pattern": "Category/Subcategory/Folder",
    "example_1": "Code/Web Development/React Components",
    "example_2": "Finance/2024/Invoices",
    "example_3": "Education/Syllabus/Computer Science",
    "important": "Group similar items together based on context (e.g., 'dsa syllabus' and 'cpp syllabus' go to Education/Syllabus)"
  }}
}}

Be creative and thoughtful. Make it beautiful."""

    async def _get_ai_organization(self, prompt: str) -> Dict[str, Any]:
        """Get organization structure from AI"""
        try:
            if not self.use_ollama:
                # OpenAI
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are LUMINA, an expert at organizing files. Always return valid JSON.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    temperature=settings.TEMPERATURE,
                    max_tokens=settings.MAX_TOKENS,
                )
                content = response.choices[0].message.content
            else:
                # Ollama
                response = await self.client.post(
                    "/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "format": "json",
                    },
                    timeout=60.0,
                )
                data = response.json()
                content = data.get("response", "{}")

            # Parse JSON
            # Clean content if it contains markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
                
            result = json.loads(content)
            return result.get("structure", {})

        except Exception as e:
            print(f"Error getting AI organization: {e}")
            return {}

    def _fallback_organization(self, files: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Fallback rule-based organization"""
        structure = {
            "Documents": {
                "Text Files": ["Notes", "Reports"],
                "PDFs": ["Manuals", "Articles"],
            },
            "Media": {
                "Images": ["Photos", "Screenshots"],
                "Videos": ["Recordings", "Clips"],
                "Audio": ["Music", "Podcasts"],
            },
            "Code": {
                "Source Code": ["Python", "JavaScript", "Other"],
                "Web Files": ["HTML", "CSS"],
            },
            "Data": {
                "Spreadsheets": ["Excel Files", "CSV Files"],
                "Databases": ["JSON", "XML"],
            },
            "Archives": {
                "Compressed Files": ["ZIP Files", "Archives"],
            },
        }
        return structure

    def _map_files_to_structure(
        self, files: List[Dict[str, Any]], structure: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Map actual files to the structure"""
        organized = {}

        # Initialize structure
        for category, subcategories in structure.items():
            organized[category] = {}
            for subcategory, folders in subcategories.items():
                organized[category][subcategory] = {}
                for folder in folders:
                    organized[category][subcategory][folder] = []

        # Smart file mapping
        for file in files:
            file_name = file["name"].lower()
            file_ext = file["type"].lower()
            placed = False

            # 1. Try to match based on AI structure names
            for category in organized:
                if placed: break
                for subcategory in organized[category]:
                    if placed: break
                    for folder in organized[category][subcategory]:
                        # Check if folder/subcategory/category name is in filename
                        # e.g. "invoice" in "invoice_2024.pdf" -> Finance/Invoices
                        if (folder.lower() in file_name or 
                            subcategory.lower() in file_name or 
                            category.lower() in file_name):
                            organized[category][subcategory][folder].append(file)
                            placed = True
                            break

            # 2. If not placed, try to match based on extension/type
            if not placed:
                for category in organized:
                    if placed: break
                    for subcategory in organized[category]:
                        if placed: break
                        for folder in organized[category][subcategory]:
                            # Heuristic matching
                            target = f"{category} {subcategory} {folder}".lower()
                            
                            if "code" in target and file_ext in ["js", "ts", "jsx", "tsx", "py", "html", "css"]:
                                organized[category][subcategory][folder].append(file)
                                placed = True
                                break
                            elif "image" in target and file_ext in ["jpg", "png", "jpeg", "svg"]:
                                organized[category][subcategory][folder].append(file)
                                placed = True
                                break
                            elif "finance" in target and ("invoice" in file_name or "receipt" in file_name):
                                organized[category][subcategory][folder].append(file)
                                placed = True
                                break
                            elif "syllabus" in target and "syllabus" in file_name:
                                organized[category][subcategory][folder].append(file)
                                placed = True
                                break

            # 3. Fallback: Put in first available folder of appropriate category if possible
            if not placed:
                # Try to find a "Misc" or "General" folder, or just the first one
                first_cat = list(organized.keys())[0]
                first_sub = list(organized[first_cat].keys())[0]
                first_folder = list(organized[first_cat][first_sub].keys())[0]
                organized[first_cat][first_sub][first_folder].append(file)

        # Remove empty folders
        cleaned = {}
        for category, subcategories in organized.items():
            cleaned[category] = {}
            for subcategory, folders in subcategories.items():
                cleaned[category][subcategory] = {}
                for folder, file_list in folders.items():
                    if file_list:
                        cleaned[category][subcategory][folder] = file_list
                # Remove empty subcategories
                if not cleaned[category][subcategory]:
                    del cleaned[category][subcategory]
            # Remove empty categories
            if not cleaned[category]:
                del cleaned[category]

        return cleaned
