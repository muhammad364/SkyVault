export const queryKeys = {
  root: ['skyvault'] as const,
  storagePlans: {
    public: () => [...queryKeys.root, 'storage-plans', 'public'] as const,
    detail: (storagePlanId: string) => [...queryKeys.root, 'storage-plans', storagePlanId] as const,
  },
  subscriptions: {
    current: () => [...queryKeys.root, 'subscriptions', 'current'] as const,
  },
  storageQuota: {
    current: () => [...queryKeys.root, 'storage-quota', 'current'] as const,
  },
  additionalStorage: {
    purchases: () => [...queryKeys.root, 'additional-storage', 'purchases'] as const,
    quote: (storageAmountGb: number) =>
      [...queryKeys.root, 'additional-storage', 'quote', storageAmountGb] as const,
  },
  auth: {
    profile: () => [...queryKeys.root, 'auth', 'profile'] as const,
  },
  files: {
    all: () => [...queryKeys.root, 'files', 'all'] as const,
  },
  folders: {
    all: () => [...queryKeys.root, 'folders'] as const,
    contents: (folderId: string | null) =>
      [...queryKeys.root, 'folders', 'contents', folderId ?? 'root'] as const,
    ancestry: (folderId: string | null) =>
      [...queryKeys.root, 'folders', 'ancestry', folderId ?? 'root'] as const,
  },
  sharing: {
    own: () => [...queryKeys.root, 'sharing', 'own'] as const,
  },
  recycleBin: {
    items: () => [...queryKeys.root, 'recycle-bin', 'items'] as const,
  },
}
