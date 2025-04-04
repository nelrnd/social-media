"use client"

import { useActionState } from "react"
import { emailSignIn, verifyEmail, VerifyEmailState } from "../lib/actions"
import { Button } from "./buttons"

export default function JoinForm() {
  return (
    <div>
      <JoinForm_EmailVerification />
    </div>
  )
}

function JoinForm_EmailVerification() {
  const [state, action, isPending] = useActionState(emailSignIn, undefined)

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
          className="block w-full mt-1 p-3 border rounded-sm bg-background border-border"
          autoFocus
          aria-labelledby="email-error"
          spellCheck="false"
        />
      </div>
      <Button className="w-full" isLoading={isPending}>
        Continue
      </Button>
    </form>
  )
}
