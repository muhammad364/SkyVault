import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Select } from '@/components/ui/select'

afterEach(cleanup)

describe('Select', () => {
  it('keeps its popup viewport-bound and supports keyboard selection', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Select
        aria-label="Status"
        value="all"
        onValueChange={onValueChange}
        options={[
          { value: 'all', label: 'All statuses' },
          { value: 'active', label: 'Active' },
        ]}
      />,
    )

    const trigger = screen.getByRole('combobox', { name: 'Status' })
    await user.click(trigger)
    const listbox = screen.getByRole('listbox')
    expect(listbox).toHaveClass('max-w-[calc(100vw-1.5rem)]')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onValueChange).toHaveBeenCalledWith('active')
  })
})
