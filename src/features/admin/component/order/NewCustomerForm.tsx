import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { CreateCustomer, GetMessengerCustomer } from "@/api";
import type { CustomerObj, MessengerCustomerObj } from "@/features/admin/types/customer";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel
} from "@/components/ui/select"

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

    const {
        data:msgrCust,
        isLoading:loadingMsgrCust
    } = useQuery<MessengerCustomerObj[]>({
        queryKey: ["get-messenger-customers"],
        queryFn:GetMessengerCustomer
    });

  
    return (
        <div className="space-y-2 p-2 w-3/4 w-full">
            <Select 
                onValueChange={(v)=>setCustomer({...customer, sender_id:v, name:msgrCust?.find((cust)=>cust.id === v)?.name || customer.name})} 
                value={customer.sender_id}
                disabled={loadingMsgrCust}
            >
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Messenger Customers</SelectLabel>
                    {msgrCust?.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                        </SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
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