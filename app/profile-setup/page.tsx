import { auth } from "@/auth"
import ProfileForm from "../ui/profile-form"
import { redirect } from "next/navigation"
import { createProfile } from "../lib/actions"

export default async function ProfileSetupPage() {
  const session = await auth()

  if (session?.user.profile) {
    redirect("/")
  }

  return (
    <main>
      <div className="max-w-[32rem] m-auto py-8">
        <h1 className="text-xl font-bold mb-1">Setup profile</h1>
        <p className="text-gray-600 mb-4">
          Let&apos;s quickly create a profile.
        </p>
        <ProfileForm action={createProfile} buttonText="Continue" />
      </div>
    </main>
  )
}
