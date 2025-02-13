"use client"

import { useActionState, useRef } from "react"
import { authenticate } from "@/app/lib/actions"
import { useSearchParams } from "next/navigation"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const firstInput = useRef<HTMLInputElement | null>(null)
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  )

  if (errorMessage) {
    firstInput.current?.focus()
  }

  return (
    <form action={formAction} className="space-y-4 mb-8">
      <h1 className="text-xl font-bold">Log in</h1>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="block w-full p-2 border border-gray-300"
          ref={firstInput}
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="block w-full p-2 border border-gray-300"
        />
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <button
        aria-disabled={isPending}
        className="block w-full p-2 bg-gray-900 text-white"
      >
        Log in
      </button>
      <div aria-live="polite" aria-atomic="true">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </form>
  )
}
