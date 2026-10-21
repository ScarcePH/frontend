import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { formatPeso } from '@/utils/dashboard'
import { GetIncomeStatement } from '@/api'
import { useQuery } from '@tanstack/react-query'


type IncomeRecord = {
  order_id: number
  variation_id: number
  inventory_name: string
  condition: string
  size: number | string
  total_received: number
  total_spent: number
  net_profit: number,
  date: string
}

type IncomeStatementResponse = {
  data: IncomeRecord[]
  total_received: number
  total_spent: number
  total_net_profit: number
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

const IncomeStatement = ({month}: {month: string | null}) => {
    const dateRange = month ? getDateRange(month) : null
    const statement = useQuery<IncomeStatementResponse>({
        queryKey: ['income-statement', dateRange?.startDate, dateRange?.endDate],
        queryFn: () => GetIncomeStatement(dateRange!.startDate, dateRange!.endDate),
        enabled:  dateRange !== null,
    })
    const response = statement.data
    const income = response?.data ?? []
  return (
    <>
    <div className="space-y-1">
          <DialogTitle>Income Statement for {month ?? 'selected month'}</DialogTitle>
          <DialogDescription>
            {statement.isSuccess ? `${income.length} ${income.length === 1 ? 'transaction' : 'transactions'}` : 'Income statement'}
          </DialogDescription>
        </div>

        {!dateRange ? (
          <div className="py-10 text-center text-sm text-destructive" role="alert">
            Unable to determine the selected month dates.
          </div>
        ) : statement.isLoading ? (
          <div className="flex min-h-40 items-center justify-center gap-2 text-muted-foreground">
            <Spinner /> Loading income statement...
          </div>
        ) : statement.isError ? (
          <div className="py-10 text-center text-sm text-destructive" role="alert">
            Failed to load the income statement for this month.
          </div>
        ) : response ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="font-semibold tabular-nums">{formatPeso(response.total_received)}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="font-semibold tabular-nums">{formatPeso(response.total_spent)}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="font-semibold tabular-nums">{formatPeso(response.total_net_profit)}</p>
              </div>
            </div>

            {income.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No income transactions found for this month.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Variation ID</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Date Sold</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Total Received</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Net Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {income.map((record) => (
                    <TableRow key={`${record.order_id}-${record.variation_id}`}>
                      <TableCell>{record.order_id}</TableCell>
                      <TableCell>{record.variation_id}</TableCell>
                      <TableCell>{record.inventory_name}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.condition}</TableCell>
                      <TableCell>{record.size}</TableCell>
                      <TableCell className="tabular-nums">{formatPeso(record.total_received)}</TableCell>
                      <TableCell className="tabular-nums">{formatPeso(record.total_spent)}</TableCell>
                      <TableCell className="tabular-nums">{formatPeso(record.net_profit)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        ) : (
          <div className="py-10 text-center text-sm text-destructive" role="alert">
            The income statement response was empty.
          </div>
        )}

    </>
  );
};

export default IncomeStatement;