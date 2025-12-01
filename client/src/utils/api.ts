import axios from 'axios'
import { FileItem, OrganizedStructure } from '../store/useStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'http://localhost:8000')

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for large file processing
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.status)
    return response
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message)

    // Enhance error message
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Cannot connect to backend server. Make sure it is running on ' + API_BASE_URL
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Try with fewer files or check your connection.'
    } else if (error.response) {
      error.message = error.response.data?.detail || error.response.statusText || error.message
    }

    return Promise.reject(error)
  }
)

export interface AnalyzeRequest {
  files: FileItem[]
}

export interface AnalyzeResponse {
  collection_id: string
  organized_structure: OrganizedStructure
  total_files: number
  categories: string[]
}

/**
 * Send files to backend for AI analysis and organization
 */
export async function analyzeFiles(files: FileItem[]): Promise<AnalyzeResponse> {
  try {
    console.log(`[analyzeFiles] Sending ${files.length} files to backend`)

    const response = await api.post<AnalyzeResponse>('/api/analyze', { files })

    console.log('[analyzeFiles] Success:', response.data)
    return response.data
  } catch (error: any) {
    console.error('[analyzeFiles] Failed:', error)
    throw error
  }
}

/**
 * Search across all collections
 */
export async function searchCollections(query: string): Promise<FileItem[]> {
  const response = await api.get<{ results: FileItem[] }>('/api/search', {
    params: { query },
  })
  return response.data.results
}

/**
 * Get collection by ID
 */
export async function getCollection(collectionId: string): Promise<AnalyzeResponse> {
  const response = await api.get<AnalyzeResponse>(`/api/collections/${collectionId}`)
  return response.data
}

/**
 * Get all collections
 */
export async function getAllCollections(): Promise<any[]> {
  const response = await api.get<{ collections: any[] }>('/api/collections')
  return response.data.collections
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{ status: string }> {
  const response = await api.get<{ status: string }>('/api/health')
  return response.data
}
