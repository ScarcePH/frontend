import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent,DialogTitle } from "@/components/ui/dialog";


type AuthFormProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  submitLabel: string;
  footerText: string;
  footerActionLabel: string;
  onFooterAction: () => void;
  onForgotPassword?: (email: string) => void;
  onSubmit: (data: { email: string; password: string }) => void;
  isPending: boolean;
  isForgotPending?: boolean;
};

export default function AuthForm({
  open,
  onOpenChange,
  title,
  submitLabel,
  footerText,
  footerActionLabel,
  onFooterAction,
  onForgotPassword,
  onSubmit,
  isPending,
  isForgotPending = false,
}: AuthFormProps) {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="storefront flex w-full max-w-[calc(100%-2rem)] flex-col rounded-none border-border bg-background p-6 sm:max-w-[440px] sm:p-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-store-accent">Scarce account</p>
          <DialogTitle className="pt-2 text-2xl font-semibold tracking-[-0.03em]">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">Use your Scarce account to continue shopping.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldSet className="space-y-5 mt-5">
            <div className="flex justify-center">
              <img src="/image/ScarceLogo.PNG" alt="Scarce logo" className="w-20 rounded-md object-contain" />
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="auth-email">Email</FieldLabel>
                <Input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="ScarcePH@gmail.com"
                  value={data.email}
                  className="min-h-12 rounded-none"
                  onChange={(e) =>
                    setData({ ...data, email: e.target.value })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={title === "Login" ? "current-password" : "new-password"}
                    required
                    placeholder="Password"
                    value={data.password}
                    className="min-h-12 rounded-none pr-12"
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 size-11 -translate-y-1/2 rounded-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </Field>

              {onForgotPassword ? (
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    size="sm"
                    type="button"
                    className="h-auto px-0"
                    disabled={!data.email || isForgotPending}
                    onClick={() => onForgotPassword(data.email)}
                  >
                    {isForgotPending ? "Sending reset link..." : "Forgot password?"}
                  </Button>
                </div>
              ) : null}
            </FieldGroup>
          </FieldSet>

          <div className="flex flex-col mt-8">
            <Button
              type="submit"
              size="lg"
              className="min-h-12 w-full rounded-none uppercase tracking-[0.13em]"
              disabled={isPending || !data.email || !data.password}
            >
              {isPending ? <Spinner /> : submitLabel}
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center items-center gap-1 text-sm">
          <span>{footerText}</span>
          <Button variant="link" size="sm" type="button" onClick={onFooterAction}>
            {footerActionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
