import AccountPage from '@/features/account/pages/AccountPage'
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'

export default function AdminAccountPage() {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <AdminPageHeader
        eyebrow="Admin account"
        title="Your profile and access."
        description="Update the authenticated administrator profile or change its password through the shared account endpoints."
      />
      <AccountPage context="admin" />
    </div>
  )
}
