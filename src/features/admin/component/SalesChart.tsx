"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { SalesBarChart } from "@/api"
import { useQuery } from "@tanstack/react-query";


export const description = "A stacked bar chart with a legend"

const chartData = [
  { month: "January", spent: 186, profit: 80 },
  { month: "February", spent: 305, profit: 200 },
  { month: "March", spent: 237, profit: 120 },
  { month: "April", spent: 73, profit: 190 },
  { month: "May", spent: 209, profit: 130 },
  { month: "June", spent: 214, profit: 140 },
]

const chartConfig = {
  spent: {
    label: "Spent",
    color: "var(--chart-1)",
  },
  profit: {
    label: "Profit",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function SalesChart() {
    const {
        data:chartData,
    } = useQuery<[]>({
        queryFn:SalesBarChart,
        queryKey: ["sales-bar-chart"],
    })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales History</CardTitle>
        <CardDescription>Last 6 months </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="spent"
              stackId="a"
              fill="var(--color-spent)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="profit"
              stackId="a"
              fill="var(--color-profit)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
