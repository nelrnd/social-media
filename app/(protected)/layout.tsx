import { auth } from "@/auth"
import SideBar from "../ui/side-bar"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import ImageGalleryProvider from "../providers/image-gallery-provider"
import HistoryProvider from "../providers/history-provider"

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()

  if (!session?.user.profile) {
    redirect("/profile-setup")
  }

  return (
    <SessionProvider>
      <HistoryProvider>
        <ImageGalleryProvider>
          <div>
            <SideBar />
            <div className="max-w-[36rem] m-auto border-r border-l border-border min-h-screen">
              {children}
            </div>
          </div>
        </ImageGalleryProvider>
      </HistoryProvider>
    </SessionProvider>
  )
}
