import type { PairObj, VariationObj } from '@/types/pair'

export type CatalogAvailability = 'available' | 'all' | 'sold'
export type CatalogSort = 'default' | 'price-asc' | 'price-desc' | 'name'

export type CatalogFilterState = {
  q: string
  availability: CatalogAvailability
  size: string
  condition: string
  sort: CatalogSort
}

export const DEFAULT_CATALOG_FILTERS: CatalogFilterState = {
  q: '',
  availability: 'available',
  size: '',
  condition: '',
  sort: 'default',
}

export function isAvailableVariation(variation: VariationObj) {
  const status = variation.status?.toLowerCase() ?? ''
  return variation.stock > 0 && !['sold', 'unavailable', 'inactive'].includes(status)
}

export function isSoldPair(pair: PairObj) {
  if (typeof pair.is_sold === 'boolean') return pair.is_sold
  if (typeof pair.is_available === 'boolean') return !pair.is_available
  if (pair.status?.toLowerCase() === 'sold') return true
  return pair.variations.length > 0 && pair.variations.every((variation) => !isAvailableVariation(variation))
}

export function getPairAvailability(pair: PairObj) {
  const availableVariations = pair.variations.filter(isAvailableVariation)
  const displayVariations = availableVariations.length ? availableVariations : pair.variations
  const prices = displayVariations.map((variation) => variation.price).filter((price) => price > 0)

  return {
    isSold: isSoldPair(pair),
    isSoldOut: availableVariations.length === 0,
    availableVariations,
    sizeCount: new Set(availableVariations.map((variation) => variation.size)).size,
    startingPrice: prices.length ? Math.min(...prices) : null,
  }
}

export function deriveCatalogOptions(pairs: PairObj[]) {
  const sizes = new Set<string>()
  const conditions = new Set<string>()

  pairs.forEach((pair) => pair.variations.forEach((variation) => {
    if (variation.size) sizes.add(variation.size)
    if (variation.condition) conditions.add(variation.condition)
  }))

  return {
    sizes: [...sizes].sort((left, right) => left.localeCompare(right, undefined, { numeric: true })),
    conditions: [...conditions].sort((left, right) => left.localeCompare(right)),
  }
}

export function filterAndSortCatalog(pairs: PairObj[], filters: CatalogFilterState) {
  const query = filters.q.trim().toLocaleLowerCase()

  const filtered = pairs.filter((pair) => {
    const { isSoldOut } = getPairAvailability(pair)
    if (filters.availability === 'available' && isSoldOut) return false
    if (filters.availability === 'sold' && !isSoldOut) return false
    if (query && !`${pair.name} ${pair.description}`.toLocaleLowerCase().includes(query)) return false
    const variations = filters.availability === 'available'
      ? pair.variations.filter(isAvailableVariation)
      : pair.variations
    if ((filters.size || filters.condition) && !variations.some((variation) => (
      (!filters.size || variation.size === filters.size)
      && (!filters.condition || variation.condition === filters.condition)
    ))) return false
    return true
  })

  return filtered.sort((left, right) => {
    if (filters.sort === 'name') return left.name.localeCompare(right.name)
    if (filters.sort.startsWith('price')) {
      const leftPrice = getPairAvailability(left).startingPrice ?? Number.POSITIVE_INFINITY
      const rightPrice = getPairAvailability(right).startingPrice ?? Number.POSITIVE_INFINITY
      return filters.sort === 'price-asc' ? leftPrice - rightPrice : rightPrice - leftPrice
    }
    return pairs.indexOf(left) - pairs.indexOf(right)
  })
}

export function catalogFiltersFromSearchParams(params: URLSearchParams): CatalogFilterState {
  const availability = params.get('availability')
  const sort = params.get('sort')
  return {
    q: params.get('q') ?? '',
    availability: availability === 'all' || availability === 'sold' ? availability : 'available',
    size: params.get('size') ?? '',
    condition: params.get('condition') ?? '',
    sort: sort === 'price-asc' || sort === 'price-desc' || sort === 'name' ? sort : 'default',
  }
}

export function catalogFiltersToSearchParams(filters: CatalogFilterState) {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.availability !== DEFAULT_CATALOG_FILTERS.availability) params.set('availability', filters.availability)
  if (filters.size) params.set('size', filters.size)
  if (filters.condition) params.set('condition', filters.condition)
  if (filters.sort !== DEFAULT_CATALOG_FILTERS.sort) params.set('sort', filters.sort)
  return params
}

export function sortCatalogPairs(pairs: PairObj[]) {
  return [...pairs]
}
