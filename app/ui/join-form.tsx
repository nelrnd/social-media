"use client"

import { useActionState, useState } from "react"
import { emailSignIn, verifyEmail, VerifyEmailState } from "../lib/actions"
import { Button } from "./buttons"
import { ArrowLeftIcon } from "lucide-react"

export default function JoinForm() {
  const [verificationEmail, setVerificationEmail] = useState("")

  return verificationEmail ? (
    <JoinForm_OTPVerification verificationEmail={verificationEmail} />
  ) : (
    <JoinForm_EmailVerification setVerificationEmail={setVerificationEmail} />
  )
}

function JoinForm_EmailVerification({
  setVerificationEmail,
}: {
  setVerificationEmail: (email: string) => void
}) {
  const [email, setEmail] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    setVerificationEmail(email)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>
      <Button className="w-full">Continue</Button>
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
  return (
    <form className="space-y-4">
      <button
        onClick={() => setVerificationEmail("")}
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
          className="block w-full mt-1 p-3 border rounded-sm bg-background border-border disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-soft"
          aria-labelledby="email-error"
          spellCheck="false"
          value={verificationEmail}
          disabled={true}
        />
      </div>
      <div>
        <label htmlFor="otp" className="text-soft">
          Verification code
        </label>
        <input
          type="number"
          name="otp"
          id="otp"
          className="block w-full mt-1 p-3 border rounded-sm bg-background border-border disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-soft"
          autoFocus
          aria-labelledby="otp-error"
          spellCheck="false"
          placeholder="Enter code"
        />
      </div>
      <p className="text-sm text-soft">
        We just sent you an email to your inbox. The code expires shortly, so
        please enter it soon.
      </p>
      <Button className="w-full">Login</Button>
    </form>
  )
}
