"use client"

import { useActionState, useRef } from "react"
import { authenticate, AuthState } from "@/app/lib/actions"
import { useSearchParams } from "next/navigation"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const initialState: AuthState = { message: null, errors: {} }
  const [state, formAction, isPending] = useActionState(
    authenticate,
    initialState
  )

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
          autoFocus
          aria-labelledby="email-error"
          defaultValue={(state?.data?.get("email") || "") as string}
        />
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.email && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.email.at(0)}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="block w-full p-2 border border-gray-300"
          aria-labelledby="password-error"
          defaultValue={(state?.data?.get("password") || "") as string}
        />
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.password && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.password.at(0)}
            </p>
          )}
        </div>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {state?.message && <p className="mt-2 text-red-500">{state.message}</p>}
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <button
        className="block w-full p-2 bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity"
        disabled={isPending}
      >
        {isPending ? "Loading..." : "Log in"}
      </button>
    </form>
  )
}
