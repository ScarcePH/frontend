import { useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { ArrowRight, Filter, RefreshCw, Search, ShieldCheck, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { PairCard } from '../components/PairCard'
import { useGetPairs } from '../hooks/usePairs'
import {
  DEFAULT_CATALOG_FILTERS,
  catalogFiltersFromSearchParams,
  catalogFiltersToSearchParams,
  deriveCatalogOptions,
  filterAndSortCatalog,
  type CatalogFilterState,
} from '../utils/catalog'

const skeletonCards = Array.from({ length: 8 }, (_, index) => index)
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
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => catalogFiltersFromSearchParams(searchParams), [searchParams])
  const options = useMemo(() => deriveCatalogOptions(pairs), [pairs])
  const results = useMemo(() => filterAndSortCatalog(pairs, filters), [pairs, filters])
  const heroPair = pairs.find((pair) => pair.image)

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
      <section className="grid items-center gap-8 border-b border-border py-10 sm:py-14 lg:grid-cols-[1fr_0.85fr] lg:py-16">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-store-accent">Curated in the Philippines</p>
          <h1 className="text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Find your next<br />rare pair.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Distinct sneakers, clear condition details, and live size availability—ready when you are.</p>
          <Button asChild className="mt-7 min-h-12 rounded-none px-7 uppercase tracking-[0.14em]">
            <a href="#shop">Shop the collection <ArrowRight aria-hidden="true" /></a>
          </Button>
          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-foreground" /> Verified details</span>
            <span className="flex items-center gap-2"><Sparkles className="size-4 text-foreground" /> Curated pairs</span>
            <span className="flex items-center gap-2"><RefreshCw className="size-4 text-foreground" /> Live availability</span>
          </div>
        </div>
        <div className="relative hidden aspect-[4/3] overflow-hidden bg-muted lg:block">
          {heroPair ? <img src={heroPair.image} alt="" className="h-full w-full object-contain p-10" /> : <div className="h-full bg-[linear-gradient(135deg,var(--muted),var(--background))]" />}
          <span className="absolute bottom-4 left-4 bg-background px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em]">New rotation online</span>
        </div>
      </section>

      <section id="shop" aria-labelledby="catalog-heading" className="scroll-mt-28 pt-10 sm:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Shop</p>
            <h2 id="catalog-heading" className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">The collection</h2>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">{isLoading ? 'Loading products' : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}</p>
        </div>

        <div className="mt-7 grid gap-3 border-y border-border py-4 lg:grid-cols-[minmax(14rem,1fr)_minmax(9rem,0.65fr)_minmax(7rem,0.45fr)_minmax(9.5rem,0.7fr)_minmax(11.5rem,0.8fr)] lg:items-center">
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
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4" aria-label="Loading products">
            {skeletonCards.map((item) => <div key={item}><Skeleton className="aspect-square w-full rounded-none" /><Skeleton className="mt-4 h-4 w-4/5 rounded-none" /><Skeleton className="mt-3 h-4 w-1/2 rounded-none" /></div>)}
          </div>
        ) : isError ? (
          <div className="mt-8 flex min-h-72 items-center justify-center border border-border px-6 text-center" role="alert"><div><h3 className="text-xl font-semibold">We couldn’t load the collection.</h3><p className="mt-2 text-sm text-muted-foreground">Check your connection and try again.</p><Button className="mt-6 rounded-none" onClick={() => refetch()} disabled={isFetching}><RefreshCw className={isFetching ? 'animate-spin' : ''} />Try again</Button></div></div>
        ) : results.length ? (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-14">{results.map((pair) => <PairCard pair={pair} key={pair.id} />)}</div>
        ) : (
          <div className="mt-8 flex min-h-72 items-center justify-center border border-border px-6 text-center"><div className="max-w-md"><Search className="mx-auto size-6 text-muted-foreground" /><h3 className="mt-4 text-xl font-semibold">No matching pairs</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Try another search, size, or condition—or include the sold archive.</p><Button variant="outline" className="mt-6 rounded-none" onClick={clearAll}>Clear all filters</Button></div></div>
        )}
      </section>
    </main>
  )
}
