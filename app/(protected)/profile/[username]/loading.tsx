import { FeedSkeleton } from "@/app/ui/feed"
import { PageHeaderSkeleton } from "@/app/ui/page-header"
import { ProfileHeaderSkeleton } from "@/app/ui/profile-header"

export default function Loading() {
  return (
    <main>
      <PageHeaderSkeleton />
      <ProfileHeaderSkeleton />
      <FeedSkeleton size={7} />
    </main>
  )
}
