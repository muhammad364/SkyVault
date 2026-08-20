import { storagePlansApi } from '@/api/endpoints/storage-plans.api'

export const publicPlansService = {
  list: (signal?: AbortSignal) => storagePlansApi.getAllPlans(signal),
}
