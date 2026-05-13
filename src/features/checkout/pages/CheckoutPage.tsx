import { useGetCheckoutSession, useSaveCheckoutCustomer, useSubmitCheckoutProof } from "../hooks/useCheckout"
import { getPaymentOcrStatus } from "../api"
import { toast } from "sonner"
import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { CheckoutHeader } from "../components/CheckoutHeader"
import { CustomerDetailsForm } from "../components/CustomerDetailsForm"
import { OrderSummary } from "../components/OrderSummary"
import { DEFAULT_FORM_DATA, type CheckoutFormErrors, type FormDataState } from "../components/types"

const POLL_INTERVAL_MS = 2000
const MAX_POLL_ATTEMPTS = 12
const TERMINAL_OCR_STATUSES = new Set(["done", "failed"])
const MAX_PROOF_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_PROOF_TYPES = new Set(["image/jpeg", "image/png"])

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

async function pollOcrStatus(ocrJobId: string, checkoutSessionId: string) {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const ocrResponse = await getPaymentOcrStatus(ocrJobId, checkoutSessionId)
    const statusValue =
      typeof ocrResponse?.status === "string" ? ocrResponse.status.toLowerCase() : ocrResponse?.status
    if (!statusValue || !TERMINAL_OCR_STATUSES.has(statusValue)) {
      await wait(POLL_INTERVAL_MS)
      continue
    }

    if (statusValue === "failed") {
      toast.error("Failed to process payment screenshot. Please try again")
    }

    if (ocrResponse?.result === false) {
      toast.error("Invalid Payment Screenshot. Please send a valid payment screenshot")
      return false
    }

    return true
  }

  return true
}

function CheckoutPage() {
  const navigate = useNavigate()
  const saveCustomer = useSaveCheckoutCustomer()
  const submitProof = useSubmitCheckoutProof()
  const params = new URLSearchParams(window.location.search)
  const checkoutSessionId = params.get("sessionId") ?? ""
  const checkoutSession = useGetCheckoutSession(checkoutSessionId)
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<CheckoutFormErrors>({})
  const [file, setFile] = useState<File | null>(null)
  const [isPolling, setIsPolling] = useState(false)

  const isSubmitting = saveCustomer.isPending || submitProof.isPending || isPolling
  const canSubmit = !!checkoutSessionId && !!file && !isSubmitting
  const sessionItems = checkoutSession.data?.items ?? []
  const sessionTotal = checkoutSession.data?.total_price ?? 0

  useEffect(() => {
    if (checkoutSession.isError || !checkoutSessionId) {
      toast.error("Checkout session not found.")
      navigate("/")
    }
  }, [checkoutSession.isError, checkoutSessionId, navigate])

  const updateFormField = <K extends keyof FormDataState>(field: K, value: FormDataState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validateProofFile = (nextFile: File | null) => {
    if (!nextFile) {
      return "Please upload your payment proof."
    }
    if (!ALLOWED_PROOF_TYPES.has(nextFile.type)) {
      return "Upload a JPG or PNG payment screenshot."
    }
    if (nextFile.size > MAX_PROOF_SIZE_BYTES) {
      return "Payment proof must be 5MB or smaller."
    }
    return undefined
  }

  const handleFileChange = (nextFile: File | null) => {
    const proofError = validateProofFile(nextFile)
    setFile(proofError ? null : nextFile)
    setErrors((prev) => ({ ...prev, proof: proofError }))
  }

  const validateForm = () => {
    const nextErrors: CheckoutFormErrors = {}
    if (!formData.fullName.trim()) nextErrors.fullName = "Enter your full name."
    if (!formData.email.trim()) nextErrors.email = "Enter your email address."
    if (!formData.phone.trim()) nextErrors.phone = "Enter your phone number."
    if (!formData.address.trim()) nextErrors.address = "Enter your delivery address."

    const proofError = validateProofFile(file)
    if (proofError) nextErrors.proof = proofError

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!checkoutSessionId) {
      toast.error("Missing checkout session. Please restart checkout.")
      return
    }

    if (!validateForm() || !file) {
      toast.error("Please complete the checkout form.")
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
      if (ocrJobId) {
        setIsPolling(true)
        try {
          const passedOcr = await pollOcrStatus(ocrJobId, checkoutSessionId)
          if (!passedOcr) {
            return
          }
        } finally {
          setIsPolling(false)
        }
      }

      toast.success("Checkout submitted successfully.")
      setFormData(DEFAULT_FORM_DATA)
      setErrors({})
      setFile(null)
      window.location.replace("/")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Checkout failed. Please try again."))
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 md:px-6 py-6 md:py-10 space-y-6">
      <CheckoutHeader onBack={() => navigate(-1)} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <CustomerDetailsForm
          formData={formData}
          errors={errors}
          fileName={file?.name}
          onChange={updateFormField}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
        />
        <OrderSummary
          isLoading={checkoutSession.isLoading}
          hasSessionId={!!checkoutSessionId}
          sessionItems={sessionItems}
          sessionTotal={sessionTotal}
        />
      </div>
    </div>
  )
}

export default CheckoutPage
