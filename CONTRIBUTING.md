# 🤝 Contributing to LUMINA

Thank you for your interest in contributing to LUMINA! This guide will help you get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

---

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- No harassment, discrimination, or toxic behavior

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Git
- Code editor (VS Code recommended)

### Setup

1. **Fork the repository**
```bash
# Click "Fork" on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/lumina.git
cd lumina
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

4. **Start development**
```bash
npm run dev
```

---

## 🔄 Development Workflow

### Frontend (React + TypeScript)

Location: `client/src/`

**Adding a component:**
```bash
cd client/src/components
# Create YourComponent.tsx
```

**Component template:**
```typescript
import { motion } from 'framer-motion'

interface YourComponentProps {
  // Define props
}

export function YourComponent({ }: YourComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Your content */}
    </motion.div>
  )
}
```

**Running tests:**
```bash
cd client
npm run test
```

### Backend (FastAPI + Python)

Location: `server/`

**Adding an endpoint:**
```python
# In server/main.py
@app.get("/api/your-endpoint")
async def your_endpoint():
    return {"message": "Hello"}
```

**Running tests:**
```bash
cd server
pytest
```

---

## 📝 Coding Standards

### TypeScript/React

- Use TypeScript strict mode
- Functional components with hooks
- Props interfaces for all components
- Consistent naming: `PascalCase` for components, `camelCase` for functions
- Use Tailwind CSS for styling
- Add Framer Motion for animations

**Example:**
```typescript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <motion.button
      className={`px-6 py-3 rounded-full ${
        variant === 'primary' ? 'bg-cosmic-violet' : 'bg-cosmic-cyan'
      }`}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  )
}
```

### Python/FastAPI

- Follow PEP 8 style guide
- Use type hints
- Async/await for I/O operations
- Docstrings for all functions
- Use Pydantic for validation

**Example:**
```python
from typing import List, Dict, Any
from pydantic import BaseModel

class FileItem(BaseModel):
    id: str
    name: str
    size: int

async def process_files(files: List[FileItem]) -> Dict[str, Any]:
    """
    Process and organize files.
    
    Args:
        files: List of file items to process
        
    Returns:
        Dictionary with organized structure
    """
    # Implementation
    return {"organized": True}
```

---

## 💬 Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(ui): add orbital menu component"
git commit -m "fix(api): resolve embedding generation error"
git commit -m "docs: update installation instructions"
```

---

## 🔀 Pull Request Process

1. **Update from main**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Test your changes**
```bash
# Frontend
cd client && npm run build

# Backend
cd server && pytest
```

3. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

4. **Create Pull Request**
- Go to GitHub
- Click "New Pull Request"
- Fill out the template
- Request review

**PR Title Format:**
```
feat: Add semantic search feature
```

**PR Description Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How you tested the changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] Tests pass locally
```

---

## 🏗️ Project Structure

### Key Files to Know

**Frontend:**
- `client/src/App.tsx` - Main app component
- `client/src/store/useStore.ts` - Global state
- `client/src/utils/fileProcessor.ts` - File processing logic
- `client/src/components/` - Reusable UI components

**Backend:**
- `server/main.py` - FastAPI app and routes
- `server/core/thinker.py` - AI organization logic
- `server/core/embeddings.py` - Vector embeddings
- `server/database/models.py` - Database schemas

### Adding Features

**New page:**
1. Create `client/src/pages/YourPage.tsx`
2. Add route in `client/src/App.tsx`
3. Add navigation in `client/src/components/OrbitalMenu.tsx`

**New API endpoint:**
1. Add endpoint in `server/main.py`
2. Add client function in `client/src/utils/api.ts`
3. Update `API.md` documentation

---

## 🐛 Reporting Bugs

**Before submitting:**
- Check existing issues
- Search closed issues
- Try latest version

**Bug report should include:**
- Clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
- Environment (OS, Node version, etc.)

---

## 💡 Feature Requests

We love new ideas! When requesting features:

1. **Check if it already exists** in issues/discussions
2. **Describe the problem** you're trying to solve
3. **Explain your solution** with examples
4. **Consider alternatives** you've thought of

---

## 🎨 Design Contributions

LUMINA's design is crucial to the experience. When contributing design:

- Follow the cosmic/space theme
- Use the defined color palette
- Maintain glassmorphism aesthetic
- Add smooth animations
- Ensure mobile responsiveness

**Color Palette:**
```css
Cosmic Void:    #0a0a0f
Cosmic Deep:    #0f0f1a
Cosmic Violet:  #6366f1
Cosmic Cyan:    #22d3ee
Cosmic Pink:    #ec4899
Cosmic Purple:  #a855f7
```

---

## 📚 Documentation

Documentation is as important as code! Help by:

- Fixing typos
- Clarifying confusing sections
- Adding examples
- Translating to other languages
- Creating tutorials/videos

---

## ❓ Questions?

- **General questions:** GitHub Discussions
- **Bug reports:** GitHub Issues
- **Security issues:** Email security@lumina.app
- **Chat:** Join our Discord (link)

---

## 🏆 Recognition

Contributors will be:
- Added to README credits
- Mentioned in release notes
- Invited to contributor Discord channel

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making LUMINA better! 🌟
