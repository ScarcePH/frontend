import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPromotion,
  deletePromotion,
  endPromotion,
  getPromotions,
  updatePromotion,
} from '../api'
import type { PromotionPayload } from '../types/promotion'

function useInvalidatePromotionData() {
  const queryClient = useQueryClient()
  return () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ['promotions'] }),
    queryClient.invalidateQueries({ queryKey: ['active-promotion'] }),
    queryClient.invalidateQueries({ queryKey: ['product-catalog'] }),
    queryClient.invalidateQueries({ queryKey: ['inventory'] }),
    queryClient.invalidateQueries({ queryKey: ['get-cart'] }),
  ])
}

export function usePromotions() {
  return useQuery({ queryKey: ['promotions'], queryFn: getPromotions })
}

export function useCreatePromotion() {
  const invalidate = useInvalidatePromotionData()
  return useMutation({ mutationFn: createPromotion, onSuccess: invalidate })
}

export function useUpdatePromotion() {
  const invalidate = useInvalidatePromotionData()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PromotionPayload }) => updatePromotion(id, payload),
    onSuccess: invalidate,
  })
}

export function useEndPromotion() {
  const invalidate = useInvalidatePromotionData()
  return useMutation({ mutationFn: endPromotion, onSuccess: invalidate })
}

export function useDeletePromotion() {
  const invalidate = useInvalidatePromotionData()
  return useMutation({ mutationFn: deletePromotion, onSuccess: invalidate })
}
