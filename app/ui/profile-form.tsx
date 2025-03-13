"use client"

import { useActionState } from "react"
import { ProfileFormState } from "../lib/actions"
import { Profile } from "@prisma/client"

export default function ProfileForm({
  action,
  buttonText,
  profile,
}: {
  action: (...args: any[]) => any
  buttonText?: string
  profile?: Profile
}) {
  const initialState: ProfileFormState = {
    message: null,
    errors: {},
  }
  const [state, formAction, isPending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {profile && <input type="hidden" name="id" value={profile.id} />}

      <div className="mt-0">
        <label htmlFor="name">Display name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full p-2 border border-gray-300"
          autoFocus
          aria-labelledby="name-error"
          defaultValue={
            (state?.data?.get("name") || profile?.name || "") as string
          }
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
          defaultValue={
            (state?.data?.get("username") || profile?.username || "") as string
          }
        />
        <div className="text-sm text-gray-600">
          Username must only contain letters, numbers, &quot;-&quot; and
          &quot;_&quot;
        </div>
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
        <label htmlFor="bio">
          Bio <span className="text-gray-600">(optional)</span>
        </label>
        <textarea
          name="bio"
          id="bio"
          className="block w-full h-[6rem] p-2 border border-gray-300"
          aria-labelledby="bio-error"
          defaultValue={
            (state?.data?.get("bio") || profile?.bio || "") as string
          }
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
