import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { CircleAlert, Eye, EyeOff } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useResetPassword } from '../hooks/useAuth'

const MAX_PASSWORD_LENGTH = 128
const MAX_RESET_TOKEN_LENGTH = 2048

function getPasswordError(password: string) {
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (password.length > MAX_PASSWORD_LENGTH) return 'Password must be 128 characters or fewer.'
  if (password.trim() !== password) return 'Password cannot start or end with spaces.'
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include uppercase, lowercase, and a number.'
  }

  return ''
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])
  const isSubmittingRef = useRef(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { mutate, isPending } = useResetPassword()
  const passwordError = password ? getPasswordError(password) : ''
  const invalidToken = !token || token.length > MAX_RESET_TOKEN_LENGTH
  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword

  const canSubmit =
    !invalidToken &&
    !getPasswordError(password) &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    !isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmittingRef.current || isPending) {
      return
    }

    if (invalidToken) {
      toast.error('Reset link is invalid or missing a token')
      return
    }

    const nextPasswordError = getPasswordError(password)
    if (nextPasswordError) {
      toast.error(nextPasswordError)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    isSubmittingRef.current = true
    mutate(
      { token, password },
      {
        onSuccess: (response) => {
          localStorage.removeItem('token')
          toast.success(response.message)
          navigate('/')
        },
        onError: (err) => toast.error(err.message),
        onSettled: () => {
          isSubmittingRef.current = false
        },
      }
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2 text-center">
            <img
              src="/image/ScarceLogo.PNG"
              alt="Scarce logo"
              className="mx-auto w-24 rounded-md object-contain"
            />
            <h1 className="text-2xl font-semibold">Reset password</h1>
            <p className="text-sm text-muted-foreground">
              Enter a new password for your Scarce account.
            </p>
          </div>

          {invalidToken ? (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertDescription>
                This reset link is invalid or missing a token. Request a new password reset link and try again.
              </AlertDescription>
            </Alert>
          ) : null}

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>New password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    minLength={8}
                    maxLength={MAX_PASSWORD_LENGTH}
                    required
                    aria-invalid={Boolean(passwordError)}
                    className="pr-10"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                {passwordError ? (
                  <p className="text-sm text-destructive">
                    {passwordError}
                  </p>
                ) : null}
              </Field>

              <Field>
                <FieldLabel>Confirm password</FieldLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  minLength={8}
                  maxLength={MAX_PASSWORD_LENGTH}
                  required
                  aria-invalid={passwordsDoNotMatch}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordsDoNotMatch ? (
                  <p className="text-sm text-destructive">
                    Passwords do not match.
                  </p>
                ) : null}
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="space-y-3">
            <Button type="submit" size="lg" className="w-full" disabled={!canSubmit || isPending}>
              {isPending ? <Spinner /> : "Reset password"}
            </Button>
            <Button asChild variant="link" className="w-full">
              <Link to="/">Back to store</Link>
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
