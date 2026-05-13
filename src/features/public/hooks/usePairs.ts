import { useQuery } from '@tanstack/react-query'
import { getProductCatalog } from '../api'
import type { PairObj } from '@/types/pair'
import { sortCatalogPairs } from '../utils/catalog'


export const useGetPairs = () => {
    return useQuery<PairObj[]>({
        queryKey:['product-catalog'],
        queryFn: getProductCatalog,
        select: sortCatalogPairs
    })
}
