import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { useState } from "react"


import { Variations } from "./inventory/Variations"
import { Progress } from "@/components/ui/progress"
import { CreatePair } from "@/api"
import { InventoryForm } from "./inventory/InventoryForm"
import { createVariation, type InventoryData } from "@/features/admin/types/variations"
import { useMutation, useQueryClient } from "@tanstack/react-query"




export function AddPair() {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<1 | 2>(1)
  const [inventory, setInventory] = useState<InventoryData>({
    id:0,
    name: "",
    description: "",
    image: "",
    category: "janoski",
    file: null
  })

  const progress = (step / 2) * 100

  

  const createInventory = (payload: InventoryData) => {
    return CreatePair(
      payload.name,
      payload.description,
      payload.category,
      payload.file
    )
  }
  const addInventoryMutation = useMutation({
    mutationFn: createInventory,
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["inventory"] })
        setInventory(res.data)
        setStep(2)
      }
    }
  )

  const handleInventorySubmit = async (data: InventoryData) => {
      addInventoryMutation.mutate(data)
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusCircle /> Add Pair
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Add new pair" : "Add variations"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Create a new inventory item"
              : "Define sizes, prices, and stock"}
          </DialogDescription>

          <Progress value={progress} className="mt-2" />
          <p className="text-right text-xs">{step}/2</p>
        </DialogHeader>

        {step === 1 && (
          <InventoryForm
            value={inventory}
            onSubmit={handleInventorySubmit}
          />
        )}
        {step === 2 && (
          <Variations
            pair={{
              id: inventory.id,
              name: inventory.name,
              image: inventory.image,
              variation:[createVariation()],
              description:inventory.description,
              category: inventory.category
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
