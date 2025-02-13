"use client"

import { useActionState } from "react"
import { register } from "@/app/lib/actions"

export default function RegisterForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined
  )
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
      <button className="block w-full p-2 bg-gray-900 text-white">
        Register
      </button>
    </form>
  )
}
