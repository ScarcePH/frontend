import { GetBestSeller } from "@/api";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import type { BestsellerItem } from "@/features/admin/types/dashboard";
import { normalizePair } from "@/utils/dashboard";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react";
import { useState } from "react";


export function BestSelling () {
    const {
        data,
        isLoading,
        isError,
        isFetching
    } = useQuery<BestsellerItem[]>({
        queryFn:GetBestSeller,
        queryKey: ["bestsellers"],
        staleTime: 30 * 60_000,
    })

    if (isError) {
        return (
            <div className="m-6 text-sm text-destructive">
                Failed to load Best sellers
            </div>
        )
    }

    const [toggle, setToggle] = useState ([
        {isOpen:false},
        {isOpen:false},
        {isOpen:false},
        {isOpen:false},
        {isOpen:false},
        {isOpen:false}
    ])
    const onToggle = (index:number) => {
        setToggle((v)=>
            v.map((x, i) =>
                i === index ? { ...x, isOpen: !x.isOpen } : x
            )
        )
    }

    return (
        <div className="col-span-2 row-span-2 border rounded-lg border-grey-800 md:p-7 p-5">
            <p className="text-xs md:text-sm ">
                Best selling
            </p>
            <div className="grid grid-cols-3 gap-8 md:gap-13 p-2 md:mt-4">
                {isLoading || !data || isFetching ? (
                    <>
                        <Skeleton className="h-8 w-20 mx-auto" />
                        <Skeleton className="h-3 w-24 mx-auto" />
                    </>
                ):(
                    data?.flatMap((pair,key)=>
                    <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Collapsible open={toggle[key].isOpen} onOpenChange={()=>onToggle(key)}>
                            <CollapsibleTrigger asChild>
                                <div key={key} className="cursor-pointer">
                                    <img src={pair?.image} 
                                        className="w-full rounded-sm object-fit"
                                    />
                                 
                                    <div className="flex items-center justify-center mt-2">
                                        <p className="text-xs md:text-xs text-center font-light ">
                                            {normalizePair(pair?.inventory_name)} 
                                        </p>
                                        <motion.span
                                            animate={{ rotate: toggle[key].isOpen ? 180 : 0 }}
                                            className="inline-flex"
                                        >
                                            <ChevronDown  className="w-4 h-4 ml-1 mr-1"/>
                                        </motion.span>
                                    </div>
                                        
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent asChild forceMount>
                            <motion.div
                                initial={false}
                                animate={toggle[key].isOpen? "open" : "closed"}
                                variants={{
                                    open: { height: "auto", opacity: 1 },
                                    closed: { height: 0, opacity: 0 },
                                }}
                                className="overflow-hidden"
                            >
                                {
                                pair?.sizes?.map((vars)=>
                                        <p className="text-left text-xs pt-1">
                                           &#9679; {vars.size}us ({vars.sold_count}) ₱{Math.abs(vars.revenue)}
                                        </p>
                                    )
                                }
                                </motion.div>
                            </CollapsibleContent>
                        </Collapsible>
                    </motion.div>
                )
            )}
            </div>
        </div>
    )
}