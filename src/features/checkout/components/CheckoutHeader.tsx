import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

type CheckoutHeaderProps = {
  onBack: () => void
}

export function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <Button type="button" variant="ghost" size="sm" className="mb-2" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <p className="text-sm text-muted-foreground">Checkout</p>
        <h1 className="text-2xl md:text-3xl font-semibold">Complete your order</h1>
      </div>
      <Badge variant="outline" className="text-xs">
        Secure payment verification
      </Badge>
    </div>
  )
}
