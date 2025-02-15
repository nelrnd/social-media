"use client"

import { useActionState } from "react"
import { register, AuthState } from "@/app/lib/actions"

export default function RegisterForm() {
  const initialState: AuthState = { message: null, errors: {} }
  const [state, formAction, isPending] = useActionState(register, initialState)

  return (
    <form action={formAction} className="space-y-4 mb-8">
      <h1 className="text-xl font-bold">Register</h1>
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
      <input type="hidden" name="redirectTo" value="/" />
      <button
        className="block w-full p-2 bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity"
        disabled={isPending}
      >
        {isPending ? "Loading..." : "Register"}
      </button>
    </form>
  )
}
