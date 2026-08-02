import { Button } from '@/components/ui/button'
import type { PairObj, VariationObj } from '@/types/pair'
import { useMemo, useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAddToCart } from '@/features/cart/hooks/useCart'
import { useStartCheckout } from '@/features/checkout/hooks/useCheckout'
import { toast } from 'sonner'
import CarouselWithFullScreen from '@/components/CarouselWithFullScreen'
import { useNavigate } from 'react-router'
import { Spinner } from '@/components/ui/spinner'
import { formatPeso } from '@/utils/dashboard'
import { getPairAvailability, isAvailableVariation } from '../utils/catalog'
import { ArrowRight, ShoppingBag } from 'lucide-react'

type PairProps = {
  pair: PairObj
  mode?: 'page' | 'quick-view'
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export default function PairInfo({ pair, mode = 'page' }: PairProps) {
  const [selected, setSelected] = useState<VariationObj | null>(null)
  const selectedValue = selected ? String(selected.id) : ''
  const { availableVariations, sizeCount, startingPrice } = getPairAvailability(pair)
  const hasAvailableVariations = availableVariations.length > 0
  const carousel = useMemo(() => {
    if (!selected?.image?.length) return [pair.image]

    const selectedImages = Array.isArray(selected.image) ? selected.image : [selected.image]
    return [pair.image, ...selectedImages]
  }, [pair.image, selected])

  const { mutate: addToCart, isPending: addingToCart } = useAddToCart()
  const startCheckout = useStartCheckout()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    if (!selected) return

    addToCart(
      { inventory_id: pair.id, variation_id: selected.id },
      {
        onSuccess: () => {
          toast.custom(() => (
            <div className="flex items-center gap-3 border border-border bg-background p-3 shadow-lg">
              <img src={pair.image} alt="" className="h-16 w-16 bg-muted object-contain" />
              <div className="leading-tight">
                <p className="text-sm font-semibold">Added to cart</p>
                <p className="mt-1 text-xs text-muted-foreground">{pair.name}</p>
              </div>
            </div>
          ))
        },
        onError: (error) => toast.error(getErrorMessage(error, 'Failed to add this pair to your cart.')),
      },
    )
  }

  const handleCheckout = async () => {
    if (!selected) return

    try {
      const session = await startCheckout.mutateAsync({
        items: [{ inventory_id: pair.id, variation_id: selected.id, qty: 1 }],
      })
      const checkoutSessionId = session?.checkout_session_id
      if (!checkoutSessionId) {
        toast.error('Unable to start checkout session.')
        return
      }
      navigate(`/checkout?sessionId=${checkoutSessionId}`)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to start checkout.'))
    }
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:gap-12" data-mode={mode}>
      <div className="flex min-h-[18rem] items-center justify-center border border-border/70 bg-card sm:min-h-[31rem]">
        <CarouselWithFullScreen images={carousel} productName={pair.name} />
      </div>

      <div className="flex flex-col lg:py-2">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Product · No. {String(pair.id).padStart(3, '0')}
        </p>
        {mode === 'page' ? <h1 className="mt-4 pr-8 text-3xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">{pair.name}</h1> : <h2 className="mt-4 pr-8 text-3xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">{pair.name}</h2>}
        <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">{pair.description}</p>

        <div className="mt-7 border-y border-border py-5">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Price</p>
            <p className="text-2xl font-semibold tabular-nums">
              {selected ? formatPeso(selected.price) : startingPrice ? `From ${formatPeso(startingPrice)}` : 'Sold out'}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-4 text-xs">
            <span className="uppercase tracking-[0.14em] text-muted-foreground">Availability</span>
            <span>{hasAvailableVariations ? `${sizeCount} ${sizeCount === 1 ? 'size' : 'sizes'} available` : 'Sold out'}</span>
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="sr-only">Select a size in US sizing</legend>
          <div className="flex items-center justify-between gap-3">
            <span id={`size-label-${pair.id}`} className="text-xs font-semibold uppercase tracking-[0.16em]">Select size</span>
            <span className="text-xs text-muted-foreground">US sizing</span>
          </div>
          <ToggleGroup
            type="single"
            value={selectedValue}
            onValueChange={(value) => {
              const nextVariation = pair.variations.find((variation) => String(variation.id) === value)
              setSelected(nextVariation && isAvailableVariation(nextVariation) ? nextVariation : null)
            }}
            className="mt-3 flex w-full flex-wrap justify-start gap-2"
            aria-labelledby={`size-label-${pair.id}`}
          >
            {pair.variations.map((variation) => {
              const available = isAvailableVariation(variation)
              return (
                <ToggleGroupItem
                  key={variation.id}
                  value={String(variation.id)}
                  disabled={!available}
                  aria-label={`Size ${variation.size} US${available ? '' : ' unavailable'}`}
                  className="min-h-11 min-w-14 rounded-none border border-border px-3 text-xs data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background disabled:line-through"
                >
                  {variation.size}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </fieldset>

        <div className="mt-5 min-h-[4.5rem] border border-border/70 p-4 text-sm" aria-live="polite">
          {selected ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">Condition</p>
                <p className="mt-1 font-medium">{selected.condition}</p>
              </div>
              <div>
                <p className="text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">Stock</p>
                <p className="mt-1 font-medium">{selected.stock === 1 ? 'Last pair' : `${selected.stock} pairs`}</p>
              </div>
            </div>
          ) : (
            <p className="leading-6 text-muted-foreground">
              {hasAvailableVariations ? 'Choose an available size to reveal its condition and continue.' : 'This pair is no longer available to purchase.'}
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button
            className="min-h-12 rounded-none uppercase tracking-[0.13em] sm:order-2"
            disabled={!selected || startCheckout.isPending || addingToCart}
            onClick={handleCheckout}
          >
            {startCheckout.isPending ? <Spinner /> : <>Buy now <ArrowRight aria-hidden="true" /></>}
          </Button>
          <Button
            variant="outline"
            className="min-h-12 rounded-none border-foreground/40 bg-transparent uppercase tracking-[0.13em] sm:order-1"
            disabled={!selected || addingToCart || startCheckout.isPending}
            onClick={handleAddToCart}
          >
            {addingToCart ? <Spinner /> : <><ShoppingBag aria-hidden="true" /> Add to cart</>}
          </Button>
        </div>
      </div>
    </div>
  )
}
