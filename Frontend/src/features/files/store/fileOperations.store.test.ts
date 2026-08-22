import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearFileOperations,
  useFileOperationsStore,
} from '@/features/files/store/fileOperations.store'

describe('file operation cancellation boundaries', () => {
  beforeEach(clearFileOperations)

  it('cancels queued and transferring work but not submitted processing', () => {
    const controller = new AbortController()
    const abort = vi.spyOn(controller, 'abort')
    const state = useFileOperationsStore.getState()
    state.add({
      id: 'queued',
      kind: 'upload',
      label: 'queued.txt',
      status: 'queued',
      progress: null,
      cancellable: true,
      targetIds: [],
      file: new File(['retry'], 'queued.txt'),
    })
    state.add({
      id: 'transfer',
      kind: 'upload',
      label: 'transfer.txt',
      status: 'transferring',
      progress: 50,
      cancellable: true,
      targetIds: [],
    })
    state.add({
      id: 'server',
      kind: 'move',
      label: 'Move item',
      status: 'processing',
      progress: null,
      cancellable: false,
      targetIds: ['item'],
    })
    state.setController('transfer', controller)

    state.cancel('queued')
    state.cancel('transfer')
    state.cancel('server')

    expect(abort).toHaveBeenCalledOnce()
    expect(
      useFileOperationsStore.getState().operations.find((item) => item.id === 'queued')?.status,
    ).toBe('cancelled')
    expect(
      useFileOperationsStore.getState().operations.find((item) => item.id === 'server')?.status,
    ).toBe('processing')

    state.retry('queued')
    expect(
      useFileOperationsStore.getState().operations.find((item) => item.id === 'queued')?.status,
    ).toBe('queued')
  })
})
