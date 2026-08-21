export const AdditionalStoragePurchaseStatus = {
  Active: 0,
  Inactive: 1,
} as const

export type AdditionalStoragePurchaseStatusValue =
  (typeof AdditionalStoragePurchaseStatus)[keyof typeof AdditionalStoragePurchaseStatus]
