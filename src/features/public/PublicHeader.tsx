import { Link } from 'react-router'
import AuthModal from '../auth/pages/AuthModal'
import { AppCart } from '../cart/AppCart'
import { StorefrontThemeToggle } from './components/StorefrontThemeToggle'
import { Search } from 'lucide-react'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
      <a href="#main-content" className="storefront-focus fixed left-3 top-3 z-50 -translate-y-20 bg-foreground px-4 py-3 text-sm text-background transition-transform focus:translate-y-0">
        Skip to collection
      </a>
      <div className="bg-foreground px-4 py-2 text-center text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-background">Live size availability · Payment verification on every order</div>
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[90rem] items-center justify-between gap-2 px-4 sm:px-8 lg:px-12 xl:px-16">
        <Link to="/" className="storefront-focus flex min-w-0 items-center gap-3" aria-label="Scarce home">
          <img src="/image/ScarceLogo.PNG" alt="" width="473" height="154" className="h-8 w-[6.2rem] object-contain brightness-0 dark:brightness-100 sm:h-10 sm:w-[7.75rem]" />
          <span className="hidden border-l border-border pl-3 text-[0.625rem] font-semibold uppercase leading-4 tracking-[0.16em] text-muted-foreground sm:block">Rare pairs<br />made clear</span>
        </Link>
        <nav aria-label="Storefront" className="hidden items-center gap-7 md:flex">
          <Link to="/#shop" className="storefront-focus min-h-11 content-center text-xs font-semibold uppercase tracking-[0.14em] hover:text-store-accent">Shop</Link>
          <Link to="/?availability=sold#shop" className="storefront-focus min-h-11 content-center text-xs font-semibold uppercase tracking-[0.14em] hover:text-store-accent">Sold archive</Link>
          <Link to="/#catalog-search" className="storefront-focus flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] hover:text-store-accent"><Search className="size-4" /> Search</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <StorefrontThemeToggle />
          <AppCart />
          <AuthModal />
        </div>
      </div>
    </header>
  )
}
