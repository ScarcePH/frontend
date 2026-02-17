import { Button } from "@/components/ui/button";
import type { PairObj, VariationObj } from "@/types/pair";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useAddToCart } from "@/features/cart/hooks/useCart";
import { useStartCheckout } from "@/features/checkout/hooks/useCheckout";
import { toast } from "sonner";
import CarouselWithFullScreen from "@/components/CarouselWithFullScreen";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";


type PairProps = {
    pair:PairObj
}

export default function PairInfo ({pair}:PairProps) {
    const [selected, setSelected] = useState<VariationObj|null>(null)
    const [carousel, setCarousel] = useState<string[]>([pair.image])

    const {mutate:addToCart, isPending:addingTocart} = useAddToCart()
    const startCheckout = useStartCheckout()
    const navigate = useNavigate()

    const handleAddtoCart = async () => {
        if (!selected) {
            return
        }
        const payload = {inventory_id:pair.id, variation_id:selected?.id}
        await addToCart(payload, {
            onSuccess:()=>{
                const itemImage = pair.image
                toast.custom(() => (
                    <div className="flex items-center gap-3 rounded-md border bg-background p-3 shadow-sm">
                        <img
                            src={itemImage}
                            alt={pair.name}
                            className=" w-20 rounded-sm object-fit"
                        />
                        <div className="leading-tight">
                            <p className="text-sm font-medium">Added to cart</p>
                            <p className="text-xs text-muted-foreground">{pair.name}</p>
                        </div>
                    </div>
                ))
            },
            onError:(e)=>toast.error('Failed add to cart '+ e)
        })
    }

    const handleCheckout = async () => {
        if (!selected) {
            return
        }
        try {
            const session = await startCheckout.mutateAsync({
                items: [
                    {
                        inventory_id: pair.id,
                        variation_id: selected.id,
                        qty: 1,
                    },
                ],
            })
            const checkoutSessionId = session?.checkout_session_id
            if (!checkoutSessionId) {
                toast.error("Unable to start checkout session.")
                return
            }
            navigate(`/checkout?sessionId=${checkoutSessionId}`)
        } catch (e: any) {
            toast.error(e?.message || "Failed to start checkout.")
        }
    }

    useEffect(()=>{
        selected?.image?.length ? 
            setCarousel([pair.image, ...selected.image])
            :
            setCarousel([pair.image])
    },[selected])    

    return (
        <div>
            <div className="shrink-0 flex justify-center py-2">
               <CarouselWithFullScreen images={carousel}/>
            </div>
            <p className="text-center mb-2">
                {pair.name}
            </p>
            <p className="text-muted-foreground text-left text-sm mb-3">
                {pair.description}
            </p>
           
            <div className="flex justify-center w-full items-center">
                 <p>Size:</p>
                <div className=" overflow-scroll w-full pl-2 pr-2 flex ">
                    <ToggleGroup
                        type="single"
                        size="sm"
                        variant="outline"
                        spacing={2}
                    >
                        {pair.variations.map((data)=>
                            <ToggleGroupItem 
                                onClick={()=>setSelected(data)}
                                value={data.size}
                                className="pt-0 pb-0"
                            > 
                                {data.size}us
                            </ToggleGroupItem>
                        )}
                    </ToggleGroup>
                </div>
            </div>
            {selected&&
                <div className="space-y-1 mt-6">
                    <p>Condition: {selected?.condition}</p>
                    <p>Price: ₱{selected.price}</p>
                </div>
         
                
            }
            <div className="mt-9 flex justify-center space-x-5">
                <Button 
                    disabled={!selected || addingTocart}
                    onClick={handleAddtoCart}
                >
                   { addingTocart? <Spinner/>: "Add to cart"}
                </Button>
                <Button disabled={!selected || startCheckout.isPending} onClick={handleCheckout}>
                    {startCheckout.isPending? <Spinner/>: "Checkout"}
                </Button>
            </div>

        </div>
    )
}
