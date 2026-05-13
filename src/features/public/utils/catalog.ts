import type { PairObj, VariationObj } from '@/types/pair'

export function isAvailableVariation(variation: VariationObj) {
  const status = variation.status?.toLowerCase() ?? ''

  return variation.stock > 0 && !['sold', 'unavailable', 'inactive'].includes(status)
}

function isSoldVariation(variation: VariationObj) {
  return variation.status?.toLowerCase() === 'sold'
}

export function isSoldPair(pair: PairObj) {
  if (typeof pair.is_sold === 'boolean') {
    return pair.is_sold
  }

  if (typeof pair.is_available === 'boolean') {
    return !pair.is_available
  }

  if (pair.status?.toLowerCase() === 'sold') {
    return true
  }

  return pair.variations.length > 0 && pair.variations.every(isSoldVariation)
}

export function getPairAvailability(pair: PairObj) {
  const availableVariations = pair.variations.filter(isAvailableVariation)
  const prices = availableVariations.map((variation) => variation.price).filter(Boolean)
  const sizeCount = new Set(availableVariations.map((variation) => variation.size)).size
  const startingPrice = prices.length ? Math.min(...prices) : null

  return {
    isSold: isSoldPair(pair),
    isSoldOut: availableVariations.length === 0,
    availableVariations,
    sizeCount,
    startingPrice,
  }
}

export function sortCatalogPairs(pairs: PairObj[]) {
  return [...pairs].sort((left, right) => {
    const leftSold = getPairAvailability(left).isSoldOut
    const rightSold = getPairAvailability(right).isSoldOut

    if (leftSold === rightSold) {
      return 0
    }

    return leftSold ? 1 : -1
  })
}
