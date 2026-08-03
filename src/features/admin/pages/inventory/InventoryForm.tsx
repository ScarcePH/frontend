import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import { useState } from "react"

import { Textarea } from "@/components/ui/textarea"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { InventoryData } from "@/features/admin/types/variations"
import ImagePicker from "../../component/ImagePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type InventoryFormProps = {
  value: InventoryData
  onSubmit: (data: InventoryData) => void
}

export function InventoryForm({ value, onSubmit }: InventoryFormProps) {
  const [form, setForm] = useState(value)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    await onSubmit(form)
    setLoading(false)
  }
  console.log(form.image);
  

  return (
    <div className="grid gap-4">
        <div className="w-full flex justify-center">
          <ImagePicker
              initialImage={form.file ? URL.createObjectURL(form.file) : form.image}
              setImage={(event) => setForm(v => ({ ...v, file: event }))}
          />
        </div>
        <div className="grid gap-2">
            <Label className="text-xs">Name</Label>
            <Input
            className="text-xs h-8"
            value={form.name}
            onChange={e =>
                setForm(v => ({ ...v, name: e.target.value }))
            }
            />
        </div>

        <div className="grid gap-2">
            <Label className="text-xs">Category</Label>
            <Select
              value={form.category}
              onValueChange={(category: InventoryData['category']) => setForm(v => ({ ...v, category }))}
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="janoski">Janoski</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div className="grid gap-2">
            <Label className="text-xs">Description</Label>
            <Textarea
            className="text-xs resize-none"
            value={form.description}
            onChange={e =>
                setForm(v => ({ ...v, description: e.target.value }))
            }
            />
        </div>

        <Button
            size="sm"
            variant="outline"
            disabled={loading || !form.name}
            onClick={submit}
        >
            Next <ChevronRight />
        </Button>
    </div>
  )
}
