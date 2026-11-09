export type CreatePurchaseItem = {
  variation_id: number
  quantity: number
  unit_cost: number
}

export type CreatePurchasePayload = {
  supplier?: string
  purchase_date: string
  shipping_fees: number
  other_fees: number
  notes?: string
  items: CreatePurchaseItem[]
}

export type PurchaseItem = {
  id: number
  variation_id: number | null
  inventory_name: string
  condition: string | null
  size: string | null
  quantity: number
  unit_cost: number
  line_subtotal: number
  allocated_fees: number
  actual_total_cost: number
  actual_unit_cost: number
  listed_price: number
  listed_total: number
}

export type Purchase = {
  id: number
  supplier: string | null
  purchase_date: string
  shipping_fees: number
  other_fees: number
  subtotal: number
  total_cost: number
  notes: string | null
  items: PurchaseItem[]
  created_at: string | null
}

export type PurchaseQuery = {
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}

export type PurchaseStatementRow = {
  purchase_id: number
  supplier: string | null
  variation_id: number | null
  inventory_name: string
  condition: string | null
  size: string | null
  date: string
  purchase_date: string
  quantity: number
  unit_cost: number
  allocated_fees: number
  total_spent: number
  total_price: number
}

export type PurchaseStatementResponse = {
  data: PurchaseStatementRow[]
  total_spent: number
  total_price: number
}
