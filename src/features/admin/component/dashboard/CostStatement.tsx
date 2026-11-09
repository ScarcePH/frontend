import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { formatPeso, getStatementDateRange } from '@/utils/dashboard'
import { GetPurchaseStatement } from '@/api'
import { useQuery } from '@tanstack/react-query'
import type { PurchaseStatementResponse } from '@/features/admin/types/purchase'


const CostStatement = ({month}: {month: string | null}) => {
    const dateRange = month ? getStatementDateRange(month) : null
    const statement = useQuery<PurchaseStatementResponse>({
        queryKey: ['purchase-statement', dateRange?.startDate, dateRange?.endDate],
        queryFn: () => GetPurchaseStatement(dateRange!.startDate, dateRange!.endDate),
        enabled:  dateRange !== null,
    })
    const response = statement.data
    const purchases = response?.data ?? []
    const purchaseCount = new Set(purchases.map((purchase) => purchase.purchase_id)).size
  return (
    <>
    <div className="space-y-1">
          <DialogTitle>Purchases for {month ?? 'selected month'}</DialogTitle>
          <DialogDescription>
            {statement.isSuccess ? `${purchaseCount} ${purchaseCount === 1 ? 'purchase' : 'purchases'}` : 'Purchase statement'} <br/>
          </DialogDescription>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="font-semibold tabular-nums">{statement.isSuccess && response ? formatPeso(response.total_spent) : 'N/A'}</p>
        </div>

        {!dateRange ? (
          <div className="py-10 text-center text-sm text-destructive" role="alert">
            Unable to determine the selected month dates.
          </div>
        ) : statement.isLoading ? (
          <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
            <Spinner /> Loading purchases...
          </div>
        ) : statement.isError ? (
          <div className="py-10 text-center text-sm text-destructive" role="alert">
            Failed to load purchases for this month.
          </div>
        ) : purchases.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No purchases found for this month.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchase ID</TableHead>
                <TableHead>Variation ID</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Allocated Fees</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase, index) => (
                <TableRow key={`${purchase.purchase_id}-${purchase.variation_id}-${index}`}>
                  <TableCell>{purchase.purchase_id}</TableCell>
                  <TableCell>{purchase.variation_id ?? '—'}</TableCell>
                  <TableCell>{purchase.purchase_date}</TableCell>
                  <TableCell>{purchase.supplier ?? '—'}</TableCell>
                  <TableCell>{purchase.inventory_name}</TableCell>
                  <TableCell>{purchase.condition ?? '—'}</TableCell>
                  <TableCell>{purchase.size ?? '—'}</TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell>{formatPeso(purchase.unit_cost)}</TableCell>
                  <TableCell>{formatPeso(purchase.allocated_fees)}</TableCell>
                  <TableCell>{formatPeso(Number(purchase.total_spent))}</TableCell>
                  <TableCell>{formatPeso(Number(purchase.total_price))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

    </>
  );
};

export default CostStatement;