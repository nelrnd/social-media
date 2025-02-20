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
        <ProfileForm buttonText="Continue" />
      </div>
    </main>
  )
}
