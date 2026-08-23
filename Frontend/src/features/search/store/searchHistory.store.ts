import { create } from 'zustand'
import type { SearchRequest } from '@/models/search/SearchRequest'

export interface RecentSearch extends SearchRequest {
  id: string
}

interface SearchHistoryState {
  recentSearches: RecentSearch[]
  addRecentSearch: (request: SearchRequest) => void
  clearRecentSearches: () => void
}

function searchId(request: SearchRequest) {
  return JSON.stringify(request)
}

export function searchLabel(request: SearchRequest) {
  const parts = [
    request.query,
    request.fileType ? `type: ${request.fileType}` : null,
    request.fromDate ? `from: ${request.fromDate}` : null,
    request.toDate ? `to: ${request.toDate}` : null,
  ].filter(Boolean)
  return parts.join(' · ')
}

export const useSearchHistoryStore = create<SearchHistoryState>((set) => ({
  recentSearches: [],
  addRecentSearch: (request) =>
    set((state) => {
      const id = searchId(request)
      return {
        recentSearches: [
          { ...request, id },
          ...state.recentSearches.filter((recent) => recent.id !== id),
        ].slice(0, 5),
      }
    }),
  clearRecentSearches: () => set({ recentSearches: [] }),
}))

export function clearSearchHistory() {
  useSearchHistoryStore.getState().clearRecentSearches()
}
