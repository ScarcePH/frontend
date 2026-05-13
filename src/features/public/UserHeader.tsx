import { MobileSheet } from './components/MobileSheet'
import { AppCart } from '../cart/AppCart'



export function UserHeader({user}:{user:string}) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <p className="hidden text-sm text-muted-foreground sm:block">Archives by</p>
          <img
            src="/image/ScarceLogo.PNG"
            alt="Scarce"
            className="h-8 w-auto object-contain"
          />
        </div>

        <div className="hidden min-w-0 items-center gap-3 md:flex">
          <AppCart/>
          <p className="max-w-72 truncate text-sm text-muted-foreground">
            Good day, <span className="text-foreground">{user}</span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <AppCart/>
          <MobileSheet user={user}/>
        </div>
      </div>
    </header>
  )
}
