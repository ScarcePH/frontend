import { Link } from 'react-router'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { PairObj } from '@/types/pair'
import { formatPeso } from '@/utils/dashboard'
import PairInfo from './PairInfo'
import { getPairAvailability } from '../utils/catalog'

export function PairCard({ pair }: { pair: PairObj }) {
  const { isSoldOut, availableVariations, sizeCount, startingPrice } = getPairAvailability(pair)
  const conditions = [...new Set((availableVariations.length ? availableVariations : pair.variations).map((variation) => variation.condition).filter(Boolean))]

  return (
    <article className="group flex min-w-0 flex-col">
      <Link to={`/products/${pair.id}`} className="storefront-focus relative block aspect-square overflow-hidden border border-border bg-card" aria-label={`View ${pair.name}${isSoldOut ? ', sold out' : ''}`}>
        <span className={`absolute left-3 top-3 z-10 px-2.5 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.15em] ${isSoldOut ? 'bg-foreground text-background' : 'bg-store-accent text-store-accent-foreground'}`}>
          {isSoldOut ? 'Sold' : 'Available'}
        </span>
        <img src={pair.image} alt={pair.name} loading="lazy" width="640" height="640" className={`h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transition-none sm:p-7 ${isSoldOut ? 'opacity-60 grayscale' : ''}`} />
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <Link to={`/products/${pair.id}`} className="storefront-focus text-sm font-semibold leading-5 hover:underline hover:underline-offset-4 sm:text-base">{pair.name}</Link>
        <p className="mt-1 text-xs text-muted-foreground">{conditions.slice(0, 2).join(' · ') || 'Condition unavailable'}</p>
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-border pt-3">
          <div>
            <p className="font-semibold tabular-nums">{startingPrice ? `${isSoldOut ? '' : 'From '}${formatPeso(startingPrice)}` : 'Price unavailable'}</p>
            <p className="mt-1 text-xs text-muted-foreground">{isSoldOut ? 'Sold archive' : `${sizeCount} ${sizeCount === 1 ? 'size' : 'sizes'} ready`}</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="size-11 shrink-0 rounded-none" aria-label={`Quick view ${pair.name}`}><Eye aria-hidden="true" /></Button>
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
