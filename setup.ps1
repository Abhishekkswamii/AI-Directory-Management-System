# 🚀 Aether Quick Start Script for Windows
# Run this in PowerShell to get started quickly!

Write-Host "✨ Welcome to Aether Setup!" -ForegroundColor Cyan
Write-Host ""

# Check Python version
Write-Host "Checking Python version..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
Write-Host $pythonVersion -ForegroundColor Green

if ($pythonVersion -match "Python 3\.(1[1-9]|[2-9][0-9])") {
    Write-Host "✅ Python version is good!" -ForegroundColor Green
} else {
    Write-Host "❌ Python 3.11+ required. Please install from python.org" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow

# Check if Poetry is installed
$poetryInstalled = Get-Command poetry -ErrorAction SilentlyContinue

if ($poetryInstalled) {
    Write-Host "Using Poetry..." -ForegroundColor Green
    poetry install
    Write-Host ""
    Write-Host "✅ Installation complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To activate the environment, run:" -ForegroundColor Cyan
    Write-Host "  poetry shell" -ForegroundColor White
} else {
    Write-Host "Poetry not found. Installing with pip..." -ForegroundColor Yellow
    pip install -e .
    Write-Host ""
    Write-Host "✅ Installation complete!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Next steps:" -ForegroundColor Cyan
Write-Host "1. Install Ollama from https://ollama.ai (or get OpenAI API key)" -ForegroundColor White
Write-Host "2. Run: ollama pull llama2" -ForegroundColor White
Write-Host "3. Try: aether scan ~/Downloads" -ForegroundColor White
Write-Host "4. Then: aether think" -ForegroundColor White
Write-Host "5. Finally: aether organize --dry-run" -ForegroundColor White
Write-Host ""
Write-Host "📚 Read docs/GETTING_STARTED.md for detailed guide" -ForegroundColor Yellow
Write-Host ""
Write-Host "Made with ❤️  - Happy organizing!" -ForegroundColor Magenta
