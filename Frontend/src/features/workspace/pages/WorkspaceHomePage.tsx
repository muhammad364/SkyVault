import { PlanStatusTile } from '@/features/workspace/components/PlanStatusTile'
import { QuickActionsTile } from '@/features/workspace/components/QuickActionsTile'
import { QuotaSignatureTile } from '@/features/workspace/components/QuotaSignatureTile'
import { RecentFilesTile } from '@/features/workspace/components/RecentFilesTile'
import { SharedLinksTile } from '@/features/workspace/components/SharedLinksTile'
import { TrashSummaryTile } from '@/features/workspace/components/TrashSummaryTile'
import { WorkspaceGreeting } from '@/features/workspace/components/WorkspaceGreeting'

export default function WorkspaceHomePage() {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <WorkspaceGreeting />
      <QuickActionsTile />
      <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuotaSignatureTile />
        <PlanStatusTile />
        <RecentFilesTile />
        <SharedLinksTile />
        <TrashSummaryTile />
      </div>
    </div>
  )
}
