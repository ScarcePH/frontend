export type PromotionStatus = 'scheduled' | 'active' | 'ended'

export type PromotionItem = {
  id: number
  variation_id: number
  promo_price: number
  regular_price: number
  inventory_id: number
  inventory_name: string
  inventory_image: string
  size: string
  condition: string
  status: string
  stock: number
}

export type Promotion = {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  early_ended_at: string | null
  status: PromotionStatus
  items: PromotionItem[]
  created_at: string
  updated_at: string
}

export type PromotionPayload = {
  name: string
  description: string
  start_date: string
  end_date: string
  items: Array<{ variation_id: number; promo_price: number }>
}
