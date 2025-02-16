"use client"

import { useState } from "react"

export default function ProfileForm({
  title,
  buttonText,
}: {
  title?: string
  buttonText?: string
}) {
  const [state, setState] = useState({ errors: [] })

  const isPending = false

  return (
    <form className="space-y-4">
      <h1 className="text-xl font-bold">{title || "Setup profile"}</h1>
      <div>
        <label htmlFor="name">Display name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full p-2 border border-gray-300"
          autoFocus
          aria-labelledby="name-error"
          defaultValue={(state?.data?.get("name") || "") as string}
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.name && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.name.at(0)}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          className="block w-full p-2 border border-gray-300"
          aria-labelledby="username-error"
          defaultValue={(state?.data?.get("username") || "") as string}
        />
        <div className="text-sm text-gray-600">Username must be unique</div>
        <div id="username-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.username && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.username.at(0)}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="bio">Bio (a few words about yourself)</label>
        <textarea
          name="bio"
          id="bio"
          className="block w-full p-2 border border-gray-300"
          aria-labelledby="bio-error"
          defaultValue={(state?.data?.get("bio") || "") as string}
        ></textarea>
        <div id="bio-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.bio && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.bio.at(0)}
            </p>
          )}
        </div>
      </div>
      <button
        className="block w-fit ml-auto py-2 px-6 bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity"
        disabled={isPending}
      >
        {isPending ? "Loading..." : buttonText || "Save"}
      </button>
    </form>
  )
}
