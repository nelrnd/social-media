"use client"

import { useActionState } from "react"
import { authenticate } from "@/app/lib/actions"
import { useSearchParams } from "next/navigation"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  )

  return (
    <form action={formAction}>
      <h1>Log in</h1>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <button aria-disabled={isPending}>Log in</button>
      <div aria-live="polite" aria-atomic="true">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </form>
  )
}
