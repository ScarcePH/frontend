import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useLogout } from "@/features/auth/hooks/useAuth"
import { LogOut, Menu } from "lucide-react"

export function MobileSheet({user}:{user:string}) {
  const {mutate:logout}= useLogout()
  return (
    <Sheet>
      <SheetTrigger asChild>
         <Button size="icon-sm" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent >
        <SheetTitle/>
        <SheetHeader>
            <img src="/image/ScarceLogo.PNG" alt="Scarce logo" className="w-24 object-contain" />
        </SheetHeader>
       
        <div className="p-2 space-y-4">
           <p>{user}</p>
            <p className="hover:bg-gray-600 pt-2 pb-2">Orders</p>
            <p className="hover:bg-gray-600 pt-2 pb-2">Shipping address</p>
        </div>
        <SheetFooter >
            <div className="flex justify-end w-full">
                <Button 
                  variant={'outline'} 
                  size={'sm'}
                  onClick={()=>logout()}
                >
                  Logout <LogOut/>
                </Button>
                
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
