import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
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
                  placeholder="Juan Dela Cruz"
                  value={formData.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Phone number</FieldLabel>
                <Input
                  placeholder="+63 9xx xxx xxxx"
                  value={formData.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Separator />

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Delivery address</FieldLabel>
                <Textarea
                  placeholder="Street, Barangay, City, Post code"
                  className="min-h-[96px]"
                  value={formData.address}
                  onChange={(e) => onChange("address", e.target.value)}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Separator />

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Upload payment proof</FieldLabel>
                <Input type="file" accept="image/*" onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} />
                <p className="mb-2 mt-2 text-xs text-muted-foreground">{FILE_HELPER_TEXT}</p>
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
