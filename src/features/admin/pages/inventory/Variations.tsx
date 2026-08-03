import { Button } from "@/components/ui/button"
import { Edit2Icon, PlusCircleIcon } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { VariationItem } from "./VariationItem"
import type { VariationsProps } from "@/features/admin/types/variations"
import { useEffect, useMemo, useState } from "react"
import { useVariations } from "../../hooks/useVariations"
import CarouselWithFullScreen from "@/components/CarouselWithFullScreen"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEditPair } from "../../hooks/useInventory"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



export function Variations({pair}: VariationsProps){
    const { vars, add, remove, toggle, update, submitVariation, addVariations, buildVariationPayload} = useVariations()
    const [editPair, setEditPair] = useState({name:pair.name, description:pair.description, category:pair.category})
    const {mutate: requestEditPair, isPending} = useEditPair()
    
    useEffect(()=>{
        addVariations(pair.variation)
    },[pair])

    const carousel = useMemo(() => {
        const openedVar = vars.find((data) => data.isOpen)
        return openedVar?.image?.length
            ? [pair.image, ...openedVar.image]
            : [pair.image]
    }, [pair.image, vars])

    const handleConfirm = () => {
        const variations = buildVariationPayload(vars)
        const payload = {pairId:pair.id, variations}
        submitVariation.mutate(payload)

    }

    const handleEditPair = async () => {
        await requestEditPair({...editPair, inventory_id:pair.id},{
            onSuccess:()=>toast.success('Successfully edit pair'),
            onError:(e)=>toast.error("Failed to edit" + e)        
        })
    }

    return(
        <Popover>
        <div className="flex flex-col max-h-[76vh] w-full">


            <div className="shrink-0 flex justify-center py-2">
                <CarouselWithFullScreen images={carousel}/>
            </div>

            <PopoverTrigger asChild>
            <div className="flex items-center cursor-pointer hover:underline space-x-2 mb-4">
                   
    
        
     

                <p className="text-sm">
                    {pair.name}
                </p>
                <Edit2Icon size={13}/>
            </div>
             </PopoverTrigger>

            <div className="flex justify-between items-center mb-2 px-3">
                <p>
                    Variations
                </p>
                <Button size='sm' variant='outline' onClick={add} className="space-x-3">
                    Add variation
                    <PlusCircleIcon />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
                <AnimatePresence>
                {vars.map((v, i) => (
                    <VariationItem
                    key={i}
                    data={v}
                    index={i}
                    onToggle={() => toggle(i)}
                    onRemove={() => remove(i)}
                    onUpdate={(k, val) => update(i, k, val)}
                    />
                ))}
                </AnimatePresence>
            </div>

            <div className="mt-2 flex justify-center">
                <Button 
                    variant='outline' 
                    onClick={handleConfirm} 
                    disabled={submitVariation.isPending}
                >
                    Confirm
                </Button>
            </div>
            <PopoverContent>
                <Input
                    value={editPair.name}
                    onChange={(e)=>setEditPair({...editPair, name:e.target.value})}

                />
                <Textarea
                    value={editPair.description}
                    onChange={(e)=>setEditPair({...editPair, description:e.target.value})}
                />
                <Select
                    value={editPair.category}
                    onValueChange={(category: typeof editPair.category) => setEditPair({...editPair, category})}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="janoski">Janoski</SelectItem>
                        <SelectItem value="basketball">Basketball</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleEditPair} disabled={isPending}>
                    Confirm
                </Button>
            </PopoverContent>
        </div>
        </Popover>

)
    
}
