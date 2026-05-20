import { Facebook, Mail, Music2, type LucideIcon } from 'lucide-react'

type SocialLink = {
  label: string
  href: string
  Icon: LucideIcon
  external?: boolean
}

const socialLinks: SocialLink[] = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/scarceph',
    Icon: Facebook,
    external: true,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@marionrosete',
    Icon: Music2,
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:marionrosete1@gmail.com',
    Icon: Mail,
  },
]

export function SocialFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-sm font-medium">Scarce PH</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect with us for drops, order support, and updates.
          </p>
        </div>

        <nav aria-label="Social links" className="flex flex-wrap gap-2">
          {socialLinks.map(({ label, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={label}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
