import { Facebook, Mail, Music2, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'

type SocialLink = {
  label: string
  href: string
  Icon: LucideIcon
  external?: boolean
}

const socialLinks: SocialLink[] = [
  { label: 'Facebook', href: 'https://facebook.com/scarceph', Icon: Facebook, external: true },
  { label: 'TikTok', href: 'https://www.tiktok.com/@marionrosete', Icon: Music2, external: true },
  { label: 'Email', href: 'mailto:marionrosete1@gmail.com', Icon: Mail },
]

export function SocialFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-4 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-12 lg:py-16 xl:px-16">
        <div>
          <p className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">From the pairs I return to, toward what comes next.</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Scarce is a collector-led home for discontinued, hard-to-find sneakers—rooted in Janoskis and making room for a selective basketball rotation.</p>
        </div>
        <nav aria-label="Social links" className="flex flex-wrap gap-x-5 gap-y-3">
          {socialLinks.map(({ label, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="storefront-focus inline-flex min-h-11 items-center gap-2 border-b border-transparent text-xs font-semibold uppercase tracking-[0.13em] transition-colors duration-200 hover:border-foreground"
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-3 px-4 py-5 text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 xl:px-16">
          <p>© {new Date().getFullYear()} Scarce PH</p>
          <Link to="/privacy-policy" className="storefront-focus min-h-11 content-center transition-colors hover:text-foreground">Privacy policy</Link>
        </div>
      </div>
    </footer>
  )
}
