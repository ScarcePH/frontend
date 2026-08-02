import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldCheck } from "lucide-react"

type CheckoutHeaderProps = {
  onBack: () => void
}

export function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-7">
      <div>
        <Button type="button" variant="ghost" className="mb-4 min-h-11 rounded-none px-0 hover:bg-transparent hover:text-store-accent" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-store-accent">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Complete your order</h1>
      </div>
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><ShieldCheck className="size-4 text-foreground" /> Payment proof verified before fulfillment</p>
    </div>
  )
}
