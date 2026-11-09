import { addDays, addMonths, format, isAfter, isBefore, isValid, parse } from "date-fns"

export function pendingColor(count: number) {
  if (count === 0) return "text-green-400"
  if (count <= 2) return "text-amber-400"
  return "text-red-400"
}

export function balanceColor(amount: number) {
  if (amount === 0) return "text-green-400"
  if (amount <= 5000) return "text-amber-400"
  return "text-red-400"
}

export function deltaColor(delta: number) {
  if (delta > 0) return "text-green-400"
  if (delta < 0) return "text-red-400"
  return "text-muted-foreground"
}


export function formatPeso(amount: number) {
  const sign = amount < 0 ? "-" : ""
  const value = Math.abs(amount).toLocaleString()

  return `${sign}₱${value}`
}

export function getStatementDateRange(period: string) {
  const [startLabel, endLabel] = period.split(" - ").map((label) => label.trim())
  if (!startLabel || !endLabel) return null

  const today = new Date()
  const parseMonthDay = (label: string, year: number) =>
    parse(label, "MMM dd", new Date(year, 0, 1))

  let start = parseMonthDay(startLabel, today.getFullYear())
  if (!isValid(start)) return null
  if (isAfter(start, addMonths(today, 1))) {
    start = parseMonthDay(startLabel, today.getFullYear() - 1)
  }

  let end = parseMonthDay(endLabel, start.getFullYear())
  if (!isValid(end)) return null
  if (isBefore(end, start)) {
    end = parseMonthDay(endLabel, start.getFullYear() + 1)
  }
  if (!isValid(end)) return null

  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(addDays(end, 1), "yyyy-MM-dd"),
  }
}


export function normalizePair(pair:string){
  if(!pair) return ''
    if(pair.toLocaleLowerCase().includes('nike sb stefan janoski')){
        const pairName = pair.toLocaleLowerCase().replace("nike sb stefan janoski", "");
       return pairName.toLocaleUpperCase()
    }
}
