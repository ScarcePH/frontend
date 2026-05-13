export interface VariationObj {
  id: number
  image: string
  url: string
  condition: string
  size: string
  price: number
  stock: number
  isOpen: boolean,
  status:string,
  spent:number
}

export type PairObj  = {
    name:string,
    description:string
    image:string
    variations: VariationObj[];
    id:number
    status?: string
    is_sold?: boolean
    is_available?: boolean
    availability_status?: 'available' | 'sold'
}
