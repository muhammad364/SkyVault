export const queryKeys = {
  root: ['skyvault'] as const,
  storagePlans: {
    public: () => [...queryKeys.root, 'storage-plans', 'public'] as const,
  },
  auth: {
    profile: () => [...queryKeys.root, 'auth', 'profile'] as const,
  },
}
