"use client"

import { useActionState } from "react"
import { verifyEmail, VerifyEmailState } from "../lib/actions"
import { Button } from "./buttons"

export default function JoinForm() {
  return (
    <div>
      <JoinForm_EmailVerification />
    </div>
  )
}

function JoinForm_EmailVerification() {
  const initialState: VerifyEmailState = { errors: {} }
  const [state, action, isPending] = useActionState(verifyEmail, initialState)

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
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.email && (
            <p className="text-danger text-sm mt-1">
              {state.errors.email.at(0)}
            </p>
          )}
        </div>
      </div>
      <Button className="w-full" isLoading={isPending}>
        Continue
      </Button>
    </form>
  )
}
