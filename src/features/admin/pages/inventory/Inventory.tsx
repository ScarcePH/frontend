import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemHeader,
  ItemGroup
} from "@/components/ui/item"
import { Variations } from "./Variations";
import { GetAllInventory } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AddPair } from "../AddPair";
import type { InventoryObj } from "@/features/admin/types/Inventory";


interface InventoryItemProps{
    inv:InventoryObj
}



function Inventory(){
    const {
        data,
        isLoading,
        isError,
    } = useQuery<InventoryObj[]>({
        queryFn:GetAllInventory,
        queryKey: ["inventory"],
        staleTime: 30 * 60_000,
    })
    if (isError) {
        return (
            <div className="m-6 text-sm text-destructive">
                Failed to Inventory Try again later
            </div>
        )
    }
    return(
        <div className="mr-6 ml-6">
            <div className="sticky top-0 z-10 backdrop-blur space-y-3 mb-2 flex justify-between pb-3 pt-3">
                <p>
                    Pairs
                </p>
                <AddPair/>
            </div>
                <ItemGroup className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
                    {isLoading?
                        <div>
                            <Skeleton/>
                            <Skeleton/>
                            <Skeleton/>
                            <Skeleton/>
                        </div>
                        :
                        data?.flatMap((inv, key) =>
                            <InventoryItem inv={inv} key={key}/>
                        )
                    }
                 </ItemGroup>
        </div>
    )
}

export default Inventory

function InventoryItem({inv}:InventoryItemProps){
   return(
        <Dialog>
            <DialogTrigger asChild>
                <Item
                    key={`${inv.name}`}
                    variant="outline"
                    onClick={()=>console.log(inv)}
                
                >
                    <ItemHeader>
                        <div className="m-2 md:m-6">
                        <img
                            src={inv.image}
                            alt={`${inv.name}`}
                            className="w-full rounded-sm object-fit"
                        />
                        </div >
                    </ItemHeader>
                    <ItemContent >
                        <ItemTitle className="text-muted-foreground text-xs w-full flex justify-center text-center">
                            {inv.name}
                        </ItemTitle>       
                    </ItemContent>
                </Item>
            </DialogTrigger>
             <DialogContent className="sm:max-w-[425px] flex flex-col">
                <DialogTitle>
                    Add or edit variation
                </DialogTitle>
                <DialogDescription>
                   Define condition, status, sizes, prices, and stock
                </DialogDescription>
                <Variations
                    pair={{
                        id: inv.id,
                        name: inv.name,
                        image: inv.image,
                        variation: inv.variations,
                        description: inv.description,
                        category: inv.category

                    }}
                />
             </DialogContent>
        </Dialog>
   )
}
