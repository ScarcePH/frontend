import { type VariationObj  } from "./variations";
import type { ProductCategory } from "@/types/category";

export interface InventoryObj {
    name:string,
    description:string
    image:string
    variations: VariationObj[];
    id:number
    category: ProductCategory
}
