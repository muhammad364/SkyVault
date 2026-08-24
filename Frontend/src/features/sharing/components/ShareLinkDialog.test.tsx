import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ShareLinkDialog } from '@/features/sharing/components/ShareLinkDialog'

vi.mock('@/features/sharing/hooks/useSharingMutations', () => ({
  useGenerateShareLink: () => ({ mutate: vi.fn(), isPending: false }),
}))

afterEach(cleanup)

describe('ShareLinkDialog containment', () => {
  it('keeps long file choices, dates, and form content inside the viewport-capped sheet', () => {
    render(
      <ShareLinkDialog
        open
        files={[
          {
            fileId: 'file-id',
            fileName: `${'A very long shared file name '.repeat(20)}.mp4`,
          },
        ]}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByRole('dialog')).toHaveClass('overflow-x-hidden', 'max-w-full')
    expect(screen.getByRole('combobox', { name: 'File' })).toHaveClass('min-w-0')
    expect(screen.getByRole('button', { name: /expiration optional/i })).toHaveClass('min-w-0')
  })
})
