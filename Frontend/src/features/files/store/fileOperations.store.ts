import { create } from 'zustand'

export type FileOperationKind =
  'upload' | 'replace' | 'preview' | 'download' | 'copy' | 'move' | 'delete'

export type FileOperationStatus =
  'queued' | 'transferring' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface FileOperation {
  id: string
  kind: FileOperationKind
  label: string
  status: FileOperationStatus
  progress: number | null
  cancellable: boolean
  completedCount?: number
  totalCount?: number
  error?: string
  targetIds: string[]
  stopRequested?: boolean
  file?: File
  destinationFolderId?: string | null
}

interface FileOperationsState {
  operations: FileOperation[]
  controllers: Record<string, AbortController | undefined>
  add: (operation: FileOperation) => void
  update: (id: string, changes: Partial<FileOperation>) => void
  setController: (id: string, controller?: AbortController) => void
  cancel: (id: string) => void
  retry: (id: string) => void
  stopQueued: (id: string) => void
  remove: (id: string) => void
  clearFinished: () => void
  clearAll: () => void
}

const finishedStatuses: FileOperationStatus[] = ['completed', 'failed', 'cancelled']

export const useFileOperationsStore = create<FileOperationsState>((set, get) => ({
  operations: [],
  controllers: {},
  add: (operation) => set((state) => ({ operations: [...state.operations, operation] })),
  update: (id, changes) =>
    set((state) => ({
      operations: state.operations.map((operation) =>
        operation.id === id ? { ...operation, ...changes } : operation,
      ),
    })),
  setController: (id, controller) =>
    set((state) => ({ controllers: { ...state.controllers, [id]: controller } })),
  cancel: (id) => {
    const operation = get().operations.find((candidate) => candidate.id === id)
    if (!operation) return
    if (operation.status === 'queued') {
      get().update(id, { status: 'cancelled', cancellable: false, progress: null })
      return
    }
    if (!operation.cancellable) return
    get().controllers[id]?.abort()
    get().update(id, { status: 'cancelled', cancellable: false, progress: null })
  },
  retry: (id) => {
    const operation = get().operations.find((candidate) => candidate.id === id)
    if (
      !operation ||
      !['upload', 'replace'].includes(operation.kind) ||
      !['failed', 'cancelled'].includes(operation.status) ||
      !operation.file
    ) {
      return
    }
    get().update(id, {
      status: 'queued',
      progress: null,
      cancellable: true,
      error: undefined,
      stopRequested: false,
    })
  },
  stopQueued: (id) => get().update(id, { stopRequested: true }),
  remove: (id) =>
    set((state) => {
      const controllers = { ...state.controllers }
      delete controllers[id]
      return {
        operations: state.operations.filter((operation) => operation.id !== id),
        controllers,
      }
    }),
  clearFinished: () =>
    set((state) => ({
      operations: state.operations.filter(
        (operation) => !finishedStatuses.includes(operation.status),
      ),
    })),
  clearAll: () => {
    Object.entries(get().controllers).forEach(([id, controller]) => {
      const operation = get().operations.find((candidate) => candidate.id === id)
      if (operation?.cancellable) controller?.abort()
    })
    set({ operations: [], controllers: {} })
  },
}))

export function clearFileOperations() {
  useFileOperationsStore.getState().clearAll()
}
