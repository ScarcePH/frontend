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
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Customer Details</CardTitle>
        <CardDescription>Please enter your information and upload proof of payment.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6 pt-6">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Full name</FieldLabel>
                <Input
                  required
                  placeholder="Juan Dela Cruz"
                  value={formData.fullName}
                  aria-invalid={!!errors.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                />
                <FieldError>{errors.fullName}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@email.com"
                  value={formData.email}
                  aria-invalid={!!errors.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
                <FieldError>{errors.email}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Phone number</FieldLabel>
                <Input
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="+63 9xx xxx xxxx"
                  value={formData.phone}
                  aria-invalid={!!errors.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                />
                <FieldError>{errors.phone}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Separator />

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Delivery address</FieldLabel>
                <Textarea
                  required
                  placeholder="Street, Barangay, City, Post code"
                  className="min-h-[96px]"
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
                <FieldLabel>Payment Method</FieldLabel>
                <FieldDescription>
                  Send your payment using the QR code below, then upload a clear screenshot. Payments are manually verified before fulfillment.
                </FieldDescription>
                <div className="flex justify-center rounded-md border bg-muted/30 py-4">
                  <img
                    className="h-auto w-48 rounded-sm object-contain"
                    src="/image/PAYMENT_QR.PNG"
                    alt="Payment QR code"
                  />
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>


          <Separator />

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Upload a screenshot of your payment as proof of payment</FieldLabel>
                <Input
                  type="file"
                  required
                  accept="image/jpeg,image/png"
                  aria-invalid={!!errors.proof}
                  onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                />
                <p className="mb-2 mt-2 text-xs text-muted-foreground">{FILE_HELPER_TEXT}</p>
                {fileName ? <p className="text-xs font-medium">Selected: {fileName}</p> : null}
                <FieldError>{errors.proof}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="border-t">
          <Button size="lg" className="w-full" type="submit" disabled={!canSubmit}>
            {isSubmitting ? <Spinner /> : "Submit checkout"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
