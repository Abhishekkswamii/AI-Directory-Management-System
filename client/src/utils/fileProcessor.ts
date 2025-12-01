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
 * Extract text from PDF files
 */
export async function extractPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''

    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
      // Limit to first 10 pages
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const text = content.items.map((item: any) => item.str).join(' ')
      fullText += text + '\n'
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
 * Extract text from images using OCR
 */
export async function extractImageText(file: File): Promise<string> {
  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log(m),
    })
    return result.data.text
  } catch (error) {
    console.error('OCR extraction error:', error)
    return ''
  }
}

/**
 * Read text from plain text files
 */
export async function extractTextFile(file: File): Promise<string> {
  try {
    return await file.text()
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

    if (file.type === 'application/pdf') {
      extractedText = await extractPdfText(file)
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === 'docx'
    ) {
      extractedText = await extractDocxText(file)
    } else if (file.type.startsWith('image/')) {
      // Only extract text from images if they're small (< 2MB) to avoid long processing
      if (file.size < 2 * 1024 * 1024) {
        extractedText = await extractImageText(file)
      }
    } else if (file.type.startsWith('text/') || file.size < 1024 * 1024) {
      // Extract text from text files < 1MB
      extractedText = await extractTextFile(file)
    }

    fileItem.extractedText = extractedText.slice(0, 10000) // Limit to 10k chars per file
  } catch (error) {
    console.error(`Error processing ${file.name}:`, error)
    fileItem.error = error instanceof Error ? error.message : 'Unknown error'
  }

  return fileItem
}

/**
 * Process multiple files with progress callback
 */
export async function processFiles(
  files: File[],
  onProgress?: (processed: number, total: number) => void
): Promise<ProcessedFile[]> {
  const processed: ProcessedFile[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const result = await processFile(file)
    processed.push(result)
    
    if (onProgress) {
      onProgress(i + 1, files.length)
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
