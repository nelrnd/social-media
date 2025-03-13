import { updateProfile } from "@/app/lib/actions"
import { fetchProfile } from "@/app/lib/data"
import PageHeader from "@/app/ui/page-header"
import ProfileForm from "@/app/ui/profile-form"
import { auth } from "@/auth"

export default async function EditProfilePage() {
  const session = await auth()

  if (!session?.user) {
    return <p>User not logged in</p>
  }

  const profile = await fetchProfile(session?.user?.profile?.username || "")

  if (!profile) {
    return <p>No profile</p>
  }

  return (
    <main>
      <PageHeader title="Edit profile" />
      <section className="p-4">
        <ProfileForm action={updateProfile} profile={profile} />
      </section>
    </main>
  )
}
