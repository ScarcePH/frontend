"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CostLineChart, GetPurchaseStatement } from "@/api"
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StatementModal } from "./StatementModal";
import { getStatementDateRange } from "@/utils/dashboard";

export const description = "A multiple line chart"

type CostLineChartPoint = {
  month: string
  cost: number
  payment_received: number
}

async function getCostLineChartData(): Promise<CostLineChartPoint[]> {
  const periods: CostLineChartPoint[] = await CostLineChart()
  return Promise.all(periods.map(async (period) => {
    const dateRange = getStatementDateRange(period.month)
    if (!dateRange) {
      throw new Error(`Unable to determine dates for purchase statement: ${period.month}`)
    }

    const statement = await GetPurchaseStatement(dateRange.startDate, dateRange.endDate)
    return { ...period, cost: statement.total_spent }
  }))
}

const chartConfig = {
  cost: {
    label: "Purchase cost",
    color: "var(--chart-1)",
  },
  payment_received: {
    label: "Income",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function CC_Line_Chart() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [breakdownType, setBreakdownType] = useState<"cost" | "payment_received">("cost")

  const {
    data: chartData,
    isLoading,
    isError,
  } = useQuery<CostLineChartPoint[]>({
    queryFn: getCostLineChartData,
    queryKey: ["cc-statement"],
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit card cycle</CardTitle>
        <CardDescription>Purchase costs and payments over the last 3 billing periods</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
            Loading statement data...
          </div>
        ) : isError ? (
          <div className="flex aspect-video items-center justify-center text-sm text-destructive" role="alert">
            Failed to load statement data
          </div>
        ) : chartData?.length ? (
          <>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 60,
                right: 30,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="payment_received"
                type="monotone"
                stroke="var(--color-payment_received)"
                strokeWidth={2}
                dot={{ 
                  r: 4, cursor: "pointer",
                 
                }}
                activeDot={{ 
                  r: 6, cursor: "pointer",
                   onClick: (event: any, props: any) => {
                    if (typeof props.payload.month === "string" && event) {
                      setSelectedMonth(props.payload.month)
                      setBreakdownType("payment_received")
                      setOpenModal(true)
                    }
               
                  }, 
                }}
                
              />
              <Line
                dataKey="cost"
                type="monotone"
                stroke="var(--color-cost)"
                strokeWidth={2}
                dot={{ 
                  r: 4, cursor: "pointer",
               
                }}
                activeDot={{ r: 6, cursor: "pointer",
                  onClick: (event: any, props: any) => {
                    if (typeof props.payload.month === "string" && event) {
                      setSelectedMonth(props.payload.month)
                      setBreakdownType("cost")
                      setOpenModal(true)
                    }
                  },
                }}
              />
          
            </LineChart>
          </ChartContainer>
          <StatementModal
            type={breakdownType}
            month={selectedMonth}
            open={openModal}
            onOpenChange={(open: boolean) => { 
              setOpenModal(open)
            }}            
          />
          </>
        ) : (
          <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
            No statement data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
