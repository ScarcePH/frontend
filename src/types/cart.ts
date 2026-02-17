export type CartItem = {
    condition?: string
    size?: string
    inventory_name: string
    price: number
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
