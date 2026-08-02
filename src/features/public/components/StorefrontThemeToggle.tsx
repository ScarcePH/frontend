import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provide'
import { Moon, Sun } from 'lucide-react'

export function StorefrontThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-11 rounded-none"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  )
}
