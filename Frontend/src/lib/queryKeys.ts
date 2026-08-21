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
}
