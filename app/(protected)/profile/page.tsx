import { auth } from "@/auth"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) return null

  return (
    <main>
      <h1>Profile</h1>
      <p>{session?.user.email}</p>
    </main>
  )
}
