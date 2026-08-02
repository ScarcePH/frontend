import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import type { CustomerDetailsFormProps } from "./types"

const FILE_HELPER_TEXT =
  "JPG or PNG, max 5MB. Please make sure the reference number and amount is visible."

export function CustomerDetailsForm({
  formData,
  errors,
  fileName,
  onChange,
  onFileChange,
  onSubmit,
  canSubmit,
  isSubmitting,
}: CustomerDetailsFormProps) {
  return (
    <Card className="rounded-none border-border shadow-none">
      <CardHeader className="border-b border-border px-5 py-6 sm:px-7">
        <CardTitle className="text-xl">Delivery details</CardTitle>
        <CardDescription>Tell us where to send your pair and how to reach you.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-7 px-5 pt-7 sm:px-7">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-fullName">Full name</FieldLabel>
                <Input
                  id="checkout-fullName"
                  required
                  placeholder="Juan Dela Cruz"
                  value={formData.fullName}
                  aria-invalid={!!errors.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                  className="min-h-12 rounded-none"
                />
                <FieldError>{errors.fullName}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-email">Email</FieldLabel>
                <Input
                  id="checkout-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@email.com"
                  value={formData.email}
                  aria-invalid={!!errors.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="min-h-12 rounded-none"
                />
                <FieldError>{errors.email}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-phone">Phone number</FieldLabel>
                <Input
                  id="checkout-phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="+63 9xx xxx xxxx"
                  value={formData.phone}
                  aria-invalid={!!errors.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="min-h-12 rounded-none"
                />
                <FieldError>{errors.phone}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Separator />

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-address">Delivery address</FieldLabel>
                <Textarea
                  id="checkout-address"
                  required
                  placeholder="Street, Barangay, City, Post code"
                  className="min-h-28 rounded-none"
                  value={formData.address}
                  aria-invalid={!!errors.address}
                  onChange={(e) => onChange("address", e.target.value)}
                />
                <FieldError>{errors.address}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel className="text-base font-semibold">Pay by QR</FieldLabel>
                <FieldDescription>
                  Send your payment using the QR code below, then upload a clear screenshot. Payments are manually verified before fulfillment.
                </FieldDescription>
                <div className="grid gap-5 border border-border bg-muted/40 p-5 sm:grid-cols-[12rem_1fr] sm:items-center">
                  <img
                    className="mx-auto h-auto w-48 border border-border bg-white object-contain"
                    src="/image/PAYMENT_QR.PNG"
                    alt="Payment QR code"
                  />
                  <div><p className="font-semibold">Scan, pay, then upload.</p><ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-6 text-muted-foreground"><li>Scan the QR code using your payment app.</li><li>Complete payment for the order total.</li><li>Save a clear screenshot with the reference and amount visible.</li></ol></div>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>


          <Separator />

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-proof">Payment proof</FieldLabel>
                <Input
                  id="checkout-proof"
                  type="file"
                  required
                  accept="image/jpeg,image/png"
                  aria-invalid={!!errors.proof}
                  onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                  className="min-h-12 cursor-pointer rounded-none file:mr-3 file:border-0 file:bg-transparent file:font-semibold"
                />
                <p className="mb-2 mt-2 text-xs text-muted-foreground">{FILE_HELPER_TEXT}</p>
                {fileName ? <p className="text-xs font-medium">Selected: {fileName}</p> : null}
                <FieldError>{errors.proof}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="border-t border-border px-5 py-5 sm:px-7">
          <Button size="lg" className="min-h-12 w-full rounded-none uppercase tracking-[0.13em]" type="submit" disabled={!canSubmit}>
            {isSubmitting ? <><Spinner /> Verifying payment…</> : "Submit for verification"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
