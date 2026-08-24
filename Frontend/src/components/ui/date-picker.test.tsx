import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DatePicker } from '@/components/ui/date-picker'

afterEach(cleanup)

describe('DatePicker', () => {
  it('returns an unchanged YYYY-MM-DD wire value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker
        id="uploaded-from"
        aria-label="Uploaded from"
        value="2026-08-24"
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Uploaded from' }))
    const dayButton = within(screen.getByRole('grid'))
      .getAllByRole('button')
      .find((button) => button.textContent === '25')
    expect(dayButton).toBeDefined()
    await user.click(dayButton!)
    expect(onChange).toHaveBeenCalledWith('2026-08-25')
  })

  it('preserves the local date-time shape when time changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker
        id="performed-at"
        aria-label="Performed at"
        kind="datetime-local"
        value="2026-08-24T09:30"
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Performed at' }))
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '18:45' } })
    expect(onChange).toHaveBeenCalledWith('2026-08-24T18:45')
  })
})
