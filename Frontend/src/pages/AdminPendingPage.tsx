import { ShieldCheck } from 'lucide-react'
import { EmptyState } from '@/components/feedback/EmptyState'

export function AdminPendingPage() {
  return (
    <EmptyState
      title="Admin routing is protected."
      description="The admin surface stays quiet until the owner explicitly opens the administration phase."
      illustration={
        <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-card-muted text-primary">
          <ShieldCheck aria-hidden="true" size={24} />
        </span>
      }
    />
  )
}

export default AdminPendingPage
