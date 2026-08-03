import type { ProductCategory } from './category'

export interface VariationObj {
  id: number
  image: string
  url: string
  condition: string
  size: string
  price: number
  effective_price: number
  promo_price?: number | null
  promotion_id?: number | null
  is_on_promotion?: boolean
  stock: number
  isOpen: boolean,
  status:string,
  spent:number
}

export type ActivePromotion = {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  status: 'active'
  items: Array<{
    variation_id: number
    promo_price: number
    regular_price: number
    inventory_id: number
  }>
}

export type PairObj  = {
    name:string,
    description:string
    image:string
    variations: VariationObj[];
    id:number
    category: ProductCategory
    status?: string
    is_sold?: boolean
    is_available?: boolean
    availability_status?: 'available' | 'sold'
    created_at?: string
}
