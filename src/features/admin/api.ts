import { apiClient } from "@/api/apiClient";
import type { ProductCategory } from "@/types/category";
import type { Promotion, PromotionPayload } from './types/promotion'

export type EditPairParam = {
  inventory_id:number
  name:string
  description:string
  category:ProductCategory
}

export function editPair(payload: EditPairParam) {
  return apiClient.post(
    "/inventory/edit",
    payload
  );
}

export function getPendingApproval(){
  return apiClient.get(
    "/checkout/pending-approval"
  )
}

export function getPromotions(): Promise<Promotion[]> {
  return apiClient.get('/promotions')
}

export function createPromotion(payload: PromotionPayload): Promise<Promotion> {
  return apiClient.post('/promotions', payload)
}

export function updatePromotion(id: number, payload: PromotionPayload): Promise<Promotion> {
  return apiClient.put(`/promotions/${id}`, payload)
}

export function endPromotion(id: number): Promise<Promotion> {
  return apiClient.post(`/promotions/${id}/end`)
}

export function deletePromotion(id: number): Promise<void> {
  return apiClient.delete(`/promotions/${id}`)
}
