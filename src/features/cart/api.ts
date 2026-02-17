import { apiClient } from "@/api/apiClient";
import type { AddToCartParams, RemoveFromCartParams } from "@/types/cart";


export const getCart = () => {
    return apiClient.get("/cart/get");
}

export function addToCart(payload: AddToCartParams) {
  return apiClient.post(
    "/cart/add",
    payload
  );
}

export function removeFromCart(payload: RemoveFromCartParams) {
  return apiClient.post("/cart/remove", payload);
}
