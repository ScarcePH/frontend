import { apiClient } from '@/api/apiClient'
import type { ActivePromotion, PairObj } from '@/types/pair'

export function getProductCatalog(): Promise<PairObj[]> {
  return apiClient.get('inventory/catalog')
}

export function getActivePromotion(): Promise<{ promotion: ActivePromotion | null }> {
  return apiClient.get('promotions/active')
}
