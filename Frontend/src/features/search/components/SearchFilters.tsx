import { RotateCcw, Search } from 'lucide-react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { SearchRequest } from '@/models/search/SearchRequest'

interface SearchFiltersProps {
  value: SearchRequest
  validationError: string | null
  onChange: (value: SearchRequest) => void
  onSubmit: () => void
  onClear: () => void
}

export function SearchFilters({
  value,
  validationError,
  onChange,
  onSubmit,
  onClear,
}: SearchFiltersProps) {
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!validationError) onSubmit()
  }

  return (
    <form
      className="grid gap-3 rounded-xl bg-card p-4 shadow-rest md:p-5"
      onSubmit={submit}
      aria-label="Search your vault"
    >
      <label className="relative" htmlFor="vault-search-query">
        <span className="sr-only">Search words</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
          size={18}
        />
        <Input
          id="vault-search-query"
          className="pl-10"
          placeholder="File name, extension, type, or folder name"
          value={value.query ?? ''}
          onChange={(event) => onChange({ ...value, query: event.target.value || null })}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-foreground" htmlFor="file-type">
          File type or extension
          <Input
            id="file-type"
            placeholder="pdf, image, text/plain"
            value={value.fileType ?? ''}
            onChange={(event) => onChange({ ...value, fileType: event.target.value || null })}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-foreground" htmlFor="from-date">
          Uploaded from
          <Input
            id="from-date"
            type="date"
            max={value.toDate ?? undefined}
            value={value.fromDate ?? ''}
            onChange={(event) => onChange({ ...value, fromDate: event.target.value || null })}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-foreground" htmlFor="to-date">
          Uploaded to
          <Input
            id="to-date"
            type="date"
            min={value.fromDate ?? undefined}
            value={value.toDate ?? ''}
            onChange={(event) => onChange({ ...value, toDate: event.target.value || null })}
          />
        </label>
      </div>
      {validationError ? (
        <p className="rounded-md bg-danger-soft p-3 text-sm text-danger" role="alert">
          {validationError}
        </p>
      ) : null}
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClear}>
          <RotateCcw aria-hidden="true" size={18} /> Clear
        </Button>
        <Button type="submit" disabled={Boolean(validationError)}>
          <Search aria-hidden="true" size={18} /> Search
        </Button>
      </div>
    </form>
  )
}
