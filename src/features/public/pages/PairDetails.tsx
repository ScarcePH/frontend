import { Link, useParams } from 'react-router'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import PairInfo from '../components/PairInfo'
import { useGetPairs } from '../hooks/usePairs'

export function PairDetails() {
  const { productId } = useParams()
  const { data: pairs = [], isLoading, isError, refetch, isFetching } = useGetPairs()
  const pair = pairs.find((item) => String(item.id) === productId)

  return (
    <main id="main-content" className="mx-auto w-full max-w-[90rem] px-4 pb-20 pt-6 sm:px-8 sm:pt-9 lg:px-12 xl:px-16">
      <Link to="/?availability=all#shop" className="storefront-focus inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] hover:underline hover:underline-offset-4"><ArrowLeft className="size-4" /> Back to shop</Link>
      {isLoading ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-2"><Skeleton className="aspect-square rounded-none" /><div className="space-y-5 py-4"><Skeleton className="h-5 w-32 rounded-none" /><Skeleton className="h-14 w-4/5 rounded-none" /><Skeleton className="h-24 w-full rounded-none" /><Skeleton className="h-28 w-full rounded-none" /></div></div>
      ) : isError ? (
        <div className="mt-6 flex min-h-[28rem] items-center justify-center border border-border text-center" role="alert"><div><h1 className="text-2xl font-semibold">Product unavailable</h1><p className="mt-2 text-sm text-muted-foreground">We couldn’t retrieve this product.</p><Button className="mt-6 rounded-none" onClick={() => refetch()} disabled={isFetching}><RefreshCw className={isFetching ? 'animate-spin' : ''} /> Try again</Button></div></div>
      ) : pair ? (
        <div className="mt-6"><PairInfo pair={pair} mode="page" /></div>
      ) : (
        <div className="mt-6 flex min-h-[28rem] items-center justify-center border border-border text-center"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-store-accent">404</p><h1 className="mt-3 text-2xl font-semibold">We couldn’t find that pair.</h1><p className="mt-2 text-sm text-muted-foreground">It may have been removed from the catalog.</p><Button asChild className="mt-6 rounded-none"><Link to="/">Browse the collection</Link></Button></div></div>
      )}
    </main>
  )
}
