import { Dialog, DialogContent,  } from '@/components/ui/dialog'
import CostStatement from './CostStatement'
import IncomeStatement from './IncomeStatement'



type PurchaseStatementModalProps = {
  month: string | null
  open: boolean
  onOpenChange: (open: boolean) => void,
  type: "cost" | "payment_received"
}





export function StatementModal({ month, open, onOpenChange, type }: PurchaseStatementModalProps) {
 console.log(type)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] md:!max-w-[60%] !max-w-[90%] overflow-y-auto">
        {month && 
          type === "cost" ? (
            <CostStatement month={month} />
          ) : 
          type === "payment_received" ? (
            <IncomeStatement month={month}  />
          ):<></>}
      </DialogContent>
    </Dialog>
  )
}