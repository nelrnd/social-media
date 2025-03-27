"use client"

import { useActionState } from "react"
import { register, AuthState } from "@/app/lib/actions"
import { Button } from "./buttons"

export default function RegisterForm() {
  const initialState: AuthState = { message: null, errors: {} }
  const [state, formAction, isPending] = useActionState(register, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-xl font-bold">Register</h1>
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
          defaultValue={(state?.data?.get("email") || "") as string}
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
      <div>
        <label htmlFor="password" className="text-soft">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="block w-full mt-1 p-3 border rounded-sm bg-background border-border"
          aria-labelledby="password-error"
          defaultValue={(state?.data?.get("password") || "") as string}
          spellCheck="false"
        />
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.password && (
            <p className="text-danger text-sm mt-1">
              {state.errors.password.at(0)}
            </p>
          )}
        </div>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {state?.message && <p className="mt-2 text-danger">{state.message}</p>}
      </div>
      <input type="hidden" name="redirectTo" value="/" />
      <Button className="w-full" isLoading={isPending}>
        Register
      </Button>
    </form>
  )
}
