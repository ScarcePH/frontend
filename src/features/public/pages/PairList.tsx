import { useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { Filter, RefreshCw, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { PairCard } from '../components/PairCard'
import { useActivePromotion, useGetPairs } from '../hooks/usePairs'
import {
  DEFAULT_CATALOG_FILTERS,
  catalogFiltersFromSearchParams,
  catalogFiltersToSearchParams,
  deriveCatalogOptions,
  filterAndSortCatalog,
  getPromotedCatalogPairs,
  type CatalogFilterState,
} from '../utils/catalog'

const skeletonCards = Array.from({ length: 5 }, (_, index) => index)
const ALL_VALUE = '__all__'

type FilterControlsProps = {
  filters: CatalogFilterState
  sizes: string[]
  conditions: string[]
  onChange: <K extends keyof CatalogFilterState>(key: K, value: CatalogFilterState[K]) => void
}

type FilterSelectProps = {
  label: string
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  showLabel?: boolean
}

function FilterSelect({ label, value, onValueChange, children, showLabel = false }: FilterSelectProps) {
  return (
    <div className={showLabel ? 'grid min-w-0 gap-2' : 'min-w-0'}>
      {showLabel ? <span className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</span> : null}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger aria-label={label} className="h-12! w-full rounded-none border border-input bg-background px-3 shadow-none hover:bg-muted dark:bg-background dark:hover:bg-muted">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="storefront rounded-none bg-popover">
          {children}
        </SelectContent>
      </Select>
    </div>
  )
}

function FilterControls({ filters, sizes, conditions, onChange, showLabels = false }: FilterControlsProps & { showLabels?: boolean }) {
  return (
    <>
      <FilterSelect
        label="Availability"
        value={filters.availability}
        onValueChange={(value) => onChange('availability', value as CatalogFilterState['availability'])}
        showLabel={showLabels}
      >
        <SelectItem value="available">Available now</SelectItem>
        <SelectItem value="all">All products</SelectItem>
        <SelectItem value="sold">Sold archive</SelectItem>
      </FilterSelect>
      <FilterSelect
        label="Size"
        value={filters.size || ALL_VALUE}
        onValueChange={(value) => onChange('size', value === ALL_VALUE ? '' : value)}
        showLabel={showLabels}
      >
        <SelectItem value={ALL_VALUE}>All sizes</SelectItem>
        {sizes.map((size) => <SelectItem key={size} value={size}>US {size}</SelectItem>)}
      </FilterSelect>
      <FilterSelect
        label="Condition"
        value={filters.condition || ALL_VALUE}
        onValueChange={(value) => onChange('condition', value === ALL_VALUE ? '' : value)}
        showLabel={showLabels}
      >
        <SelectItem value={ALL_VALUE}>All conditions</SelectItem>
        {conditions.map((condition) => <SelectItem key={condition} value={condition}>{condition}</SelectItem>)}
      </FilterSelect>
    </>
  )
}

function SortControl({ filters, onChange, showLabel = false }: Pick<FilterControlsProps, 'filters' | 'onChange'> & { showLabel?: boolean }) {
  return (
    <FilterSelect
      label="Sort products"
      value={filters.sort}
      onValueChange={(value) => onChange('sort', value as CatalogFilterState['sort'])}
      showLabel={showLabel}
    >
      <SelectItem value="default">Featured</SelectItem>
      <SelectItem value="price-asc">Price: low to high</SelectItem>
      <SelectItem value="price-desc">Price: high to low</SelectItem>
      <SelectItem value="name">Name</SelectItem>
    </FilterSelect>
  )
}

export function PairList() {
  const { data: pairs = [], isLoading, isError, isFetching, refetch } = useGetPairs()
  const activePromotion = useActivePromotion()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => catalogFiltersFromSearchParams(searchParams), [searchParams])
  const options = useMemo(() => deriveCatalogOptions(pairs), [pairs])
  const results = useMemo(() => filterAndSortCatalog(pairs, filters), [pairs, filters])
  const janoskis = useMemo(() => results.filter((pair) => pair.category === 'janoski'), [results])
  const basketball = useMemo(() => results.filter((pair) => pair.category === 'basketball'), [results])
  const promotedPairs = useMemo(() => getPromotedCatalogPairs(results, filters), [results, filters])
  const promotion = activePromotion.data?.promotion

  const updateFilter = <K extends keyof CatalogFilterState>(key: K, value: CatalogFilterState[K]) => {
    setSearchParams(catalogFiltersToSearchParams({ ...filters, [key]: value }), { replace: true })
  }
  const clearAll = () => setSearchParams(new URLSearchParams(), { replace: true })
  const activeFilters = [
    filters.q ? { key: 'q' as const, label: `“${filters.q}”` } : null,
    filters.availability !== 'available' ? { key: 'availability' as const, label: filters.availability === 'sold' ? 'Sold archive' : 'All products' } : null,
    filters.size ? { key: 'size' as const, label: `US ${filters.size}` } : null,
    filters.condition ? { key: 'condition' as const, label: filters.condition } : null,
  ].filter(Boolean) as Array<{ key: keyof CatalogFilterState; label: string }>

  const clearFilter = (key: keyof CatalogFilterState) => updateFilter(key, DEFAULT_CATALOG_FILTERS[key] as never)

  return (
    <main id="main-content" className="mx-auto w-full max-w-[90rem] px-4 pb-20 sm:px-8 lg:px-12 xl:px-16">


      <section id="shop" aria-labelledby="catalog-heading" className="scroll-mt-20 pt-10 sm:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Shop</p>
            <h2 id="catalog-heading" className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">The collection</h2>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">{isLoading ? 'Loading products' : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}</p>
        </div>

        <div className="mt-6 grid gap-3 border-b border-border pb-4 lg:grid-cols-[minmax(14rem,1fr)_minmax(9rem,0.65fr)_minmax(7rem,0.45fr)_minmax(9.5rem,0.7fr)_minmax(11.5rem,0.8fr)] lg:items-center">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="catalog-search" type="search" value={filters.q} onChange={(event) => updateFilter('q', event.target.value)} placeholder="Search names and descriptions" className="h-12 rounded-none pl-10" />
          </label>
          <div className="hidden lg:contents">
            <FilterControls filters={filters} sizes={options.sizes} conditions={options.conditions} onChange={updateFilter} />
            <SortControl filters={filters} onChange={updateFilter} />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" className="h-12 rounded-none"><Filter /> Filters</Button></SheetTrigger>
              <SheetContent side="bottom" className="storefront max-h-[90dvh] overflow-y-auto rounded-t-2xl border-border bg-background px-5 pb-8">
                <SheetHeader className="px-0"><SheetTitle className="text-xl">Filter products</SheetTitle></SheetHeader>
                <div className="grid gap-5 pt-6">
                  <FilterControls filters={filters} sizes={options.sizes} conditions={options.conditions} onChange={updateFilter} showLabels />
                  <Button variant="outline" className="mt-1 h-12 w-full rounded-none" onClick={clearAll}>Clear all</Button>
                </div>
              </SheetContent>
            </Sheet>
            <SortControl filters={filters} onChange={updateFilter} />
          </div>
        </div>

        {activeFilters.length ? (
          <div className="flex flex-wrap items-center gap-2 py-4">
            {activeFilters.map((filter) => (
              <button key={filter.key} type="button" onClick={() => clearFilter(filter.key)} className="storefront-focus inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-xs hover:bg-muted" aria-label={`Remove ${filter.label} filter`}>
                {filter.label}<X className="size-3.5" />
              </button>
            ))}
            <button type="button" onClick={clearAll} className="storefront-focus min-h-11 px-2 text-xs font-semibold underline underline-offset-4">Clear all</button>
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-10 space-y-14 sm:space-y-16" aria-label="Loading products">
            {['Janoskis', 'Basketball'].map((category) => (
              <section key={category} aria-hidden="true">
                <div className="mb-5 flex items-center gap-4"><Skeleton className="h-6 w-24 rounded-none" /><div className="h-px flex-1 bg-border" /></div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-7 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-14">
                  {skeletonCards.map((item) => <div key={item}><Skeleton className="aspect-square w-full rounded-none bg-muted/60" /><Skeleton className="mt-3 h-4 w-4/5 rounded-none" /><Skeleton className="mt-2 h-4 w-1/2 rounded-none" /></div>)}
                </div>
              </section>
            ))}
          </div>
        ) : isError ? (
          <div className="mt-8 flex min-h-72 items-center justify-center border border-border px-6 text-center" role="alert"><div><h3 className="text-xl font-semibold">We couldn’t load the collection.</h3><p className="mt-2 text-sm text-muted-foreground">Check your connection and try again.</p><Button className="mt-6 rounded-none" onClick={() => refetch()} disabled={isFetching}><RefreshCw className={isFetching ? 'animate-spin' : ''} />Try again</Button></div></div>
        ) : results.length ? (
          <div className="mt-10 space-y-14 sm:space-y-16">
            {promotion && promotedPairs.length ? (
              <section aria-labelledby="promotion-heading" className="border border-store-accent/40 bg-store-accent/5 p-4 sm:p-6">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-store-accent">Limited promotion</p>
                    <h3 id="promotion-heading" className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{promotion.name}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{promotion.description}</p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {promotion.start_date} — {promotion.end_date}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-7 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-14">
                  {promotedPairs.map((pair) => <PairCard pair={pair} promotionOnly key={`promotion-${pair.id}`} />)}
                </div>
              </section>
            ) : null}
            {janoskis.length ? (
              <section aria-labelledby="janoskis-heading">
                <div className="mb-5 flex items-center gap-4">
                  <h3 id="janoskis-heading" className="text-lg font-semibold tracking-[-0.025em] sm:text-xl">Janoskis</h3>
                  <div className="h-px flex-1 bg-foreground" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-7 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-14">{janoskis.map((pair) => <PairCard pair={pair} key={pair.id} />)}</div>
              </section>
            ) : null}
            {basketball.length ? (
              <section aria-labelledby="basketball-heading">
                <div className="mb-5 flex items-center gap-4">
                  <h3 id="basketball-heading" className="text-lg font-semibold tracking-[-0.025em] sm:text-xl">Basketball</h3>
                  <div className="h-px flex-1 bg-foreground" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-7 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-14">{basketball.map((pair) => <PairCard pair={pair} key={pair.id} />)}</div>
              </section>
            ) : null}
          </div>
        ) : (
          <div className="mt-8 flex min-h-72 items-center justify-center border border-border px-6 text-center"><div className="max-w-md"><Search className="mx-auto size-6 text-muted-foreground" /><h3 className="mt-4 text-xl font-semibold">No matching pairs</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Try another search, size, or condition—or include the sold archive.</p><Button variant="outline" className="mt-6 rounded-none" onClick={clearAll}>Clear all filters</Button></div></div>
        )}
      </section>
    </main>
  )
}
