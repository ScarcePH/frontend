import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item'
import type { PairObj } from '@/types/pair'
import { formatPeso } from '@/utils/dashboard'
import PairInfo from './PairInfo'
import { getPairAvailability } from '../utils/catalog'

type PairProps = {
  pair: PairObj
}

export function PairCard({pair}:PairProps){
  const { isSold, isSoldOut, sizeCount, startingPrice } = getPairAvailability(pair)

  return(
    <Dialog>
      <DialogTrigger asChild>
        <Item
          variant="outline"
          role="button"
          tabIndex={0}
          className="h-full cursor-pointer content-start gap-0 overflow-hidden rounded-md bg-card p-0 transition duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ItemHeader className="block">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              {isSold ? (
                <span className="absolute right-2 top-2 rounded-sm bg-background/95 px-2 py-1 text-[10px] font-medium uppercase text-muted-foreground shadow-sm">
                  Sold
                </span>
              ) : null}
              <img
                src={pair.image}
                alt={pair.name}
                loading="lazy"
                className="h-full w-full object-contain p-3 transition duration-200 group-hover/item:scale-[1.02] sm:p-4"
              />
            </div>
          </ItemHeader>
          <ItemContent className="w-full gap-3 p-3 sm:p-4">
            <ItemTitle className="line-clamp-none min-h-10 w-full text-left text-sm font-medium leading-5 text-foreground">
              {pair.name}
            </ItemTitle>
            <div className="flex w-full flex-col gap-1 text-xs">
              <p className="font-medium text-foreground">
                {startingPrice ? `Starts at ${formatPeso(startingPrice)}` : 'Sold out'}
              </p>
              <p className="text-muted-foreground">
                {isSoldOut
                  ? 'No sizes available'
                  : `${sizeCount} ${sizeCount === 1 ? 'size' : 'sizes'} available`}
              </p>
            </div>
          </ItemContent>
        </Item>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogTitle className="sr-only">
          Pair info
        </DialogTitle>
        <PairInfo pair={pair}/>
      </DialogContent>
    </Dialog>
  )
}
