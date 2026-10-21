import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { formatPeso } from '@/utils/dashboard'
import { GetPurchaseStatement } from '@/api'
import { useQuery } from '@tanstack/react-query'


type PurchaseRecord = {
  variation_id: number
  inventory_name: string,
  date: string
  condition: string
  size: number | string
  total_spent: number
  total_price: number
}

type PurchaseStatementResponse = {
  purchases: PurchaseRecord[]
  total_spent: number
  total_price: number
}


function getDateRange(sampleDate:string) {
    const [start, end] = sampleDate.split(" - ");

    const currentYear = new Date().getFullYear();

    const parseDate = (date: string, year: number) => {
        const parsed = new Date(`${date}, ${year}`);

        return `${parsed.getFullYear()}/${String(
        parsed.getMonth() + 1
        ).padStart(2, "0")}/${String(parsed.getDate()).padStart(2, "0")}`;
    };

    const startDate = parseDate(start, currentYear);
    let endDate = parseDate(end, currentYear);

    if (new Date(endDate) < new Date(startDate)) {
        endDate = parseDate(end, currentYear + 1);
    }

    return { startDate, endDate };
}

const CostStatement = ({month}: {month: string | null}) => {
    const dateRange = month ? getDateRange(month) : null
    const statement = useQuery<PurchaseStatementResponse>({
        queryKey: ['purchase-statement', dateRange?.startDate, dateRange?.endDate],
        queryFn: () => GetPurchaseStatement(dateRange!.startDate, dateRange!.endDate),
        enabled:  dateRange !== null,
    })
    const response = statement.data
    const records = Array.isArray(response)
        ? response
        : typeof response === 'object' && response !== null
        ? (response as Record<string, unknown>).purchases ?? (response as Record<string, unknown>).data ?? (response as Record<string, unknown>).items
        : []
    const purchases = Array.isArray(records) ? records as PurchaseRecord[] : []
  return (
    <>
    <div className="space-y-1">
          <DialogTitle>Purchases for {month ?? 'selected month'}</DialogTitle>
          <DialogDescription>
            {statement.isSuccess ? `${purchases.length} ${purchases.length === 1 ? 'purchase' : 'purchases'}` : 'Purchase statement'} <br/>
            Total purchases: {statement.isSuccess && response ? formatPeso(Number(response.total_spent)) : 'N/A'}
          </DialogDescription>
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
                <TableHead>Variation ID</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase, index) => (
                <TableRow key={`${purchase.variation_id}-${purchase.condition}-${purchase.size}-${index}`}>
                  <TableCell>{purchase.variation_id}</TableCell>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>{purchase.inventory_name}</TableCell>
                  <TableCell>{purchase.condition}</TableCell>
                  <TableCell>{purchase.size}</TableCell>
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