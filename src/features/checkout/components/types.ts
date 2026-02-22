import type { FormEvent } from "react"
import type { CheckoutSessionItem } from "../api"

export const DEFAULT_FORM_DATA = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
}

export type FormDataState = typeof DEFAULT_FORM_DATA

export type OnFormFieldChange = <K extends keyof FormDataState>(
  field: K,
  value: FormDataState[K],
) => void

export type CustomerDetailsFormProps = {
  formData: FormDataState
  onChange: OnFormFieldChange
  onFileChange: (nextFile: File | null) => void
  onSubmit: (e: FormEvent) => void
  canSubmit: boolean
  isSubmitting: boolean
}

export type OrderSummaryProps = {
  isLoading: boolean
  hasSessionId: boolean
  sessionItems: CheckoutSessionItem[]
  sessionTotal: number
}
