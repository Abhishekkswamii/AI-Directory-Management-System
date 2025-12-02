import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import Tesseract from 'tesseract.js'
import { FileItem } from '../store/useStore'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export interface ProcessedFile extends FileItem {
  extractedText?: string
  error?: string
}

/**
 * Extract text from PDF files - OPTIMIZED
 */
export async function extractPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''

    // Reduced from 10 to 3 pages for faster processing
    for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const text = content.items.map((item: any) => item.str).join(' ')
      fullText += text + '\n'
      
      // Stop if we already have enough text (2000 chars is plenty for AI)
      if (fullText.length > 2000) break
    }

    return fullText.trim()
  } catch (error) {
    console.error('PDF extraction error:', error)
    return ''
  }
}

/**
 * Extract text from Word documents (.docx)
 */
export async function extractDocxText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  } catch (error) {
    console.error('DOCX extraction error:', error)
    return ''
  }
}

/**
 * Extract text from images using OCR - DISABLED FOR SPEED
 * OCR is extremely slow and not critical for file organization
 */
export async function extractImageText(file: File): Promise<string> {
  // Disabled OCR for speed - images can be organized by name and metadata
  console.log('OCR disabled for faster processing')
  return ''
}

/**
 * Read text from plain text files - OPTIMIZED
 */
export async function extractTextFile(file: File): Promise<string> {
  try {
    const text = await file.text()
    // Return only first 2000 chars for speed
    return text.slice(0, 2000)
  } catch (error) {
    console.error('Text file extraction error:', error)
    return ''
  }
}

/**
 * Determine if a file should have text extracted
 */
export function shouldExtractText(fileName: string, mimeType: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  
  const textExtensions = [
    'txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx',
    'py', 'java', 'cpp', 'c', 'h', 'go', 'rs', 'php', 'rb', 'swift',
    'yaml', 'yml', 'toml', 'ini', 'conf', 'log', 'csv', 'sql',
  ]
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp']
  
  return (
    mimeType.startsWith('text/') ||
    textExtensions.includes(ext) ||
    mimeType === 'application/pdf' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    imageExtensions.includes(ext) ||
    mimeType.startsWith('image/')
  )
}

/**
 * Process a single file and extract text based on its type
 */
export async function processFile(file: File, path: string = ''): Promise<ProcessedFile> {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  
  const fileItem: ProcessedFile = {
    id,
    name: file.name,
    path: path || file.name,
    type: ext,
    size: file.size,
  }

  if (!shouldExtractText(file.name, file.type)) {
    return fileItem
  }

  try {
    let extractedText = ''

    // Prioritize fast extraction methods only
    if (file.type === 'application/pdf' && file.size < 5 * 1024 * 1024) {
      // Only process PDFs under 5MB for speed
      extractedText = await extractPdfText(file)
    } else if (
      (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === 'docx') && file.size < 2 * 1024 * 1024
    ) {
      // Only process DOCX under 2MB
      extractedText = await extractDocxText(file)
    } else if (file.type.startsWith('text/') && file.size < 500 * 1024) {
      // Reduced from 1MB to 500KB for faster processing
      extractedText = await extractTextFile(file)
    }
    // Images: Skip OCR entirely for speed

    fileItem.extractedText = extractedText.slice(0, 2000) // Reduced from 10k to 2k for speed
  } catch (error) {
    console.error(`Error processing ${file.name}:`, error)
    fileItem.error = error instanceof Error ? error.message : 'Unknown error'
  }

  return fileItem
}

/**
 * Process multiple files with progress callback - OPTIMIZED WITH BATCHING
 */
export async function processFiles(
  files: File[],
  onProgress?: (processed: number, total: number) => void
): Promise<ProcessedFile[]> {
  const processed: ProcessedFile[] = []
  const batchSize = 10 // Process 10 files concurrently
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize)
    
    // Process batch concurrently
    const batchResults = await Promise.all(
      batch.map(file => processFile(file))
    )
    
    processed.push(...batchResults)
    
    if (onProgress) {
      onProgress(processed.length, files.length)
    }
  }
  
  return processed
}

/**
 * Get files from directory using File System Access API
 */
export async function getFilesFromDirectory(
  dirHandle: FileSystemDirectoryHandle,
  path: string = ''
): Promise<File[]> {
  const files: File[] = []
  
  for await (const entry of dirHandle.values()) {
    const entryPath = path ? `${path}/${entry.name}` : entry.name
    
    if (entry.kind === 'file') {
      const fileHandle = entry as FileSystemFileHandle
      const file = await fileHandle.getFile()
      Object.defineProperty(file, 'webkitRelativePath', {
        value: entryPath,
        writable: false,
      })
      files.push(file)
    } else if (entry.kind === 'directory') {
      const subDirHandle = entry as FileSystemDirectoryHandle
      const subFiles = await getFilesFromDirectory(subDirHandle, entryPath)
      files.push(...subFiles)
    }
  }
  
  return files
}

/**
 * Check if File System Access API is supported
 */
export function isFileSystemAccessSupported(): boolean {
  return 'showDirectoryPicker' in window
}

/**
 * Open directory picker and get files
 */
export async function pickDirectory(): Promise<File[]> {
  try {
    if (isFileSystemAccessSupported()) {
      // @ts-ignore - File System Access API
      const dirHandle = await window.showDirectoryPicker({
        mode: 'read',
      })
      return await getFilesFromDirectory(dirHandle)
    } else {
      throw new Error('File System Access API not supported')
    }
  } catch (error) {
    console.error('Directory picker error:', error)
    throw error
  }
}
