import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FileItem {
  id: string
  name: string
  path: string
  type: string
  size: number
  content?: string
  extractedText?: string
  category?: string
  tags?: string[]
  embedding?: number[]
}

export interface OrganizedStructure {
  [category: string]: {
    [subcategory: string]: {
      [folder: string]: FileItem[]
    }
  }
}

interface AppState {
  // Files
  files: FileItem[]
  setFiles: (files: FileItem[]) => void
  addFiles: (files: FileItem[]) => void

  // Processing
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  processingMessage: string
  setProcessingMessage: (message: string) => void
  progress: number
  setProgress: (progress: number) => void

  // Organization
  organizedStructure: OrganizedStructure | null
  setOrganizedStructure: (structure: OrganizedStructure) => void

  // Collection
  collectionId: string | null
  setCollectionId: (id: string | null) => void

  // Navigation
  currentView: 'landing' | 'workspace' | 'preview' | 'success'
  setCurrentView: (view: AppState['currentView']) => void

  // Reset
  reset: () => void

  // Settings
  settings: {
    cursorTrail: boolean
    particles: boolean
    clientSideProcessing: boolean
    saveHistory: boolean
  }
  toggleSetting: (key: keyof AppState['settings']) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Files
      files: [],
      setFiles: (files) => set({ files }),
      addFiles: (newFiles) => set((state) => ({ files: [...state.files, ...newFiles] })),

      // Processing
      isProcessing: false,
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      processingMessage: '',
      setProcessingMessage: (processingMessage) => set({ processingMessage }),
      progress: 0,
      setProgress: (progress) => set({ progress }),

      // Organization
      organizedStructure: null,
      setOrganizedStructure: (organizedStructure) => set({ organizedStructure }),

      // Collection
      collectionId: null,
      setCollectionId: (collectionId) => set({ collectionId }),

      // Navigation
      currentView: 'landing',
      setCurrentView: (currentView) => set({ currentView }),

      // Reset
      reset: () =>
        set({
          files: [],
          isProcessing: false,
          processingMessage: '',
          progress: 0,
          organizedStructure: null,
          collectionId: null,
          currentView: 'landing',
        }),

      // Settings
      settings: {
        cursorTrail: true,
        particles: true,
        clientSideProcessing: true,
        saveHistory: true,
      },
      toggleSetting: (key) =>
        set((state) => ({
          settings: { ...state.settings, [key]: !state.settings[key] },
        })),
    }),
    {
      name: 'lumina-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)
