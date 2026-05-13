import { apiClient } from "@/api/apiClient"
import type { VariationObj } from "@/types/pair";

export type StartCheckoutPayload =
  | { source: "cart" }
  | { items: Array<{ inventory_id: number; variation_id: number; qty?: number; quantity?: number }> }

export type StartCheckoutResponse = {
  id: string
  checkout_session_id: string
  status?: string
  total_price?: number
  expires_at?: string
}

export function startCheckout(payload: StartCheckoutPayload) {
  return apiClient.post("/checkout/start", payload) as Promise<StartCheckoutResponse>
}


export type CheckoutSessionItem = {
  qty: number
  inventory: {
    id: number
    name: string
    condition?: string
    price?: number
    image?: string
    variations:VariationObj[]
  }
}

export type CheckoutSession = {
  id: string
  customer_id?: number
  items: CheckoutSessionItem[]
  total_price: number
  status?: string
  proof_image_url?: string
  created_at?: string
  expires_at?: string
}

export function getCheckoutSession(id: string) {
  return apiClient.get(`/checkout/session?id=${id}`)
}

export type SaveCheckoutCustomerPayload = {
  checkoutSessionId: string
  name?: string
  phone?: string
  address?: string
  email?: string
}

export function saveCheckoutCustomer(payload: SaveCheckoutCustomerPayload) {
  return apiClient.post("/checkout/save-customer", {
    checkout_session_id: payload.checkoutSessionId,
    name: payload.name,
    phone: payload.phone,
    address: payload.address,
    email: payload.email,
  })
}

export type SubmitProofPayload = {
  checkoutSessionId: string
  file: File
}

export type OcrStatusResponse = {
  status: string
  result?: unknown
}

export function submitCheckoutProof(payload: SubmitProofPayload) {
  const formData = new FormData()
  formData.append("checkout_session_id", payload.checkoutSessionId)
  formData.append("file", payload.file)

  return apiClient.post("/checkout/submit-proof", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

export function getPaymentOcrStatus(jobId: string, checkoutSessionId:string) {
  return apiClient.get(`/payment/status/${jobId}/${checkoutSessionId}`) as Promise<OcrStatusResponse>
}
