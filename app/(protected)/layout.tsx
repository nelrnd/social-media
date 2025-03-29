import { auth } from "@/auth"
import SideBar from "../ui/side-bar"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import ImageGalleryProvider from "../providers/image-gallery-provider"
import HistoryProvider from "../providers/history-provider"
import PostFormProvider from "../providers/post-form-provider"
import HomePostsProvider from "../providers/home-posts-provider"

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
          <HomePostsProvider>
            <PostFormProvider>
              <div>
                <SideBar />
                <div className="max-w-[40rem] min-h-dvh pb-20 xl:pb-0 box-border sm:border-r sm:border-l m-auto border-border">
                  {children}
                </div>
              </div>
            </PostFormProvider>
          </HomePostsProvider>
        </ImageGalleryProvider>
      </HistoryProvider>
    </SessionProvider>
  )
}
