import { auth } from "@/auth"
import SideBar from "../ui/side-bar"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()

  if (!session?.user.profile) {
    redirect("/profile-setup")
  }

  return (
    <SessionProvider>
      <div>
        <SideBar />
        <div className="max-w-[36rem] m-auto border-r border-l border-gray-200 min-h-screen">
          {children}
        </div>
      </div>
    </SessionProvider>
  )
}
