import { apiClient } from '@/api/apiClient'
import type { PairObj } from '@/types/pair'

export function getProductCatalog(): Promise<PairObj[]> {
  return apiClient.get('inventory/catalog')
}
