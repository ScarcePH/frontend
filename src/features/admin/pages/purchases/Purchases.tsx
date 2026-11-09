import { useState, type FormEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, Plus, Receipt } from "lucide-react"
import { toast } from "sonner"
import {
  CreatePurchase,
  GetAllAvailablePairs,
  GetPurchases,
} from "@/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import type { InventoryObj } from "@/features/admin/types/Inventory"
import type { CreatePurchasePayload, Purchase } from "@/features/admin/types/purchase"
import { formatPeso } from "@/utils/dashboard"

import {
  format
} from "date-fns"

const PAGE_SIZE = 10

type VariationOption = {
  id: number
  label: string
}

type DraftItem = {
  variationId: string
  quantity: string
  unitCost: string
}

const newDraftItem = (): DraftItem => ({
  variationId: "",
  quantity: "1",
  unitCost: "",
})

function getVariationOptions(inventory: InventoryObj[] | undefined): VariationOption[] {
  return (inventory ?? []).flatMap((item) =>
    item.variations.map((variation) => ({
      id: variation.id,
      label: `${item.name} — ${variation.condition || "N/A"} / ${variation.size || "N/A"} US (ID ${variation.id})`,
    }))
  )
}

function formatPurchaseDate(value: string) {
  return format(new Date(value), "MMM dd yyyy")
}

