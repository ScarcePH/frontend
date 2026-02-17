import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ShoppingCart, X } from "lucide-react"
import { useGetCart, useRemoveFromCart } from "./hooks/useCart"
import { formatPeso } from "@/utils/dashboard"
import { useNavigate } from "react-router"
import { useStartCheckout } from "@/features/checkout/hooks/useCheckout"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"

export function AppCart() {
  const{data}=useGetCart()
  const removeFromCart = useRemoveFromCart()
  const navigate = useNavigate()
  const startCheckout = useStartCheckout()
  const [index, setIndex] = useState<null|number>(null)

  const handleCheckout = async () => {
    try {
      const session = await startCheckout.mutateAsync({ source: "cart" })
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

  const handleRemovePair = async (key:number, inventoryId: number, variationId: number) => {
    
    try {
      setIndex(key)
      await removeFromCart.mutateAsync({
        inventory_id: inventoryId,
        variation_id: variationId,
      })
      setIndex(null)
      toast.success("Removed from cart")
    } catch (e: any) {
      setIndex(null)
      toast.error(e?.message || "Failed to remove pair from cart.")
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
         <Button size="icon-sm" variant="outline">
          <ShoppingCart />

        {data?.items && data?.items.length > 0 && (
            <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
            >
            {data?.items.length}
            </Badge>
        )}
        </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-90 mr-5 mt-2">
        {data?.items.length? (
          <div className="space-y-5">
            <p className="font-medium">
              MY CART
            </p>
      
            {data?.items.map((item,key) => (
              <div
                key={`${item.inventory_id}-${item.variation_id}`}
                className="flex items-center justify-between gap-4"
              >
                <img
                      src={item.image}
                      alt={item.inventory_name}
                      className="mr-2 w-20 rounded-sm object-fit"
                />
                <div className="text-sm leading-tight">
                  <p>{item.inventory_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Condition: {item.condition || "N/A"} <br/>
                    Size: {item.size || "N/A"}  <br/>
                    Price: {formatPeso(item.price||0)}
                  </p>
                </div>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  aria-label="Remove pair"
                  onClick={() => handleRemovePair(key, item.inventory_id, item.variation_id)}
                  disabled={removeFromCart.isPending&&index===key}
                >
                { removeFromCart.isPending&&index===key?<Spinner/> : <X />}
                </Button>
              </div>
            ))}
            <div className="flex justify-between">
              <p>Total: {formatPeso(data?.total||0)}</p>
              {data?.items?.length ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCheckout}
                  disabled={startCheckout.isPending}
                >
                  Checkout
                </Button>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  Checkout
                </Button>
              )}
            </div>
          </div>

        ):(
          <p>No Items in cart</p>
        )
            
        }
      
      </PopoverContent>
    </Popover>
  )
}
