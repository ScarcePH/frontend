import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { useStartCheckout } from '@/features/checkout/hooks/useCheckout'
import { formatPeso } from '@/utils/dashboard'
import { useGetCart, useRemoveFromCart } from './hooks/useCart'

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function AppCart() {
  const { data, isLoading } = useGetCart()
  const removeFromCart = useRemoveFromCart()
  const startCheckout = useStartCheckout()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [removingIndex, setRemovingIndex] = useState<number | null>(null)
  const items = data?.items ?? []

  const handleCheckout = async () => {
    if (!items.length) return
    try {
      const session = await startCheckout.mutateAsync({ source: 'cart' })
      if (!session?.checkout_session_id) return toast.error('Unable to start checkout session.')
      setOpen(false)
      navigate(`/checkout?sessionId=${session.checkout_session_id}`)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to start checkout.'))
    }
  }

  const handleRemove = async (index: number, inventoryId: number, variationId: number) => {
    try {
      setRemovingIndex(index)
      await removeFromCart.mutateAsync({ inventory_id: inventoryId, variation_id: variationId })
      toast.success('Removed from cart')
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to remove pair from cart.'))
    } finally {
      setRemovingIndex(null)
    }
  }

  const continueShopping = () => {
    setOpen(false)
    navigate('/#shop')
    window.setTimeout(() => document.getElementById('shop')?.scrollIntoView(), 0)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="relative size-11 rounded-none" aria-label={`Open cart${items.length ? `, ${items.length} items` : ''}`}>
          <ShoppingBag aria-hidden="true" />
          {items.length ? <Badge className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full border border-background bg-store-accent p-0 text-[0.625rem] text-store-accent-foreground">{items.length}</Badge> : null}
        </Button>
      </SheetTrigger>
      <SheetContent className="storefront w-full border-border bg-background p-0 sm:max-w-[30rem]" aria-describedby="cart-description">
        <SheetHeader className="border-b border-border px-5 py-6 sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-store-accent">Your selection</p>
          <SheetTitle className="text-2xl font-semibold tracking-[-0.03em]">Shopping bag <span className="text-muted-foreground">({items.length})</span></SheetTitle>
          <SheetDescription id="cart-description" className="sr-only">Review products in your cart and continue to checkout.</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground"><Spinner /> Loading cart…</div>
        ) : items.length ? (
          <>
            <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto px-5 sm:px-7">
              {items.map((item, index) => (
                <div key={`${item.inventory_id}-${item.variation_id}`} className="grid grid-cols-[5.5rem_1fr_2.75rem] gap-4 py-5">
                  <img src={item.image} alt={item.inventory_name} width="88" height="88" className="size-[5.5rem] border border-border bg-muted object-contain" />
                  <div className="min-w-0 self-center">
                    <p className="font-semibold leading-5">{item.inventory_name}</p>
                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">US {item.size || 'N/A'} · {item.condition || 'Condition unavailable'}</p>
                    <p className="mt-2 text-sm font-semibold tabular-nums">{formatPeso(item.price || 0)}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="size-11 self-center rounded-none text-muted-foreground hover:text-destructive" aria-label={`Remove ${item.inventory_name} from cart`} onClick={() => handleRemove(index, item.inventory_id, item.variation_id)} disabled={removeFromCart.isPending && removingIndex === index}>
                    {removeFromCart.isPending && removingIndex === index ? <Spinner /> : <Trash2 aria-hidden="true" />}
                  </Button>
                </div>
              ))}
            </div>
            <div className="border-t border-border bg-background px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-7">
              <div className="mb-5 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Subtotal</p><p className="mt-1 text-2xl font-semibold tabular-nums">{formatPeso(data?.total || 0)}</p></div><p className="max-w-40 text-right text-xs leading-5 text-muted-foreground">Shipping confirmed after verification</p></div>
              <Button className="min-h-12 w-full rounded-none uppercase tracking-[0.14em]" onClick={handleCheckout} disabled={startCheckout.isPending}>{startCheckout.isPending ? <Spinner /> : <>Checkout <ArrowRight /></>}</Button>
              <Button variant="ghost" className="mt-2 min-h-11 w-full rounded-none text-xs uppercase tracking-[0.12em]" onClick={continueShopping}>Continue shopping</Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center px-8 text-center"><div><ShoppingBag className="mx-auto size-7 text-muted-foreground" /><h3 className="mt-5 text-2xl font-semibold">Your bag is empty.</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Browse available pairs and select a size to begin.</p><Button className="mt-7 min-h-12 rounded-none px-7 uppercase tracking-[0.12em]" onClick={continueShopping}>Start shopping</Button></div></div>
        )}
      </SheetContent>
    </Sheet>
  )
}
