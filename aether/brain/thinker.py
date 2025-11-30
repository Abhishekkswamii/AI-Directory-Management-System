"""
🧠 AI Thinker
=============

The brain that understands and categorizes your files.
Uses AI to make intelligent decisions about organization.
"""

from pathlib import Path
from typing import Optional, Literal
import json

from ..config import get_config


class AIThinker:
    """
    The intelligent brain of Aether.
    
    Uses AI (Ollama or OpenAI) to understand file content
    and suggest perfect organization strategies.
    """
    
    def __init__(self, provider: Optional[Literal["ollama", "openai"]] = None):
        """
        Initialize the AI brain.
        
        Args:
            provider: Which AI to use ('ollama' or 'openai'). 
                     If None, uses config default.
        """
        self.config = get_config()
        self.provider = provider or self.config.ai_provider
        
        # Initialize the appropriate AI client
        self._init_client()
    
    def _init_client(self) -> None:
        """Initialize AI client based on provider"""
        if self.provider == "openai":
            try:
                import openai
                self.client = openai.OpenAI(api_key=self.config.openai_api_key)
                self.available = True
            except Exception as e:
                self.available = False
                self.error = f"OpenAI initialization failed: {str(e)}"
        
        elif self.provider == "ollama":
            try:
                import requests
                # Test Ollama connection
                response = requests.get(f"{self.config.ollama_host}/api/tags", timeout=2)
                self.available = response.status_code == 200
                if not self.available:
                    self.error = "Ollama is not running"
            except Exception as e:
                self.available = False
                self.error = f"Ollama connection failed: {str(e)}"
        
        else:
            self.available = False
            self.error = f"Unknown provider: {self.provider}"
    
    def categorize_file(
        self,
        filename: str,
        content: Optional[str] = None,
        file_type: Optional[str] = None,
    ) -> dict[str, any]:
        """
        Use AI to determine the best category for a file.
        
        Args:
            filename: Name of the file
            content: Extracted text content (optional but helpful)
            file_type: Type of file (pdf, image, etc.)
            
        Returns:
            Dictionary with:
                - category: Suggested folder name
                - confidence: How confident AI is (0.0 to 1.0)
                - reasoning: Why AI chose this category
                - subcategory: Optional more specific classification
        """
        if not self.available:
            # Fallback to simple rule-based categorization
            return self._fallback_categorize(filename, file_type)
        
        # Create a smart prompt for the AI
        prompt = self._build_categorization_prompt(filename, content, file_type)
        
        try:
            # Get AI response
            response = self._query_ai(prompt)
            
            # Parse AI response
            result = self._parse_categorization_response(response)
            return result
        
        except Exception as e:
            # Fallback on error
            return self._fallback_categorize(filename, file_type)
    
    def _build_categorization_prompt(
        self,
        filename: str,
        content: Optional[str],
        file_type: Optional[str],
    ) -> str:
        """Build a smart prompt for AI categorization"""
        
        prompt = f"""You are a file organization expert. Analyze this file and suggest the best category/folder for it.

Filename: {filename}
File Type: {file_type or "unknown"}
"""
        
        if content:
            # Include a preview of the content
            preview = content[:500] if len(content) > 500 else content
            prompt += f"\nContent Preview:\n{preview}\n"
        
        prompt += """
Please respond in JSON format with:
{
    "category": "Suggested folder name (e.g., 'Work Documents', 'Personal Photos', 'Tax Records')",
    "confidence": 0.0 to 1.0,
    "reasoning": "Brief explanation of why this category fits",
    "subcategory": "Optional more specific classification"
}

Be creative and practical. Create meaningful categories that help users find things easily.
"""
        
        return prompt
    
    def _query_ai(self, prompt: str, max_tokens: int = 500) -> str:
        """
        Send a query to the AI and get response.
        
        Args:
            prompt: The prompt to send
            max_tokens: Maximum tokens in response
            
        Returns:
            AI's text response
        """
        if self.provider == "openai":
            return self._query_openai(prompt, max_tokens)
        elif self.provider == "ollama":
            return self._query_ollama(prompt, max_tokens)
        else:
            raise ValueError(f"Unknown provider: {self.provider}")
    
    def _query_openai(self, prompt: str, max_tokens: int) -> str:
        """Query OpenAI API"""
        response = self.client.chat.completions.create(
            model=self.config.openai_model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful file organization assistant. Always respond with valid JSON."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=0.3,  # Lower temperature for more consistent results
        )
        
        return response.choices[0].message.content
    
    def _query_ollama(self, prompt: str, max_tokens: int) -> str:
        """Query Ollama API"""
        import requests
        
        response = requests.post(
            f"{self.config.ollama_host}/api/generate",
            json={
                "model": self.config.ollama_model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "num_predict": max_tokens,
                    "temperature": 0.3,
                }
            },
            timeout=30,
        )
        
        response.raise_for_status()
        return response.json()["response"]
    
    def _parse_categorization_response(self, response: str) -> dict[str, any]:
        """Parse AI's JSON response"""
        try:
            # Try to extract JSON from response
            # AI might wrap it in markdown code blocks
            if "```json" in response:
                start = response.find("```json") + 7
                end = response.find("```", start)
                response = response[start:end].strip()
            elif "```" in response:
                start = response.find("```") + 3
                end = response.find("```", start)
                response = response[start:end].strip()
            
            result = json.loads(response)
            
            # Ensure required fields
            return {
                "category": result.get("category", "Other"),
                "confidence": float(result.get("confidence", 0.5)),
                "reasoning": result.get("reasoning", "AI categorization"),
                "subcategory": result.get("subcategory"),
            }
        
        except Exception:
            # If parsing fails, return a safe default
            return {
                "category": "Other",
                "confidence": 0.3,
                "reasoning": "Unable to parse AI response",
                "subcategory": None,
            }
    
    def _fallback_categorize(
        self,
        filename: str,
        file_type: Optional[str],
    ) -> dict[str, any]:
        """
        Simple rule-based categorization when AI is unavailable.
        
        Not as smart as AI, but still helpful!
        """
        category = "Other"
        confidence = 0.7
        reasoning = "Rule-based categorization"
        
        if file_type == "pdf":
            category = "PDFs"
        elif file_type == "image":
            category = "Images"
        elif file_type == "video":
            category = "Videos"
        elif file_type == "audio":
            category = "Audio"
        elif file_type == "document":
            category = "Documents"
        elif file_type == "code":
            category = "Code"
        elif file_type == "archive":
            category = "Archives"
        
        # Check filename for hints
        filename_lower = filename.lower()
        
        if any(word in filename_lower for word in ["invoice", "receipt", "bill"]):
            category = "Financial"
            confidence = 0.8
        elif any(word in filename_lower for word in ["tax", "2024", "2023", "2025"]):
            category = "Tax Documents"
            confidence = 0.8
        elif any(word in filename_lower for word in ["resume", "cv", "cover"]):
            category = "Career"
            confidence = 0.8
        
        return {
            "category": category,
            "confidence": confidence,
            "reasoning": reasoning,
            "subcategory": None,
        }
    
    def suggest_organization_plan(
        self,
        files_by_category: dict[str, list[str]],
    ) -> dict[str, any]:
        """
        Suggest an overall organization plan for a collection of files.
        
        Args:
            files_by_category: Dictionary mapping categories to file lists
            
        Returns:
            Suggested folder structure and organization plan
        """
        if not self.available:
            return {
                "structure": files_by_category,
                "suggestions": ["AI not available - using basic categorization"],
            }
        
        # Create prompt for organization plan
        prompt = f"""You are organizing {sum(len(files) for files in files_by_category.values())} files.

Current categories:
"""
        for category, files in files_by_category.items():
            prompt += f"\n{category}: {len(files)} files"
        
        prompt += """

Suggest improvements:
1. Should any categories be merged or renamed?
2. Are there better top-level categories?
3. Should we create subcategories?

Respond in JSON format with your suggestions.
"""
        
        try:
            response = self._query_ai(prompt, max_tokens=800)
            # Parse and return suggestions
            return {
                "structure": files_by_category,
                "suggestions": [response],
            }
        except Exception:
            return {
                "structure": files_by_category,
                "suggestions": ["Using basic organization structure"],
            }


# Global instance
_thinker: Optional[AIThinker] = None


def get_thinker() -> AIThinker:
    """Get the global AI thinker instance"""
    global _thinker
    if _thinker is None:
        _thinker = AIThinker()
    return _thinker
