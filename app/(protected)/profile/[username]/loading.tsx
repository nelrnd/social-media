import { PageHeaderSkeleton } from "@/app/ui/page-header"
import { PostListSkeleton } from "@/app/ui/post-list"
import { ProfileHeaderSkeleton } from "@/app/ui/profile-header"

export default function Loading() {
  return (
    <main className="h-dvh overflow-hidden">
      <PageHeaderSkeleton />
      <ProfileHeaderSkeleton />
      <PostListSkeleton size={7} />
    </main>
  )
}
