import { motion } from "framer-motion"
import { ChevronDown, MinusCircleIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { type VariationObj } from "@/features/admin/types/variations"
import { condition, getsize, status, variationBadge } from "@/utils/inventory"
import { Badge } from "@/components/ui/badge"

type Props = {
  data: VariationObj
  index: number
  onToggle: () => void
  onRemove: () => void
  onUpdate: <K extends keyof VariationObj>(
    key: K,
    value: VariationObj[K]
  ) => void
}

export function VariationItem({
  data,
  onToggle,
  onRemove,
  onUpdate,
}: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <Collapsible open={data.isOpen} onOpenChange={onToggle}>
        <div className="flex justify-between items-center">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 text-xs font-medium">
              {data.condition||"N/A"}, {data.size? data.size + "us":"N/A"}
              <motion.span
                animate={{ rotate: data.isOpen ? 180 : 0 }}
                className="inline-flex"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
              <Badge variant={variationBadge(data.status)}>
              {data.status||"N/A"}
              </Badge>
            </button>
          </CollapsibleTrigger>

          <Button size="icon-xs" variant="destructive" onClick={onRemove}>
            <MinusCircleIcon />
          </Button>
        </div>

        <CollapsibleContent asChild forceMount>
          <motion.div
            initial={false}
            animate={data.isOpen ? "open" : "closed"}
            variants={{
              open: { height: "auto", opacity: 1 },
              closed: { height: 0, opacity: 0 },
            }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 border p-4 rounded-md mt-2">
              <Input 
                id="picture" 
                type="file"
                accept="image/*"
                multiple={true}
                className="text-xs w-full" 
                onChange={(e)=>{
                  const files = Array.from(e.target.files || [])
                  onUpdate("files", files) 
                }}
              />
              
              <div className="grid grid-cols-2 gap-4"> 
                  <div className="grid gap-1"> 
                      <Label className="text-xs"> Condition </Label> 
                      <Select 
                          onValueChange={(v)=> onUpdate("condition", v)} 
                          value={data.condition}
                      > 
                          <SelectTrigger className="text-xs w-full"> 
                              <SelectValue placeholder="new in box" /> 
                          </SelectTrigger> 
                          <SelectContent className="text-xs"> 
                              {condition.map((cond, key)=> 
                                  <SelectItem value={cond} key={key}>{cond}</SelectItem> 
                              )} 
                          </SelectContent> 
                      </Select> 
                  </div>
                
                  <div className="grid gap-1"> 
                      <Label htmlFor="checkout-7j9-exp-year-f59" className="text-xs"> Size </Label> 
                      <Select 
                          onValueChange={(v)=> onUpdate("size", v)}
                          value={data.size}
                      > 
                          <SelectTrigger className="text-xs w-full"> 
                              <SelectValue placeholder="10.5 us" /> 
                          </SelectTrigger> 
                          <SelectContent> {getsize().map((sz, key)=> 
                              <SelectItem value={sz.toString()} key={key}> {sz} us </SelectItem> )} 
                          </SelectContent> 
                      </Select> 
                  </div> 
              </div> 
              <div className="grid grid-cols-2 gap-4"> 
                  <div className="grid gap-1 "> 
                      <Label className="text-xs"> Status </Label> 
                      <Select 
                          onValueChange={(v)=> onUpdate("status", v)} 
                          value={data.status}
                          
                      > 
                          <SelectTrigger className="text-xs w-full"> 
                              <SelectValue placeholder="onhand" /> 
                          </SelectTrigger> 
                          <SelectContent className="text-xs"> 
                              {status.map((cond, key)=> 
                                  <SelectItem value={cond} key={key}>{cond}</SelectItem> 
                              )} 
                          </SelectContent> 
                      </Select> 
                  </div> 
                  <div className="grid gap-1 ">
                      <Label htmlFor="inv-name" className="text-xs"> Price </Label> 
                      <Input
                          placeholder="₱7000" 
                          required type="number" 
                          className="text-xs w-full" 
                          value={data.price === 0 ? "" : data.price}
                          onChange={e => onUpdate("price", Number(e.target.value))}
                      /> 
                  </div> 
                  <div className="grid gap-1"> 
                      <Label htmlFor="inv-name" className="text-xs"> Spent </Label> 
                      <Input
                          placeholder={"₱5000"} 
                          required 
                          type="number" 
                          className="text-xs w-full"  
                          value={data.spent === 0 ? "" : data.spent}
                          onChange={e => onUpdate("spent", Number(e.target.value))}
                      /> 
                  </div> 
                  <div className="grid gap-1"> 
                      <Label htmlFor="inv-name" className="text-xs"> Quantity </Label> 
                      <Input
                          placeholder={"1"} 
                          required 
                          type="number" 
                          className="text-xs w-full"  
                          value={ data.stock || 0}
                          onChange={e => onUpdate("stock", Number(e.target.value))}
                      /> 
                  </div> 
              </div> 
               <div className="grid gap-1"> 
                    <Label htmlFor="inv-name" className="text-xs"> Facebook post </Label> 
                    <Input
                        placeholder="https://www.facebook.com/share/p/1AQctcDZcj/" 
                        required 
                        className="text-xs h-9" 
                        onChange={e => onUpdate("url", e.target.value)}
                        value={data.url}
                    /> 
                </div> 
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  )
}
