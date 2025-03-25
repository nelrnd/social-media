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
      <div className="max-w-[32rem] m-auto p-4 pt-8">
        <header className="space-y-1 mb-4">
          <h1 className="text-xl font-bold">Setup profile</h1>
          <p className="text-gray-500">Let&apos;s quickly create a profile.</p>
        </header>
        <ProfileForm action={createProfile} buttonText="Continue" />
      </div>
    </main>
  )
}
