import {  GetDashboardSummary } from "@/api";
import {
  useQuery,
} from '@tanstack/react-query'
import { ClockFadingIcon, HandCoinsIcon, HistoryIcon, LandmarkIcon, WarehouseIcon } from "lucide-react";
import { deltaColor, formatPeso, pendingColor } from "@/utils/dashboard";
import { SummaryCard } from "../component/SummaryCard";
import { BestSelling } from "../component/BestSelling";
import { Link } from "react-router";
import { Trend } from "../component/Trend";
import { cn } from "@/lib/utils"
import { useNavigate } from 'react-router';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ReviewPayment from "./ReviewPayments";
import {SalesChart} from "../component/SalesChart";


function Dashboard() {
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: GetDashboardSummary,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    })

    if (isError) {
        return (
            <div className="m-6 text-sm text-destructive">
            Failed to load dashboard data
            </div>
        )
    }

    const pending = data?.pending_orders
    const outstanding = data?.outstanding_balance.amount
    const outstandingCount = data?.outstanding_balance.count
    const weekly = data?.orders_this_week
    const revenue = data?.revenue_this_month
    const net_profit = data?.net_profit_this_month
    const sitting_stocks = data?.total_value_in_stocks
    const sitting_stocks_profit = data?.total_value_in_stocks_profit

    

    return (
        <div>
            <div className="m-6 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
                
                <BestSelling/>

               
                <Dialog >
                    <DialogTrigger  className="cursor-pointer">  
                        <SummaryCard
                            trendIcon={<></>}
                            title="Pending Orders"
                            icon={<ClockFadingIcon className="w-4 h-4" />}
                            isLoading={isLoading}
                            value={pending}
                            valueClassName={pendingColor(pending)}
                            subtext={pending === 0 ? "All clear" : "Needs attention"}
                        />
                    </DialogTrigger>
                    <DialogContent className="flex justify-center items-center max-h-[95%] overflow-hidden">
                        <ReviewPayment/>
                    </DialogContent>
                </Dialog>
        
                <SummaryCard
                    trendIcon={<Trend delta={weekly?.delta}/>}
                    title="Orders This Week"
                    icon={<HistoryIcon className="w-4 h-4" />}
                    isLoading={isLoading}
                    value={
                        <p  
                            className="cursor-pointer"
                            onClick={()=>navigate(`/admin/orders?status=confirmed&range=this_week`)}
                        >
                           { weekly?.count}
                        </p>
                    }
                    subtext={
                        <span 
                            className={cn(deltaColor(weekly?.delta),"cursor-pointer")}
                            onClick={()=>navigate(`/admin/orders?status=confirmed&range=last_week`)}
                        >
                            {weekly?.delta > 0 && "+"}{weekly?.delta||"Even"} vs last week
                        </span>
                    }
                />
                 <SummaryCard
                        trendIcon={<></>}
                        title="Stock Value Sitting"
                        icon={<WarehouseIcon className="w-4 h-4"/>}
                        isLoading={isLoading}
                        value={formatPeso(sitting_stocks)}
                        subtext={`Profit ${formatPeso(sitting_stocks_profit)}`}
                />


                <Link  to="/admin/orders?status=confirmed" className="block">
                    <SummaryCard
                        trendIcon={<></>}
                        title="Outstanding Balance"
                        icon={<HandCoinsIcon className="w-4 h-4"/>}
                        isLoading={isLoading}
                        value={formatPeso(outstanding)}
                        subtext={`Across ${outstandingCount} orders`}
                    />
                </Link>

                <SummaryCard
                    trendIcon={<Trend delta={revenue?.delta}/>}
                    title="Revenue (Month)"
                    icon={<LandmarkIcon className="w-4 h-4" />}
                    isLoading={isLoading}
                    value={formatPeso(revenue?.amount)}
                    subtext={
                    <span className={deltaColor(revenue?.delta)}>
                        {revenue?.delta > 0 ? "Up +":"Down "}{formatPeso(revenue?.delta)} vs last month
                    </span>
                    }
                />
                <SummaryCard
                    trendIcon={<Trend delta={net_profit?.delta}/>}
                    title="Profit (Month)"
                    icon={<LandmarkIcon className="w-4 h-4" />}
                    isLoading={isLoading}
                    value={formatPeso(net_profit?.amount)}
                    subtext={
                    <span className={deltaColor(net_profit?.delta)}>
                        {net_profit?.delta > 0 ? "Up +":"Down "}{formatPeso(net_profit?.delta)} vs last month
                    </span>
                    }
                />
          
                <div className="col-span-2 md:col-span-2 ">
                    <SalesChart/>
                </div>

            </div>
           

        </div>
    )
}



export default Dashboard;

