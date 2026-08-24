import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FileOperationDock } from '@/features/files/components/FileOperationDock'
import {
  clearFileOperations,
  useFileOperationsStore,
} from '@/features/files/store/fileOperations.store'

describe('FileOperationDock hardening', () => {
  beforeEach(() => {
    clearFileOperations()
    vi.useFakeTimers()
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('keeps preview work inside the viewer and contains long visible labels', () => {
    const add = useFileOperationsStore.getState().add
    add({
      id: 'preview',
      kind: 'preview',
      label: 'Preview hidden-file.mp4',
      status: 'processing',
      progress: null,
      cancellable: true,
      targetIds: ['preview-file'],
    })
    add({
      id: 'download',
      kind: 'download',
      label: `Download ${'very-long-file-name-'.repeat(20)}.mp4`,
      status: 'transferring',
      progress: 45,
      cancellable: true,
      targetIds: ['download-file'],
    })

    render(<FileOperationDock />)
    expect(screen.queryByText('Preview hidden-file.mp4')).not.toBeInTheDocument()
    const label = screen.getByTitle(/very-long-file-name/)
    expect(label).toHaveClass('truncate')
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45')
  })

  it('removes completed and cancelled work after three seconds', () => {
    const add = useFileOperationsStore.getState().add
    add({
      id: 'complete',
      kind: 'download',
      label: 'Download report.pdf',
      status: 'completed',
      progress: 100,
      cancellable: false,
      targetIds: ['file'],
    })
    render(<FileOperationDock />)
    expect(screen.getByText('Download report.pdf')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(3000))
    expect(screen.queryByText('Download report.pdf')).not.toBeInTheDocument()
  })
})
