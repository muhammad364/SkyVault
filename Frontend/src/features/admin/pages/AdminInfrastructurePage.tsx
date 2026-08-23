import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'
import { AdminProvidersSection } from '@/features/admin/components/AdminProvidersSection'
import { AdminStorageAccountsSection } from '@/features/admin/components/AdminStorageAccountsSection'

export default function AdminInfrastructurePage() {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <AdminPageHeader
        eyebrow="Storage infrastructure"
        title="Providers and physical capacity."
        description="Manage the real provider registry and storage-account capacity contracts. Provider state governs whether associated accounts can be activated."
      />
      <AdminProvidersSection />
      <AdminStorageAccountsSection />
    </div>
  )
}
