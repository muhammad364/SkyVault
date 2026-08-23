import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminEmailConfigurationDialog } from '@/features/admin/components/AdminEmailConfigurationDialog'
import { AdminPlanDialog } from '@/features/admin/components/AdminPlanDialog'
import {
  useCreateAdminPlan,
  useCreateEmailConfiguration,
  useUpdateAdminPlan,
  useUpdateEmailConfiguration,
} from '@/features/admin/hooks/useAdminMutations'

vi.mock('@/features/admin/hooks/useAdminMutations')

const createPlan = vi.fn()
const createEmail = vi.fn()

function mutation(mutate: ReturnType<typeof vi.fn>) {
  return { mutate, isPending: false }
}

afterEach(cleanup)

describe('admin contract forms', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateAdminPlan).mockReturnValue(
      mutation(createPlan) as unknown as ReturnType<typeof useCreateAdminPlan>,
    )
    vi.mocked(useUpdateAdminPlan).mockReturnValue(
      mutation(vi.fn()) as unknown as ReturnType<typeof useUpdateAdminPlan>,
    )
    vi.mocked(useCreateEmailConfiguration).mockReturnValue(
      mutation(createEmail) as unknown as ReturnType<typeof useCreateEmailConfiguration>,
    )
    vi.mocked(useUpdateEmailConfiguration).mockReturnValue(
      mutation(vi.fn()) as unknown as ReturnType<typeof useUpdateEmailConfiguration>,
    )
  })

  it('submits only the exact storage-plan request fields after Zod validation', async () => {
    const user = userEvent.setup()
    render(<AdminPlanDialog open onOpenChange={vi.fn()} />)

    await user.type(screen.getByLabelText('Plan name'), 'Archive')
    await user.clear(screen.getByLabelText('Storage size (GB)'))
    await user.type(screen.getByLabelText('Storage size (GB)'), '500')
    await user.clear(screen.getByLabelText('Price (PKR)'))
    await user.type(screen.getByLabelText('Price (PKR)'), '1200')
    await user.click(screen.getByRole('button', { name: 'Save plan' }))

    await waitFor(() =>
      expect(createPlan).toHaveBeenCalledWith(
        {
          name: 'Archive',
          storageSizeGb: 500,
          price: 1200,
          billingCycle: 1,
          isActive: true,
        },
        expect.any(Object),
      ),
    )
  })

  it('keeps SMTP password write-only and normalizes optional request strings to null', async () => {
    const user = userEvent.setup()
    render(<AdminEmailConfigurationDialog open onOpenChange={vi.fn()} />)

    await user.type(screen.getByLabelText('SMTP host'), 'smtp.example.com')
    await user.type(screen.getByLabelText('Sender email'), 'mail@example.com')
    await user.type(screen.getByLabelText('SMTP username'), 'mailer')
    await user.type(screen.getByLabelText('SMTP password'), 'secret-value')
    await user.click(screen.getByRole('button', { name: 'Save configuration' }))

    await waitFor(() =>
      expect(createEmail).toHaveBeenCalledWith(
        {
          smtpHost: 'smtp.example.com',
          smtpPort: 587,
          useSsl: true,
          requiresAuthentication: true,
          senderEmail: 'mail@example.com',
          senderDisplayName: null,
          username: 'mailer',
          password: 'secret-value',
          isActive: true,
        },
        expect.any(Object),
      ),
    )
    expect(screen.queryByDisplayValue('secret-value')).toHaveAttribute('type', 'password')
  })
})
