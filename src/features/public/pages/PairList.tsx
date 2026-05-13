import { Skeleton } from '@/components/ui/skeleton'
import { PairCard } from '../components/PairCard'
import { useGetPairs } from '../hooks/usePairs'

const skeletonCards = Array.from({ length: 10 }, (_, index) => index)

export function PairList(){
  const { data: pairs, isLoading } = useGetPairs()
  const pairCount = pairs?.length ?? 0
   
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <section className="mb-8 flex flex-col gap-5 border-b pb-8 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase text-muted-foreground">
            Scarce Storefront
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Curated pairs, ready to browse.
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A focused collection of sneakers from the Scarce archive.
          </p>
        </div>
        <div className="rounded-md border px-4 py-3 text-sm">
          <span className="font-medium">{isLoading ? 'Loading' : pairCount}</span>
          <span className="ml-1 text-muted-foreground">
            {pairCount === 1 ? 'pair' : 'pairs'}
          </span>
        </div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {skeletonCards.map((item) => (
            <div key={item} className="rounded-md border bg-card p-3">
              <Skeleton className="aspect-[4/3] w-full rounded-sm" />
              <Skeleton className="mt-4 h-4 w-4/5" />
              <Skeleton className="mt-3 h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : pairCount > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {pairs?.map((pair) => (
            <PairCard pair={pair} key={pair.id}/>
          ))}
        </div>
      ) : (
        <div className="flex min-h-80 items-center justify-center rounded-md border border-dashed px-6 text-center">
          <div className="max-w-md">
            <h2 className="text-lg font-medium">No pairs listed</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The collection is empty right now. Check back when new archive pairs are listed.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
