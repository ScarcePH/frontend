import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateCustomer } from "@/api";
import type { CustomerObj } from "@/features/admin/types/customer";
import { useState } from "react";

type Props = {
    setStep: ()=>void
    setCustomerData: (customer:CustomerObj|null)=>void
}

export default function NewCustomer ({setStep,setCustomerData}:Props) {
    const [customer, setCustomer] = useState<CustomerObj>({
        id:'',
        name:'',
        address:'',
        phone:'',
        sender_id:''
    })
    const queryClient = useQueryClient()
    const addCustomerMutation = useMutation({
        mutationFn: CreateCustomer,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["get-customers"] })
            setCustomerData(res.data)
            setStep()
        },

    })

    const submit = () => {
        addCustomerMutation.mutate(customer)
        addCustomerMutation.isPending
    }
  
    return (
        <div className="space-y-2 p-2 w-3/4 w-full">
            <Input
                placeholder="Sender ID"
                required
                className="text-xs"
                onChange={(e)=>
                    setCustomer({...customer, sender_id: e.target.value})
                }
                value={customer.sender_id}
            />
            <Input
                placeholder="Fullname"  
                className="text-xs"
                onChange={(e)=>
                    setCustomer({...customer, name: e.target.value})
                }
                value={customer.name}

            />
            <Input
                placeholder="Address"
                className="text-xs"
                onChange={(e)=>
                    setCustomer({...customer, address: e.target.value})
                }
                value={customer.address}

            />
            <Input
                placeholder="Phone"
                className="text-xs"
                onChange={(e)=>
                    setCustomer({...customer, phone: e.target.value})
                }
                value={customer.phone}

            />
            <Button 
                variant='secondary' 
                onClick={submit}
                disabled={addCustomerMutation.isPending||!customer.name}
            >
               {addCustomerMutation.isPending?  "Creating customer...":"Next"}
            </Button>
        </div>
    )
}