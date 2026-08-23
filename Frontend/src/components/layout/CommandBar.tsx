import { File, History, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/features/search/hooks/useDebouncedValue'
import { useSearchResults } from '@/features/search/hooks/useSearchResults'
import { searchRequestParams } from '@/features/search/lib/searchParams'
import {
  searchLabel,
  useSearchHistoryStore,
  type RecentSearch,
} from '@/features/search/store/searchHistory.store'
import { formatBytes } from '@/lib/formatters'
import type { SearchRequest } from '@/models/search/SearchRequest'
import type { SearchResult } from '@/models/search/SearchResult'

type CommandChoice =
  { type: 'recent'; value: RecentSearch } | { type: 'result'; value: SearchResult }

function keywordRequest(query: string): SearchRequest {
  return { query: query.trim() || null, fileType: null, fromDate: null, toDate: null }
}

export function CommandBar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const recentSearches = useSearchHistoryStore((state) => state.recentSearches)
  const addRecentSearch = useSearchHistoryStore((state) => state.addRecentSearch)
  const debouncedQuery = useDebouncedValue(query.trim(), 300)
  const request = useMemo(() => keywordRequest(debouncedQuery), [debouncedQuery])
  const search = useSearchResults(request, open && Boolean(request.query))

  const choices = useMemo<CommandChoice[]>(
    () =>
      query.trim()
        ? (search.data ?? []).slice(0, 5).map((result) => ({ type: 'result', value: result }))
        : recentSearches.map((recent) => ({ type: 'recent', value: recent })),
    [query, recentSearches, search.data],
  )

  useEffect(() => {
    const openCommand = (event: KeyboardEvent) => {
      const target = event.target
      const isTyping =
        target instanceof HTMLElement &&
        (target.matches('input, textarea, select') || target.isContentEditable)
      if (
        (event.key === '/' && !isTyping) ||
        ((event.ctrlKey || event.metaKey) && event.key === 'k')
      ) {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', openCommand)
    return () => window.removeEventListener('keydown', openCommand)
  }, [])

  useEffect(() => setActiveIndex(-1), [choices.length, query])

  const goToSearch = (next: SearchRequest) => {
    if (!next.query && !next.fileType && !next.fromDate && !next.toDate) return
    addRecentSearch(next)
    navigate(`/vault/search?${searchRequestParams(next).toString()}`)
    setOpen(false)
    setQuery('')
  }

  const choose = (choice: CommandChoice) => {
    if (choice.type === 'recent') {
      goToSearch(choice.value)
      return
    }
    addRecentSearch(keywordRequest(query))
    navigate(choice.value.folderId ? `/vault/files/${choice.value.folderId}` : '/vault/files')
    setOpen(false)
    setQuery('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setQuery('')
          setActiveIndex(-1)
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="pressable flex min-h-11 w-full items-center justify-between gap-4 rounded-full border border-border bg-card/70 px-5 text-left text-sm text-muted-foreground shadow-float backdrop-blur-md transition duration-default ease-vault hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transform-none md:max-w-md"
          aria-keyshortcuts="/ Control+K Meta+K"
        >
          <span className="inline-flex items-center gap-3">
            <Search aria-hidden="true" size={18} />
            <span>Search your vault</span>
          </span>
          <span className="hidden rounded-full bg-card-muted px-3 py-1 font-mono text-[13px] text-foreground sm:inline-flex">
            /
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search your vault</DialogTitle>
          <DialogDescription>
            Find files by metadata. Use the full search page for type and upload-date filters.
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-5"
          onSubmit={(event) => {
            event.preventDefault()
            const choice = choices[activeIndex]
            if (choice) choose(choice)
            else goToSearch(keywordRequest(query))
          }}
        >
          <label className="relative" htmlFor="command-search-input">
            <span className="sr-only">Search words</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
              size={18}
            />
            <Input
              id="command-search-input"
              className="pl-10"
              autoComplete="off"
              value={query}
              aria-controls="command-search-choices"
              aria-activedescendant={
                activeIndex >= 0 ? `command-search-choice-${activeIndex}` : undefined
              }
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setOpen(false)
                  return
                }
                if (event.key === 'ArrowDown' && choices.length) {
                  event.preventDefault()
                  setActiveIndex((current) => (current + 1) % choices.length)
                }
                if (event.key === 'ArrowUp' && choices.length) {
                  event.preventDefault()
                  setActiveIndex((current) => (current <= 0 ? choices.length - 1 : current - 1))
                }
              }}
            />
          </label>
        </form>

        <div className="mt-4" aria-live="polite">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            {query.trim() ? (
              <Search aria-hidden="true" size={15} />
            ) : (
              <History aria-hidden="true" size={15} />
            )}
            {query.trim() ? 'Server-ordered preview' : 'Recent searches this session'}
          </div>
          <ul id="command-search-choices" className="grid gap-1" role="listbox">
            {choices.map((choice, index) => (
              <li key={choice.type === 'recent' ? choice.value.id : choice.value.fileId}>
                <button
                  id={`command-search-choice-${index}`}
                  type="button"
                  role="option"
                  aria-selected={activeIndex === index}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm hover:bg-card-muted ${
                    activeIndex === index ? 'bg-card-muted text-brand' : 'text-foreground'
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(choice)}
                >
                  {choice.type === 'recent' ? (
                    <History className="shrink-0" aria-hidden="true" size={17} />
                  ) : (
                    <File className="shrink-0" aria-hidden="true" size={17} />
                  )}
                  <span className="min-w-0 flex-1 truncate">
                    {choice.type === 'recent' ? searchLabel(choice.value) : choice.value.fileName}
                  </span>
                  {choice.type === 'result' ? (
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {formatBytes(choice.value.fileSizeBytes)}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
          {query.trim() && query.trim() !== debouncedQuery ? (
            <p className="p-3 text-sm text-muted-foreground" role="status">
              Waiting for you to pause…
            </p>
          ) : search.isPending && query.trim() ? (
            <p className="p-3 text-sm text-muted-foreground" role="status">
              Searching…
            </p>
          ) : search.isError ? (
            <p className="rounded-md bg-danger-soft p-3 text-sm text-danger" role="alert">
              Preview unavailable. Press Enter to continue on the full search page.
            </p>
          ) : query.trim() && choices.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">No preview results.</p>
          ) : !query.trim() && choices.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">No recent searches yet.</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
