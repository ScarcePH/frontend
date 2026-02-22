import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Item, ItemContent, ItemGroup, ItemHeader, ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { formatPeso } from "@/utils/dashboard"
import type { CheckoutSessionItem } from "../api"
import type { OrderSummaryProps } from "./types"

function OrderSummaryItem({ item }: { item: CheckoutSessionItem }) {
  const firstVariation = item.inventory?.variations?.[0]
  return (
    <Item variant="outline" size="sm">
      {item.inventory?.image ? (
        <img src={item.inventory.image} alt={item.inventory?.name ?? "Item image"} className="w-23 rounded-sm object-fit" />
      ) : null}
      <ItemHeader>
        <ItemTitle className="capitalize">{item.inventory?.name ?? "Item"}</ItemTitle>
        <span className="text-xs text-muted-foreground">x{item.qty}</span>
      </ItemHeader>
      <ItemContent className="text-muted-foreground">
        <div className="flex items-center justify-between text-xs">
          <span>{firstVariation?.condition ?? "-"}</span>
          <span>{firstVariation?.price ? formatPeso(firstVariation.price * item.qty) : "-"}</span>
        </div>
      </ItemContent>
    </Item>
  )
}

export function OrderSummary({ isLoading, hasSessionId, sessionItems, sessionTotal }: OrderSummaryProps) {
  const hasItems = sessionItems.length > 0

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Review your items and totals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner />
            Loading order...
          </div>
        ) : hasItems ? (
          <ItemGroup>
            {sessionItems.map((item, index) => (
              <OrderSummaryItem key={`${item.inventory?.id ?? "inv"}-${index}`} item={item} />
            ))}
          </ItemGroup>
        ) : (
          <p className="text-sm text-muted-foreground">
            {hasSessionId
              ? "Checkout session started. Item details will appear here if available."
              : "No active checkout session. Please start checkout again."}
          </p>
        )}

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPeso(sessionTotal)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>Calculated after verification</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>{formatPeso(sessionTotal)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="text-xs text-muted-foreground">
          By submitting, you agree to our payment verification process.
        </div>
      </CardFooter>
    </Card>
  )
}
