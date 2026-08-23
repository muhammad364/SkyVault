import { Copy, Link2, ShieldOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRevokeShareLink } from '@/features/sharing/hooks/useSharingMutations'
import { publicShareUrl } from '@/features/sharing/lib/publicShareUrl'
import { sharingErrorMessage } from '@/features/sharing/lib/sharingErrorMessage'
import { formatDate, formatRelativeDate } from '@/lib/formatters'
import type { GenerateShareLinkResponse } from '@/models/sharing/GenerateShareLinkResponse'

export function ShareLinksList({
  links,
  fileNames,
  fileNamesPending,
}: {
  links: GenerateShareLinkResponse[]
  fileNames: Map<string, string>
  fileNamesPending: boolean
}) {
  const revoke = useRevokeShareLink()
  const [revokeTarget, setRevokeTarget] = useState<GenerateShareLinkResponse | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const copy = async (link: GenerateShareLinkResponse) => {
    try {
      const wrappedUrl = publicShareUrl(link.shareUrl)
      if (!wrappedUrl) throw new Error('Unrecognized share URL.')
      await navigator.clipboard.writeText(wrappedUrl)
      setNotice('View-only link copied.')
    } catch {
      setNotice("The link couldn't be copied. Open it through Create link and copy it manually.")
    }
  }

  return (
    <>
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {notice}
      </p>
      <ul className="grid gap-3 lg:grid-cols-2" aria-label="Your share links">
        {links.map((link) => (
          <li
            key={link.shareLinkId}
            className="grid min-w-0 gap-4 rounded-lg border border-border bg-card p-4"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                {link.isRevoked ? (
                  <ShieldOff aria-hidden="true" size={21} />
                ) : (
                  <Link2 aria-hidden="true" size={21} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {fileNamesPending
                    ? 'Loading file name…'
                    : (fileNames.get(link.fileId) ?? 'File name unavailable')}
                </p>
                <p
                  className={
                    link.isRevoked
                      ? 'text-sm font-semibold text-danger'
                      : 'text-sm font-semibold text-primary'
                  }
                >
                  {link.isRevoked ? 'Revoked' : 'Not revoked'}
                </p>
              </div>
            </div>
            <dl className="grid gap-2 rounded-md bg-card-muted p-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd className="font-medium text-foreground">
                  <time dateTime={link.createdAt}>{formatRelativeDate(link.createdAt)}</time>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Expiration</dt>
                <dd className="font-medium text-foreground">
                  {link.expiresAt ? (
                    <time dateTime={link.expiresAt}>{formatDate(link.expiresAt)}</time>
                  ) : (
                    'No expiry provided'
                  )}
                </dd>
              </div>
            </dl>
            {!link.isRevoked ? (
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => void copy(link)}>
                  <Copy aria-hidden="true" size={18} /> Copy link
                </Button>
                <Button
                  variant="ghost"
                  className="text-danger"
                  onClick={() => setRevokeTarget(link)}
                >
                  Revoke
                </Button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <Dialog open={revokeTarget !== null} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke this share link?</DialogTitle>
            <DialogDescription>
              Recipients using this link will no longer be able to preview or download the file.
              Revocation cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {revoke.isError ? (
            <p className="mt-4 rounded-md bg-danger-soft p-3 text-sm text-danger" role="alert">
              {sharingErrorMessage(revoke.error, "We couldn't revoke this link.")}
            </p>
          ) : null}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRevokeTarget(null)}>
              Keep link
            </Button>
            <Button
              variant="destructive"
              disabled={revoke.isPending}
              onClick={() => {
                if (!revokeTarget) return
                revoke.mutate(revokeTarget.shareLinkId, { onSuccess: () => setRevokeTarget(null) })
              }}
            >
              {revoke.isPending ? 'Revoking link' : 'Revoke link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
