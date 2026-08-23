export const queryKeys = {
  root: ['skyvault'] as const,
  storagePlans: {
    all: () => [...queryKeys.root, 'storage-plans'] as const,
    public: () => [...queryKeys.storagePlans.all(), 'public'] as const,
    detail: (storagePlanId: string) => [...queryKeys.storagePlans.all(), storagePlanId] as const,
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
  search: {
    all: () => [...queryKeys.root, 'search'] as const,
    results: (request: {
      query: string | null
      fileType: string | null
      fromDate: string | null
      toDate: string | null
    }) => [...queryKeys.root, 'search', 'results', request] as const,
  },
  admin: {
    all: () => [...queryKeys.root, 'admin'] as const,
    statistics: () => [...queryKeys.root, 'admin', 'statistics'] as const,
    storageOverview: () => [...queryKeys.root, 'admin', 'storage-overview'] as const,
    users: () => [...queryKeys.root, 'admin', 'users'] as const,
    user: (userId: string) => [...queryKeys.root, 'admin', 'users', userId] as const,
    userStorage: (userId: string) =>
      [...queryKeys.root, 'admin', 'users', userId, 'storage'] as const,
    auditLogs: (filters: {
      administratorId: string | null
      action: string | null
      performedFrom: string | null
      performedTo: string | null
      skip: number
      take: number
    }) => [...queryKeys.root, 'admin', 'audit-logs', filters] as const,
    auditLog: (auditLogId: string) =>
      [...queryKeys.root, 'admin', 'audit-logs', auditLogId] as const,
    plans: () => [...queryKeys.root, 'admin', 'plans'] as const,
    providers: () => [...queryKeys.root, 'admin', 'providers'] as const,
    accounts: (isActive: boolean | null) =>
      [...queryKeys.root, 'admin', 'accounts', isActive ?? 'all'] as const,
    emailConfigurations: () => [...queryKeys.root, 'admin', 'email-configurations'] as const,
    emailConfiguration: (emailConfigurationId: string) =>
      [...queryKeys.root, 'admin', 'email-configurations', emailConfigurationId] as const,
    subscriptions: () => [...queryKeys.root, 'admin', 'subscriptions'] as const,
    subscription: (subscriptionId: string) =>
      [...queryKeys.root, 'admin', 'subscriptions', subscriptionId] as const,
    userSubscriptions: (userId: string) =>
      [...queryKeys.root, 'admin', 'subscriptions', 'user', userId] as const,
  },
}
