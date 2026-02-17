import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { addToCart, getCart, removeFromCart } from "../api";
import type { CartObj } from "@/types/cart";



export const useGetCart = () => {
    // const {data} = useAuthCheck()
    return useQuery<CartObj>({
        queryKey:['get-cart'],
        queryFn: getCart
    })
}

export const useAddToCart= () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
    },
  });
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
    },
  });
}
