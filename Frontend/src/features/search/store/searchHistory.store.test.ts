import { beforeEach, describe, expect, it } from 'vitest'
import { clearClientSession } from '@/features/auth/lib/clearClientSession'
import {
  clearSearchHistory,
  searchLabel,
  useSearchHistoryStore,
} from '@/features/search/store/searchHistory.store'

describe('session search history', () => {
  beforeEach(clearSearchHistory)

  it('keeps five unique most-recent submissions without browser persistence', () => {
    for (let index = 0; index < 6; index += 1) {
      useSearchHistoryStore.getState().addRecentSearch({
        query: `report ${index}`,
        fileType: null,
        fromDate: null,
        toDate: null,
      })
    }
    useSearchHistoryStore.getState().addRecentSearch({
      query: 'report 3',
      fileType: null,
      fromDate: null,
      toDate: null,
    })

    const recent = useSearchHistoryStore.getState().recentSearches
    expect(recent).toHaveLength(5)
    expect(recent[0].query).toBe('report 3')
    expect(new Set(recent.map((entry) => entry.id)).size).toBe(5)
    expect(window.localStorage.length).toBe(0)
  })

  it('uses only submitted contract facts in its label and clears on demand', () => {
    const request = {
      query: 'invoice',
      fileType: 'pdf',
      fromDate: '2026-01-01',
      toDate: null,
    }
    useSearchHistoryStore.getState().addRecentSearch(request)
    expect(searchLabel(request)).toBe('invoice · type: pdf · from: 2026-01-01')

    clearSearchHistory()
    expect(useSearchHistoryStore.getState().recentSearches).toEqual([])
  })

  it('clears recent searches with the private client session', async () => {
    useSearchHistoryStore.getState().addRecentSearch({
      query: 'private term',
      fileType: null,
      fromDate: null,
      toDate: null,
    })

    await clearClientSession()

    expect(useSearchHistoryStore.getState().recentSearches).toEqual([])
  })
})
