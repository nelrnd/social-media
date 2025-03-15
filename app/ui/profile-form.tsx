"use client"

import { useActionState } from "react"
import { ProfileFormState } from "../lib/actions"
import { Profile } from "@prisma/client"
import { LoaderCircleIcon } from "lucide-react"
import Avatar from "./avatar"
import AvatarUploader from "./avatar-uploader"

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
      <AvatarUploader initialImage={profile?.imageUrl} />
      <div>
        <label htmlFor="name" className="text-gray-600">
          Display name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full mt-1 p-3 border rounded-sm border-gray-200 focus:outline-black"
          autoFocus
          aria-labelledby="name-error"
          defaultValue={
            (state?.data?.get("name") || profile?.name || "") as string
          }
          spellCheck="false"
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
        <label htmlFor="username" className="text-gray-600">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="block w-full mt-1 p-3 border rounded-sm border-gray-200 focus:outline-black"
          aria-labelledby="username-error"
          defaultValue={
            (state?.data?.get("username") || profile?.username || "") as string
          }
          spellCheck="false"
        />
        <ul className="text-sm text-gray-600 mt-1 pl-4 ml-1">
          <li className="list-disc">
            Username must only contain letters, numbers, &quot;-&quot; and
            &quot;_&quot;
          </li>
          <li className="list-disc">Username must be unique</li>
        </ul>
        <div id="username-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.username && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.username.at(0)}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="bio" className="text-gray-600">
          Bio <span className="text-gray-600">(optional)</span>
        </label>
        <textarea
          name="bio"
          id="bio"
          className="block w-full mt-1 p-3 h-[6rem] border rounded-sm border-gray-200 focus:outline-black resize-none"
          aria-labelledby="bio-error"
          defaultValue={
            (state?.data?.get("bio") || profile?.bio || "") as string
          }
          spellCheck="false"
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
        className="w-fit h-[3.125rem] py-3 px-6 flex items-center justify-center bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity rounded-sm ml-auto relative"
        disabled={isPending}
      >
        <span className={isPending ? "invisible" : ""}>
          {buttonText || "Save"}
        </span>
        {isPending && (
          <LoaderCircleIcon
            className="size-4 animate-spin absolute object-center"
            aria-label="Loading"
          />
        )}
      </button>
    </form>
  )
}
