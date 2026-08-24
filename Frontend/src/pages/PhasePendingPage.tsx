import { Archive, FolderOpen, LockKeyhole, Search } from 'lucide-react'
import { EmptyState } from '@/components/feedback/EmptyState'

const icons = [FolderOpen, Search, Archive, LockKeyhole]

export function PhasePendingPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <EmptyState
        title="This part of your vault is ready for the next phase."
        description="The shell, navigation, and resilience layer are in place. Feature data will connect only when its real API phase begins."
      />
      <aside className="grid grid-cols-2 gap-4" aria-label="Upcoming vault areas">
        {icons.map((Icon, index) => (
          <div
            key={index}
            className="flex min-h-32 items-center justify-center rounded-lg bg-card p-6 shadow-rest"
          >
            <Icon aria-hidden="true" size={24} className="text-primary" />
          </div>
        ))}
      </aside>
    </section>
  )
}

export default PhasePendingPage
