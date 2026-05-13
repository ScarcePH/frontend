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

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function AppCart() {
  const{data, isLoading}=useGetCart()
  const removeFromCart = useRemoveFromCart()
  const navigate = useNavigate()
  const startCheckout = useStartCheckout()
  const [index, setIndex] = useState<null|number>(null)
  const items = data?.items ?? []
  const hasItems = items.length > 0

  const handleCheckout = async () => {
    if (!hasItems) {
      return
    }

    try {
      const session = await startCheckout.mutateAsync({ source: "cart" })
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

  const handleRemovePair = async (key:number, inventoryId: number, variationId: number) => {
    
    try {
      setIndex(key)
      await removeFromCart.mutateAsync({
        inventory_id: inventoryId,
        variation_id: variationId,
      })
      setIndex(null)
      toast.success("Removed from cart")
    } catch (e: unknown) {
      setIndex(null)
      toast.error(getErrorMessage(e, "Failed to remove pair from cart."))
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
      <PopoverContent className="mr-3 mt-2 w-[min(calc(100vw-1.5rem),24rem)] p-0">
        {isLoading ? (
          <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
            <Spinner />
            Loading cart...
          </div>
        ) : hasItems ? (
          <div className="space-y-4 p-4">
            <p className="font-medium tracking-wide">
              MY CART
            </p>
      
            <div className="max-h-[55dvh] space-y-3 overflow-y-auto pr-1">
            {items.map((item,key) => (
              <div
                key={`${item.inventory_id}-${item.variation_id}`}
                className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-md border p-2"
              >
                <img
                      src={item.image}
                      alt={item.inventory_name}
                      className="h-16 w-16 rounded-sm bg-muted object-contain"
                />
                <div className="min-w-0 text-sm leading-tight">
                  <p className="font-medium leading-5">{item.inventory_name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Size {item.size || "N/A"} US · {item.condition || "N/A"}
                  </p>
                  <p className="mt-1 text-xs font-medium">
                    {formatPeso(item.price||0)}
                  </p>
                </div>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  aria-label={`Remove ${item.inventory_name} from cart`}
                  onClick={() => handleRemovePair(key, item.inventory_id, item.variation_id)}
                  disabled={removeFromCart.isPending&&index===key}
                >
                { removeFromCart.isPending&&index===key?<Spinner/> : <X />}
                </Button>
              </div>
            ))}
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-medium">{formatPeso(data?.total||0)}</p>
              </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCheckout}
                  disabled={!hasItems || startCheckout.isPending}
                >
                  {startCheckout.isPending ? <Spinner /> : "Checkout"}
                </Button>
            </div>
          </div>

        ):(
          <div className="space-y-2 p-4">
            <p className="font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add an available pair before starting checkout.</p>
            <Button size="sm" variant="outline" disabled className="w-full">
              Checkout
            </Button>
          </div>
        )
            
        }
      
      </PopoverContent>
    </Popover>
  )
}
