import { auth } from "@/auth"
import SideBar from "../ui/side-bar"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import ImageGalleryProvider from "../providers/image-gallery-provider"
import HistoryProvider from "../providers/history-provider"
import { NewPostButton } from "../ui/buttons"
import PostFormProvider from "../providers/post-form-provider"

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
          <PostFormProvider>
            <div>
              <SideBar />
              <div className="max-w-[40rem] sm:border-r sm:border-l m-auto border-border min-h-dvh pb-20 sm:pb-0">
                {children}
              </div>
            </div>
          </PostFormProvider>
        </ImageGalleryProvider>
      </HistoryProvider>
    </SessionProvider>
  )
}
