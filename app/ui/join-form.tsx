"use client"

import { useActionState, useCallback, useEffect, useState } from "react"
import {
  sendConfirmationCode,
  SendConfirmationCodeState,
  verifyConfirmationCode,
  VerifyConfirmationCodeState,
} from "../lib/actions"
import { Button } from "./buttons"
import { ArrowLeftIcon } from "lucide-react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"

export default function JoinForm() {
  const [verificationEmail, setVerificationEmail] = useState("")

  return (
    <>
      <VerificationAlert />
      {!verificationEmail ? (
        <JoinForm_EmailVerification
          setVerificationEmail={setVerificationEmail}
        />
      ) : (
        <JoinForm_OTPVerification
          verificationEmail={verificationEmail}
          setVerificationEmail={setVerificationEmail}
        />
      )}
    </>
  )
}

function JoinForm_EmailVerification({
  setVerificationEmail,
}: {
  setVerificationEmail: (email: string) => void
}) {
  const searchParams = useSearchParams()
  const callbackUrl =
    searchParams.get("callbackUrl") || new URL(document.URL).origin + "/"
  const initialState: SendConfirmationCodeState = { errors: {} }
  const [state, action, isPending] = useActionState(
    sendConfirmationCode,
    initialState
  )
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (state.success) {
      setVerificationEmail(email)
      delete state.success
    }
  }, [state, email, setVerificationEmail])

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-soft">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="block w-full mt-1 p-3 border rounded-sm bg-background border-border disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-soft"
          autoFocus
          aria-labelledby="email-error"
          spellCheck="false"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.email && (
            <p className="text-danger text-sm mt-1">
              {state.errors.email.at(0)}
            </p>
          )}
        </div>
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <Button className="w-full" isLoading={isPending}>
        Continue
      </Button>
    </form>
  )
}

function JoinForm_OTPVerification({
  verificationEmail,
  setVerificationEmail,
}: {
  verificationEmail: string
  setVerificationEmail: (email: string) => void
}) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { push, replace } = useRouter()
  const callbackUrl =
    searchParams.get("callbackUrl") || new URL(document.URL).origin + "/"
  const initialState: VerifyConfirmationCodeState = { errors: {} }

  const [state, action, isPending] = useActionState(
    verifyConfirmationCode,
    initialState
  )

  const removeErrorParam = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    if (params.get("error")) {
      params.delete("error")
      replace(`${pathname}?${params.toString()}`)
    }
  }, [searchParams, pathname, replace])

  useEffect(() => {
    removeErrorParam()
  }, [removeErrorParam])

  useEffect(() => {
    ;(async () => {
      if (state.requestUrl && !isLoading) {
        setIsLoading(true)
        const response = await fetch(state.requestUrl)
        if (response) {
          if (response.url.includes(callbackUrl)) {
            push(response.url)
          } else {
            setOtp("")
            replace("/join?error=Verification")
          }
        }
        delete state.requestUrl
        setIsLoading(false)
      }
    })()
  }, [state, callbackUrl, push, replace, isLoading])

  return (
    <form action={action} className="space-y-4">
      <button
        type="button"
        onClick={() => {
          removeErrorParam()
          setVerificationEmail("")
        }}
        className="size-8 bg-background hover:bg-subtle transition-colors flex items-center justify-center rounded-full"
        aria-label="Go back"
      >
        <ArrowLeftIcon className="size-4" />
      </button>
      <div>
        <label htmlFor="email" className="text-soft">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="block w-full mt-1 p-3 border rounded-sm bg-background border-border disabled:opacity-50 disabled:cursor-not-allowed read-only:opacity-50 read-only:cursor-not-allowed read-only:focus:outline-0 placeholder:text-soft"
          aria-labelledby="email-error"
          spellCheck="false"
          value={verificationEmail}
          readOnly
        />
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.email && (
            <p className="text-danger text-sm mt-1">
              {state.errors.email.at(0)}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="otp" className="text-soft">
          Verification code
        </label>
        <input
          type="number"
          name="otp"
          id="otp"
          className="block w-full mt-1 p-3 border rounded-sm bg-background border-border disabled:opacity-50 disabled:cursor-not-allowed read-only:opacity-50 read-only:cursor-not-allowed read-only:focus:outline-0 placeholder:text-soft"
          autoFocus
          aria-labelledby="otp-error"
          spellCheck="false"
          placeholder="Enter code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <div id="otp-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.otp && (
            <p className="text-danger text-sm mt-1">{state.errors.otp.at(0)}</p>
          )}
        </div>
      </div>
      <p className="text-sm text-soft">
        We just sent you an email to your inbox. The code expires in 3 minutes,
        so please enter it soon.
      </p>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <Button className="w-full" isLoading={isPending || isLoading}>
        Login
      </Button>
    </form>
  )
}

const ERROR_MESSAGES = {
  Configuration:
    "There is a problem with the server configuration. Please contact the site administrator.",
  AccessDenied: "You don't have permission to sigin or register on this site.",
  Verification:
    "That confirmation code is not valid or has expired. Please try again or refresh the page to request a new one.",
  Default: "There was an unknown error. Please refresh the page and try again.",
}

function VerificationAlert() {
  const params = useSearchParams()
  const error = params.get("error") as keyof typeof ERROR_MESSAGES

  return error ? (
    <div className="bg-subtle border-l-4 border-danger text-sm text-danger mb-3 p-4">
      {ERROR_MESSAGES[error] || ERROR_MESSAGES.Default}
    </div>
  ) : null
}
