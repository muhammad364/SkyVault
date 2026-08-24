import { SafeContentViewer } from '@/features/files/components/SafeContentViewer'

export function SharedContentViewer({
  blob,
  url,
  text,
}: {
  blob: Blob
  url: string | null
  text: string | null
}) {
  return <SafeContentViewer blob={blob} url={url} text={text} title="shared file" />
}
