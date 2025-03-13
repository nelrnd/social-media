"use client"

import { useActionState } from "react"
import { authenticate, AuthState } from "@/app/lib/actions"
import { useSearchParams } from "next/navigation"
import { LoaderCircleIcon } from "lucide-react"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const initialState: AuthState = { message: null, errors: {} }
  const [state, formAction, isPending] = useActionState(
    authenticate,
    initialState
  )

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-xl font-bold">Log in</h1>
      <div>
        <label htmlFor="email" className="text-gray-600">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="block w-full mt-1 p-3 border rounded-sm border-gray-200 focus:outline-black"
          autoFocus
          aria-labelledby="email-error"
          defaultValue={(state?.data?.get("email") || "") as string}
          spellCheck="false"
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
        <label htmlFor="password" className="text-gray-600">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="block w-full mt-1 p-3 border rounded-sm border-gray-200 focus:outline-black"
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
        className="w-full h-[3.125rem] p-3 flex items-center justify-center bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity rounded-sm"
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircleIcon
            className="size-4 animate-spin"
            aria-label="Loading..."
          />
        ) : (
          "Log in"
        )}
      </button>
    </form>
  )
}
