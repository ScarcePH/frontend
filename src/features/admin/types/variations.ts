import type { ProductCategory } from '@/types/category'

export interface VariationObj {
  id: number
  image: []
  url: string
  condition: string
  size: string
  price: number
  stock: number
  isOpen: boolean,
  status:string,
  spent:number,
  files: File[]|null,
}

export const createVariation = (): VariationObj => ({
  id: 0,
  image: [],
  url: "",
  condition: "",
  size: "",
  price: 0,
  stock: 0,
  isOpen: false,
  status:'',
  spent:0,
  files: []
})

type PairSummary = {
  id: number
  name: string
  image: string,
  variation:VariationObj[]
  description:string
  category: ProductCategory
}

export type VariationsProps = {
  pair: PairSummary,
}


export type InventoryData = {
  id: number
  name: string
  description: string
  image: string,
  category: ProductCategory
  file:File|null
}
