export type CartItem = {
    condition?: string
    size?: string
    inventory_name: string
    price: number
    regular_price: number
    promo_price?: number | null
    promotion_id?: number | null
    is_on_promotion?: boolean
    quantity: number
    subtotal: number
    inventory_id: number
    variation_id: number,
    image:string

}

export type CartObj = {
    items:CartItem[]
    total:number

}

export type AddToCartParams ={
    inventory_id: number
    variation_id: number
}

export type RemoveFromCartParams = {
    inventory_id: number
    variation_id: number
}
