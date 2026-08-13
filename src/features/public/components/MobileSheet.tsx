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
import { Link } from "react-router"

export function MobileSheet({user}:{user:string}) {
  const {mutate:logout}= useLogout()
  return (
    <Sheet>
      <SheetTrigger asChild>
         <Button size="icon" variant="ghost" className="size-11 rounded-none" aria-label="Open account menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="storefront border-border bg-background">
        <SheetTitle className="sr-only">Account menu</SheetTitle>
        <SheetHeader>
            <img src="/image/ScarceLogo.PNG" alt="Scarce" width="473" height="154" className="w-28 object-contain brightness-0 dark:brightness-100" />
        </SheetHeader>
       
        <div className="space-y-5 p-4">
          <div>
            <p className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">Signed in as</p>
            <p className="mt-2 break-all text-sm">{user}</p>
          </div>
          <p className="border-t border-border pt-5 text-sm text-muted-foreground">Your account keeps cart and checkout details connected across visits.</p>
          <nav aria-label="Account menu links" className="grid border-y border-border py-2 text-sm font-medium">
            <Link to="/#shop" className="storefront-focus min-h-11 content-center">Shop collection</Link>
            {/* <Link to="/#story" className="storefront-focus min-h-11 content-center">Our story</Link> */}
            <Link to="/?availability=sold#shop" className="storefront-focus min-h-11 content-center">Sold archive</Link>
            <Link to="/privacy-policy" className="storefront-focus min-h-11 content-center">Privacy policy</Link>
          </nav>
        </div>
        <SheetFooter >
            <div className="flex justify-end w-full">
                <Button 
                  variant="outline"
                  className="min-h-11 rounded-none px-5 uppercase tracking-[0.12em]"
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
