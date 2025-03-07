import { auth } from "@/auth"
import ProfileForm from "../ui/profile-form"
import { redirect } from "next/navigation"

export default async function ProfileSetupPage() {
  const session = await auth()

  if (session?.user.profile) {
    redirect("/")
  }

  return (
    <main>
      <div className="max-w-[32rem] m-auto py-8">
        <h1 className="text-xl font-bold">Setup profile</h1>
        <p className="text-gray-600">Let&apos;s quickly create a profile.</p>
        <ProfileForm buttonText="Continue" />
      </div>
    </main>
  )
}
