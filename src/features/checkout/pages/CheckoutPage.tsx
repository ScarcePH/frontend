import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Item, ItemContent, ItemGroup, ItemHeader, ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { formatPeso } from "@/utils/dashboard"
import { useGetCheckoutSession, useSaveCheckoutCustomer, useSubmitCheckoutProof } from "../hooks/useCheckout"
import { getPaymentOcrStatus } from "../api"
import { toast } from "sonner"
import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft } from "lucide-react"

const POLL_INTERVAL_MS = 2000
const MAX_POLL_ATTEMPTS = 12
const TERMINAL_OCR_STATUSES = new Set(["done", "failed"])

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))


function CheckoutPage() {
  const navigate = useNavigate()
  const saveCustomer = useSaveCheckoutCustomer()
  const submitProof = useSubmitCheckoutProof()
  const params = new URLSearchParams(window.location.search)
  const checkoutSessionId = params.get("sessionId") ?? ""
  const checkoutSession = useGetCheckoutSession(checkoutSessionId)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isPolling, setIsPolling] = useState(false)

  const isSubmitting = saveCustomer.isPending || submitProof.isPending || isPolling
  const canSubmit = !!checkoutSessionId && !!file && !isSubmitting
  const sessionItems = checkoutSession.data?.items ?? []
  const sessionTotal = checkoutSession.data?.total_price ?? 0
  const showSessionSummary = sessionItems.length > 0
  

  useEffect(() => {
    if (checkoutSession.isError) {

      toast.error("Checkout session not found.")
      navigate("/")
    }
  }, [checkoutSession.isError, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!checkoutSessionId) {
      toast.error("Missing checkout session. Please restart checkout.")
      return
    }
    if (!file) {
      toast.error("Please upload your payment proof.")
      return
    }

    try {
      await saveCustomer.mutateAsync({
        checkoutSessionId,
        name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
      })

      const submitResponse = await submitProof.mutateAsync({ checkoutSessionId, file })
      const ocrJobId = submitResponse.payment_queue
      let isOcrRejected = false
      if (ocrJobId) {
        setIsPolling(true)
        try {
          for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
            const ocrResponse = await getPaymentOcrStatus(ocrJobId, checkoutSessionId)
            const statusValue =
              typeof ocrResponse?.status === "string"
                ? ocrResponse.status.toLowerCase()
                : ocrResponse?.status
            if (statusValue && TERMINAL_OCR_STATUSES.has(statusValue)) {
              if (statusValue === "failed") {
                toast.error("Failed to process payment screenshot. Please try again")
              }
              if (ocrResponse?.result === false) {
                isOcrRejected = true
                toast.error("Invalid Payment Screenshot. Please send a valid payment screenshot")
              }
              break
            }
            await wait(POLL_INTERVAL_MS)
          }
        } finally {
          setIsPolling(false)
        }
      }

      if (isOcrRejected) {
        return
      }

      toast.success("Checkout submitted successfully.")
      
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",

      })
      setFile(null)
      window.location.replace("/")
    } catch (err: any) {
      toast.error(err?.message || "Checkout failed. Please try again.")
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 md:px-6 py-6 md:py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft /> Back
          </Button>
          <p className="text-sm text-muted-foreground">Checkout</p>
          <h1 className="text-2xl md:text-3xl font-semibold">Complete your order</h1>
        </div>
        <Badge variant="outline" className="text-xs">
          Secure payment verification
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Customer Details</CardTitle>
            <CardDescription>
              Please enter your information and upload proof of payment.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Full name</FieldLabel>
                    <Input
                      placeholder="Juan Dela Cruz"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Phone number</FieldLabel>
                    <Input
                      placeholder="+63 9xx xxx xxxx"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Separator />

              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Upload payment proof</FieldLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFile(e.target.files?.[0] ?? null)
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-2 mb-2">
                      JPG or PNG, max 5MB. Please make sure the reference number and amount is visible.
                    </p>
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

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your items and totals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {checkoutSession.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner />
                Loading order...
              </div>
            ) : showSessionSummary ? (
              <ItemGroup>
                {sessionItems.map((item, index) => (
                  <Item key={`${item.inventory?.id ?? "inv"}-${index}`} variant="outline" size="sm">
                    {item.inventory?.image ? (
                        <img 
                          src={item.inventory.image} 
                          alt={item.inventory?.name ?? "Item image"}      
                          className="w-23 rounded-sm object-fit" 
                        />
                       
                    ) : null}
                    <ItemHeader>
                      <ItemTitle className="capitalize">{item.inventory?.name ?? "Item"}</ItemTitle>
                      <span className="text-xs text-muted-foreground">x{item.qty}</span>
                    </ItemHeader>
                    <ItemContent className="text-muted-foreground">
                      <div className="flex items-center justify-between text-xs">
                        <span>{item.inventory?.variations[0].condition ?? "-"}</span>
                        <span>
                          {item.inventory?.variations[0].price
                            ? formatPeso(item.inventory?.variations[0].price * item.qty)
                            : "-"}
                        </span>
                      </div>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            ) : (
              <p className="text-sm text-muted-foreground">
                {checkoutSessionId
                  ? "Checkout session started. Item details will appear here if available."
                  : "No active checkout session. Please start checkout again."}
              </p>
            )}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPeso(sessionTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated after verification</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>{formatPeso(sessionTotal)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <div className="text-xs text-muted-foreground">
              By submitting, you agree to our payment verification process.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default CheckoutPage
