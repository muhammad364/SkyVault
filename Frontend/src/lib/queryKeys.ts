export const queryKeys = {
  root: ['skyvault'] as const,
  storagePlans: {
    public: () => [...queryKeys.root, 'storage-plans', 'public'] as const,
  },
}
