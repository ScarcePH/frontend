import type { VariationObj } from "./variations"

type CustomerObj = {
    name:string,
    address:string,
    phone:string
}

type InventoryObj = {
    name: string
    image: string | undefined
    description: string | undefined
    
}


type PaymentObj = {
    received_amount: number
    total_amount: number
    payment_method: string | undefined
    payment_ss: string | undefined,
    to_settle:number

}

export type ShipmentObj = {
    tracking:string|undefined
    status:string|undefined
    carrier:string|undefined
    created_at:string

}

export type OrderObj = {
    id:number
    created_at:string
    status:string
    customer:CustomerObj

    payment: PaymentObj 
    shipment:ShipmentObj | undefined,
    items:[],
    total_price:number

}

export type OrderProps = {
    status:string
    item: {
        inventory:InventoryObj,
        variation:VariationObj,
    }
    data:OrderObj
}

export type PresetDdateFilter =
  | "this_week"
  | "last_week"
  | "last_7"
  | "last_30"
  | "custom"
