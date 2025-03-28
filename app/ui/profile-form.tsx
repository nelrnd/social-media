"use client"

import { useActionState } from "react"
import { ProfileFormState } from "../lib/actions"
import { Profile } from "@prisma/client"
import AvatarUploader from "./avatar-uploader"
import { Button } from "./buttons"

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
      <AvatarUploader
        initialImage={profile?.imageUrl}
        errors={state?.errors?.image}
      />
      <div>
        <label htmlFor="name" className="text-soft">
          Display name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full mt-1 p-3 border rounded-sm bg-background border-border"
          autoFocus
          aria-labelledby="name-error"
          defaultValue={
            (state?.data?.get("name") || profile?.name || "") as string
          }
          spellCheck="false"
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.name && (
            <p className="text-danger text-sm mt-1">
              {state.errors.name.at(0)}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="username" className="text-soft">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="block w-full mt-1 p-3 border rounded-sm bg-background border-border"
          aria-labelledby="username-error"
          defaultValue={
            (state?.data?.get("username") || profile?.username || "") as string
          }
          spellCheck="false"
        />
        <ul className="text-sm text-soft mt-1 pl-4 ml-1">
          <li className="list-disc">
            Username must only contain letters, numbers, &quot;-&quot; and
            &quot;_&quot;
          </li>
        </ul>
        <div id="username-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.username && (
            <p className="text-danger text-sm mt-1">
              {state.errors.username.at(0)}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="bio" className="text-soft">
          Bio <span className="text-soft">(optional)</span>
        </label>
        <textarea
          name="bio"
          id="bio"
          className="block w-full mt-1 p-3 h-[6rem] border rounded-sm bg-background border-border resize-none"
          aria-labelledby="bio-error"
          defaultValue={
            (state?.data?.get("bio") || profile?.bio || "") as string
          }
          spellCheck="false"
        ></textarea>
        <div id="bio-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.bio && (
            <p className="text-danger text-sm mt-1">{state.errors.bio.at(0)}</p>
          )}
        </div>
      </div>
      <Button isLoading={isPending} className="ml-auto">
        {buttonText || "Save"}
      </Button>
    </form>
  )
}
