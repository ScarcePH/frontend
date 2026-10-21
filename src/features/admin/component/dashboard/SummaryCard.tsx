import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type SummaryCardProps = {
  title: string
  icon: React.ReactNode
  value?: React.ReactNode
  subtext?: React.ReactNode
  valueClassName?: string
  isLoading?: boolean,
  trendIcon: React.ReactNode
}

export function SummaryCard({
  title,
  icon,
  value,
  subtext,
  valueClassName,
  isLoading,
  trendIcon
}: SummaryCardProps) {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-2 text-xs md:text-sm">
          {icon}
          <span>{title}</span>
          {trendIcon}
        </div>

        {isLoading ? (
          <>
            <Skeleton className="h-8 w-20 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </>
        ) : (
          <>
            <p className={cn(
              "text-lg md:text-2xl text-center font-semibold",
              valueClassName
            )}>
              {value}
            </p>

            {subtext && (
              <p className="text-center text-xs text-muted-foreground">
                {subtext}
              </p>
            )}
          </>
        )}
      </CardHeader>
    </Card>
  )
}
