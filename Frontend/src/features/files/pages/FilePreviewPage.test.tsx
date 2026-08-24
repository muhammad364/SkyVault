import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFilePreview } from '@/features/files/hooks/useFilePreview'
import { useUserFiles } from '@/features/files/hooks/useUserFiles'
import FilePreviewPage from '@/features/files/pages/FilePreviewPage'

const cancel = vi.fn()
const retry = vi.fn()
const downloadFile = vi.fn()

vi.mock('@/features/files/hooks/useFilePreview')
vi.mock('@/features/files/hooks/useUserFiles')
vi.mock('@/features/files/components/FileOperationProvider', () => ({
  useFileOperations: () => ({ downloadFile }),
}))

function renderPage() {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/vault/preview/file-id',
          state: {
            fileName: 'A very long owned file name.png',
            returnTo: '/vault/search?query=file',
          },
        },
      ]}
    >
      <Routes>
        <Route path="/vault/preview/:fileId" element={<FilePreviewPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('FilePreviewPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUserFiles).mockReturnValue({ data: [] } as unknown as ReturnType<
      typeof useUserFiles
    >)
    Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: false })
  })
  afterEach(cleanup)

  it('renders safe content and keeps download and return navigation available', async () => {
    const user = userEvent.setup()
    vi.mocked(useFilePreview).mockReturnValue({
      status: 'success',
      progress: 100,
      blob: new Blob(['image'], { type: 'image/png' }),
      url: 'blob:preview',
      text: null,
      error: '',
      cancel,
      retry,
    })

    renderPage()
    expect(screen.getByRole('heading', { name: 'A very long owned file name.png' })).toHaveClass(
      'truncate',
    )
    expect(
      screen.getByRole('img', { name: /preview of a very long owned file/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to files' })).toHaveAttribute(
      'href',
      '/vault/search?query=file',
    )
    await user.click(screen.getByRole('button', { name: 'Download' }))
    expect(downloadFile).toHaveBeenCalledWith('file-id', 'A very long owned file name.png')
  })

  it('exposes cancellation inside the page instead of the operation dock', async () => {
    const user = userEvent.setup()
    vi.mocked(useFilePreview).mockReturnValue({
      status: 'preparing',
      progress: null,
      blob: null,
      url: null,
      text: null,
      error: '',
      cancel,
      retry,
    })

    renderPage()
    await user.click(screen.getByRole('button', { name: 'Cancel preview' }))
    expect(cancel).toHaveBeenCalledOnce()
  })

  it('enters and exits browser fullscreen only when the capability is available', async () => {
    const user = userEvent.setup()
    const requestFullscreen = vi.fn(async function (this: HTMLElement) {
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        value: this,
      })
      document.dispatchEvent(new Event('fullscreenchange'))
    })
    const exitFullscreen = vi.fn(async () => {
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        value: null,
      })
      document.dispatchEvent(new Event('fullscreenchange'))
    })
    Object.defineProperties(document, {
      fullscreenEnabled: { configurable: true, value: true },
      fullscreenElement: { configurable: true, value: null },
      exitFullscreen: { configurable: true, value: exitFullscreen },
    })
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    })
    vi.mocked(useFilePreview).mockReturnValue({
      status: 'success',
      progress: 100,
      blob: new Blob(['text'], { type: 'text/plain' }),
      url: null,
      text: 'Safe preview',
      error: '',
      cancel,
      retry,
    })

    renderPage()
    await user.click(screen.getByRole('button', { name: 'Full screen' }))
    expect(requestFullscreen).toHaveBeenCalledOnce()
    await user.click(screen.getByRole('button', { name: 'Exit full screen' }))
    expect(exitFullscreen).toHaveBeenCalledOnce()
  })
})
