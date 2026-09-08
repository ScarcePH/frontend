import { Link } from 'react-router'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { PairObj } from '@/types/pair'
import { formatPeso } from '@/utils/dashboard'
import PairInfo from './PairInfo'
import { getPairAvailability, isNewPair } from '../utils/catalog'

export function PairCard({ pair, promotionOnly = false }: { pair: PairObj; promotionOnly?: boolean }) {
  const displayPair = promotionOnly
    ? { ...pair, variations: pair.variations.filter((variation) => variation.is_on_promotion) }
    : pair
  const { isSoldOut, availableVariations, sizeCount, startingPrice, startingRegularPrice, isOnPromotion } = getPairAvailability(displayPair)
  const isJustIn = !isSoldOut && isNewPair(pair)
  const conditions = [...new Set((availableVariations.length ? availableVariations : displayPair.variations).map((variation) => variation.condition).filter(Boolean))]

  return (
    <article className="group flex min-w-0 flex-col">
      <Link to={`/products/${pair.id}`} className="storefront-focus relative flex aspect-square items-center justify-center" aria-label={`View ${pair.name}${isSoldOut ? ', sold out' : ''}`}>
        {isSoldOut || isOnPromotion || isJustIn ? (
          <span className={`absolute left-1 top-1 z-10 px-2 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.15em] sm:left-2 sm:top-2 ${isSoldOut ? 'bg-red-600 text-white dark:bg-red-500 dark:text-white' : 'bg-store-accent text-store-accent-foreground'}`}>
            {isSoldOut ? 'SOLD' : isOnPromotion ? 'PROMO' : 'JUST IN'}
          </span>
        ) : null}
        <img src={pair.image} alt={pair.name} loading="lazy" className="h-[73%] w-[73%] object-contain transition-transform duration-300 group-hover:scale-[1.035] motion-reduce:transition-none" />
      </Link>
      <div className="flex flex-1 flex-col pt-2 sm:pt-3">
        <Link to={`/products/${pair.id}`} className="storefront-focus text-[0.8125rem] font-semibold leading-5 hover:underline hover:underline-offset-4 sm:text-sm">{pair.name}</Link>
        <p className="mt-1 text-xs text-muted-foreground">{conditions.slice(0, 2).join(' · ') || 'Condition unavailable'}</p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            {startingRegularPrice ? <p className="text-xs tabular-nums text-muted-foreground line-through">{formatPeso(startingRegularPrice)}</p> : null}
            <p className={`text-sm font-semibold tabular-nums ${isOnPromotion ? 'text-store-accent' : ''}`}>{startingPrice ? `${isSoldOut ? '' : 'From '}${formatPeso(startingPrice)}` : 'Price unavailable'}</p>
            <p className="mt-1 text-xs text-muted-foreground">{isSoldOut ? 'Sold archive' : `${sizeCount} ${sizeCount === 1 ? 'size' : 'sizes'} ready`}</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="size-11 shrink-0 rounded-none" aria-label={`Quick view ${pair.name}`}><Eye aria-hidden="true" /></Button>
            </DialogTrigger>
            <DialogContent className="storefront max-h-[94dvh] max-w-[calc(100%-1rem)] overflow-y-auto rounded-none border-border bg-background p-4 sm:max-w-5xl sm:p-7 lg:p-9">
              <DialogTitle className="sr-only">Quick view: {pair.name}</DialogTitle>
              <PairInfo pair={pair} mode="quick-view" />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </article>
  )
}