export default function Purchases() {
  const [page, setPage] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const queryClient = useQueryClient()
  const invalidDateRange = Boolean(startDate && endDate && startDate >= endDate)

  const purchasesQuery = useQuery({
    queryKey: ["purchase-records", startDate, endDate, page],
    queryFn: () => GetPurchases({
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    enabled: !invalidDateRange,
  })

  const inventoryQuery = useQuery<InventoryObj[]>({
    queryKey: ["get-all-available-pairs"],
    queryFn: GetAllAvailablePairs, 
    staleTime: 30 * 60_000,
  })

  const createPurchase = useMutation({
    mutationFn: CreatePurchase,
    onSuccess: async () => {
      setCreateOpen(false)
      setPage(0)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["purchase-records"] }),
        queryClient.invalidateQueries({ queryKey: ["purchase-statement"] }),
        queryClient.invalidateQueries({ queryKey: ["cc-statement"] }),
      ])
    },
  })

  const purchases = purchasesQuery.data?.purchases ?? []
  const variationOptions = getVariationOptions(inventoryQuery.data)

  return (
    <div className="space-y-5 p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Purchases</h1>
          <p className="text-sm text-muted-foreground">
            Track supplier costs and restocks separately from customer-facing prices.
          </p>
          <p className="text-xs text-muted-foreground">
            Recording a purchase does not change inventory stock or listed prices.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Record purchase
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
            {createOpen && (
              <>
                <DialogHeader>
                  <DialogTitle>Record a purchase</DialogTitle>
                  <DialogDescription>
                    Add one or more inventory variations and their supplier costs.
                  </DialogDescription>
                </DialogHeader>
                <PurchaseForm
                  options={variationOptions}
                  inventoryLoading={inventoryQuery.isLoading}
                  inventoryError={inventoryQuery.isError}
                  isPending={createPurchase.isPending}
                  onCancel={() => setCreateOpen(false)}
                  onSubmit={(payload) => createPurchase.mutate(payload)}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="grid gap-1">
          <Label htmlFor="purchase-filter-start">Start date</Label>
          <Input
            id="purchase-filter-start"
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value)
              setPage(0)
            }}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="purchase-filter-end">End date (exclusive)</Label>
          <Input
            id="purchase-filter-end"
            type="date"
            value={endDate}
            onChange={(event) => {
              setEndDate(event.target.value)
              setPage(0)
            }}
          />
        </div>
        {(startDate || endDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStartDate("")
              setEndDate("")
              setPage(0)
            }}
          >
            Clear dates
          </Button>
        )}
      </div>

      {invalidDateRange ? (
        <p className="text-sm text-destructive" role="alert">
          Start date must be earlier than the exclusive end date.
        </p>
      ) : purchasesQuery.isError ? (
        <div className="space-y-3 rounded-md border p-6 text-center" role="alert">
          <p className="text-sm text-destructive">Failed to load purchase records.</p>
          <Button variant="outline" onClick={() => purchasesQuery.refetch()}>
            Try again
          </Button>
        </div>
      ) : purchasesQuery.isLoading ? (
        <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
          <Spinner /> Loading purchase records...
        </div>
      ) : purchases.length === 0 && page === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-md border text-center">
          <Receipt className="size-8 text-muted-foreground" />
          <p className="font-medium">No purchase records yet</p>
          <p className="text-sm text-muted-foreground">
            Record supplier costs here to start tracking purchases.
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchase date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total cost</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{formatPurchaseDate(purchase.purchase_date)}</TableCell>
                  <TableCell>{purchase.supplier || "—"}</TableCell>
                  <TableCell>{purchase.items.length}</TableCell>
                  <TableCell className="tabular-nums">{formatPeso(purchase.total_cost)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPurchase(purchase)}
                    >
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end gap-2">
            <span className="mr-2 text-sm text-muted-foreground">
              Page {page + 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0 || purchasesQuery.isFetching}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
            >
              <ChevronLeft />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={purchases.length < PAGE_SIZE || purchasesQuery.isFetching}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
              <ChevronRight />
            </Button>
          </div>
        </>
      )}

      <Dialog
        open={selectedPurchase !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPurchase(null)
        }}
      >
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-3xl">
          {selectedPurchase && (
            <PurchaseDetails purchase={selectedPurchase} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

type PurchaseFormProps = {
  options: VariationOption[]
  inventoryLoading: boolean
  inventoryError: boolean
  isPending: boolean
  onCancel: () => void
  onSubmit: (payload: CreatePurchasePayload) => void
}

function PurchaseForm({
  options,
  inventoryLoading,
  inventoryError,
  isPending,
  onCancel,
  onSubmit,
}: PurchaseFormProps) {
  const [supplier, setSupplier] = useState("")
  const [purchaseDate, setPurchaseDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [shippingFees, setShippingFees] = useState("0")
  const [otherFees, setOtherFees] = useState("0")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<DraftItem[]>([newDraftItem()])

  const updateItem = (index: number, patch: Partial<DraftItem>) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedShippingFees = parseMoney(shippingFees)
    const parsedOtherFees = parseMoney(otherFees)
    if (!purchaseDate) {
      toast.error("Choose a purchase date")
      return
    }
    if (parsedShippingFees === null || parsedOtherFees === null) {
      toast.error("Fees must be non-negative amounts with at most 2 decimal places")
      return
    }
    const parsedItems = items.map((item) => ({
      variation_id: Number(item.variationId),
      quantity: Number(item.quantity),
      unit_cost: parseMoney(item.unitCost),
    }))

    const invalidItem = parsedItems.some((item) =>
        !Number.isSafeInteger(item.variation_id) ||
        item.variation_id <= 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.unit_cost === null
    )
    if (invalidItem) {
      toast.error("Each item needs a variation, positive quantity, and valid unit cost")
      return
    }

    const validItems = parsedItems.filter(
      (item): item is typeof item & { unit_cost: number } => item.unit_cost !== null
    )
    const payload: CreatePurchasePayload = {
      purchase_date: purchaseDate,
      shipping_fees: parsedShippingFees,
      other_fees: parsedOtherFees,
      items: validItems.map((item) => ({
        variation_id: item.variation_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
      })),
    }

    if (supplier.trim()) payload.supplier = supplier.trim()
    if (notes.trim()) payload.notes = notes.trim()
    onSubmit(payload)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="purchase-supplier">Supplier</Label>
          <Input
            id="purchase-supplier"
            value={supplier}
            maxLength={255}
            onChange={(event) => setSupplier(event.target.value)}
            placeholder="Supplier name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="purchase-date">Purchase date</Label>
          <Input
            id="purchase-date"
            type="date"
            required
            value={purchaseDate}
            onChange={(event) => setPurchaseDate(event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="purchase-shipping">Shipping fees</Label>
            <Input
              id="purchase-shipping"
              type="number"
              min="0"
              step="0.01"
              required
              value={shippingFees}
              onChange={(event) => setShippingFees(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="purchase-other-fees">Other fees</Label>
            <Input
              id="purchase-other-fees"
              type="number"
              min="0"
              step="0.01"
              required
              value={otherFees}
              onChange={(event) => setOtherFees(event.target.value)}
            />
          </div>
        </div>
      </div>

      {inventoryLoading && (
        <p className="text-sm text-muted-foreground">Loading inventory variations...</p>
      )}
      {inventoryError && (
        <p className="text-sm text-destructive" role="alert">
          Inventory variations could not be loaded. Close this form and try again.
        </p>
      )}
      {!inventoryLoading && !inventoryError && options.length === 0 && (
        <p className="text-sm text-destructive" role="alert">
          Add an inventory variation before recording a purchase.
        </p>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-medium">Items</h2>
            <p className="text-xs text-muted-foreground">
              Fees are allocated across items by their purchase cost.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={inventoryLoading || inventoryError || options.length === 0}
            onClick={() => setItems((current) => [...current, newDraftItem()])}
          >
            <Plus />
            Add item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid items-end gap-3 rounded-md border p-3 sm:grid-cols-[minmax(0,2fr)_minmax(5rem,0.7fr)_minmax(7rem,1fr)_auto]"
            >
              <div className="grid-col-1 grid gap-2 oveflow-hidden">
                <div className="grid min-w-0 gap-2">
                  <Label htmlFor={`purchase-variation-${index}`}>Variation</Label>
                  <Select
                    value={item.variationId}
                    onValueChange={(value) => updateItem(index, { variationId: value })}
                    disabled={inventoryLoading || inventoryError}
                  >
                    <SelectTrigger id={`purchase-variation-${index}`} className="max-w-[260px] truncate">
                      <SelectValue placeholder="Choose a variation" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {options.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)} >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`purchase-quantity-${index}`}>Quantity</Label>
                <Input
                  id={`purchase-quantity-${index}`}
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={item.quantity}
                  onChange={(event) => updateItem(index, { quantity: event.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`purchase-unit-cost-${index}`}>Unit cost</Label>
                <Input
                  id={`purchase-unit-cost-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={item.unitCost}
                  onChange={(event) => updateItem(index, { unitCost: event.target.value })}
                  placeholder="0.00"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={items.length === 1}
                aria-label={`Remove item ${index + 1}`}
                onClick={() =>
                  setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-2">
        <Label htmlFor="purchase-notes">Notes</Label>
        <Textarea
          id="purchase-notes"
          value={notes}
          maxLength={5000}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional notes"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || inventoryLoading || inventoryError || options.length === 0}
        >
          {isPending ? "Saving..." : "Save purchase"}
        </Button>
      </DialogFooter>
    </form>
  )
}

function parseMoney(value: string): number | null {
  if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(value.trim())) return null
  const amount = Number(value)
  return Number.isFinite(amount) && amount <= 9_999_999_999.99 ? amount : null
}

function PurchaseDetails({ purchase }: { purchase: Purchase }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Purchase #{purchase.id}</DialogTitle>
        <DialogDescription>
          Purchased on {formatPurchaseDate(purchase.purchase_date)}
          {purchase.supplier ? ` from ${purchase.supplier}` : ""}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Items subtotal</p>
          <p className="font-medium tabular-nums">{formatPeso(purchase.subtotal)}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Shipping + other fees</p>
          <p className="font-medium tabular-nums">
            {formatPeso(purchase.shipping_fees + purchase.other_fees)}
          </p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Total cost</p>
          <p className="font-semibold tabular-nums">{formatPeso(purchase.total_cost)}</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Variation</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Unit cost</TableHead>
            <TableHead>Allocated fees</TableHead>
            <TableHead>Actual total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchase.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div>{item.inventory_name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.condition || "N/A"} / {item.size || "N/A"} US
                  {item.variation_id ? ` · ID ${item.variation_id}` : ""}
                </div>
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell className="tabular-nums">{formatPeso(item.unit_cost)}</TableCell>
              <TableCell className="tabular-nums">{formatPeso(item.allocated_fees)}</TableCell>
              <TableCell className="tabular-nums">{formatPeso(item.actual_total_cost)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {purchase.notes && (
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Notes</h3>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{purchase.notes}</p>
        </div>
      )}
    </>
  )
}
