import { QuickActionsTile } from '@/features/workspace/components/QuickActionsTile'
import { RecentFilesTile } from '@/features/workspace/components/RecentFilesTile'
import { RootFoldersTile } from '@/features/workspace/components/RootFoldersTile'
import { SharedLinksTile } from '@/features/workspace/components/SharedLinksTile'
import { StorageOverviewTile } from '@/features/workspace/components/StorageOverviewTile'
import { TrashSummaryTile } from '@/features/workspace/components/TrashSummaryTile'
import { WorkspaceGreeting } from '@/features/workspace/components/WorkspaceGreeting'

export default function WorkspaceHomePage() {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <WorkspaceGreeting />
      <QuickActionsTile />
      <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RecentFilesTile />
        <RootFoldersTile />
        <StorageOverviewTile />
        <SharedLinksTile />
        <TrashSummaryTile />
      </div>
    </div>
  )
}
