import { Button } from "@/components/ui/button";
import type { PairObj, VariationObj } from "@/types/pair";
import { useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useAddToCart } from "@/features/cart/hooks/useCart";
import { useStartCheckout } from "@/features/checkout/hooks/useCheckout";
import { toast } from "sonner";
import CarouselWithFullScreen from "@/components/CarouselWithFullScreen";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { formatPeso } from "@/utils/dashboard";


type PairProps = {
    pair:PairObj
}

function isAvailableVariation(variation: VariationObj) {
    const status = variation.status?.toLowerCase() ?? ""

    return variation.stock > 0 && !["sold", "unavailable", "inactive"].includes(status)
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback
}

export default function PairInfo ({pair}:PairProps) {
    const [selected, setSelected] = useState<VariationObj|null>(null)
    const selectedValue = selected ? String(selected.id) : ""
    const availableVariations = pair.variations.filter(isAvailableVariation)
    const hasAvailableVariations = availableVariations.length > 0
    const carousel = useMemo(() => {
        if (!selected?.image?.length) {
            return [pair.image]
        }

        const selectedImages = Array.isArray(selected.image) ? selected.image : [selected.image]
        return [pair.image, ...selectedImages]
    }, [pair.image, selected])

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
                            className="h-20 w-20 rounded-sm object-contain"
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
        } catch (e: unknown) {
            toast.error(getErrorMessage(e, "Failed to start checkout."))
        }
    }

    return (
        <div className="space-y-5">
            <div className="shrink-0 flex justify-center rounded-md bg-muted/40 py-3">
               <CarouselWithFullScreen images={carousel}/>
            </div>
            <div className="space-y-2">
                <p className="text-xl font-semibold leading-tight">
                    {pair.name}
                </p>
                <p className="text-muted-foreground text-sm leading-6">
                    {pair.description}
                </p>
            </div>
           
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Select size</p>
                    <p className="text-xs text-muted-foreground">
                        {hasAvailableVariations ? `${availableVariations.length} available` : "Sold out"}
                    </p>
                </div>
                <div className="w-full overflow-x-auto pb-1">
                    <ToggleGroup
                        type="single"
                        size="sm"
                        variant="outline"
                        spacing={2}
                        value={selectedValue}
                        onValueChange={(value) => {
                            const nextVariation = pair.variations.find((variation) => String(variation.id) === value)
                            setSelected(nextVariation && isAvailableVariation(nextVariation) ? nextVariation : null)
                        }}
                        className="flex-wrap justify-start"
                    >
                        {pair.variations.map((data)=>
                            <ToggleGroupItem 
                                key={data.id}
                                value={String(data.id)}
                                disabled={!isAvailableVariation(data)}
                                aria-label={`Size ${data.size} US${isAvailableVariation(data) ? "" : " unavailable"}`}
                                className="min-h-9 px-3 disabled:line-through"
                            > 
                                {data.size}us
                            </ToggleGroupItem>
                        )}
                    </ToggleGroup>
                </div>
            </div>
            <div className="rounded-md border p-4">
                {selected ? (
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                        <div>
                            <p className="text-xs text-muted-foreground">Selected size</p>
                            <p className="font-medium">{selected.size} US</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Condition</p>
                            <p className="font-medium">{selected.condition}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Price</p>
                            <p className="font-medium">{formatPeso(selected.price)}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        {hasAvailableVariations ? "Choose an available size to continue." : "This pair is currently sold out."}
                    </p>
                )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <Button 
                    className="w-full"
                    disabled={!selected || addingTocart}
                    onClick={handleAddtoCart}
                >
                   {addingTocart ? <Spinner/> : selected ? "Add to cart" : "Select a size"}
                </Button>
                <Button className="w-full" disabled={!selected || startCheckout.isPending} onClick={handleCheckout}>
                    {startCheckout.isPending ? <Spinner/> : selected ? "Checkout" : "Select a size"}
                </Button>
            </div>
            {selected ? (
                <div className="text-xs text-muted-foreground">
                    {selected.stock > 1 ? `${selected.stock} pairs left in this size.` : "Only 1 pair left in this size."}
                </div>
            ) : null}
        </div>
    )
}
