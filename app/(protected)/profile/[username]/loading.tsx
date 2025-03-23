import { FeedSkeleton } from "@/app/ui/feed"
import { ProfileHeaderSkeleton } from "@/app/ui/profile-header"

export default function Loading() {
  return (
    <main>
      <ProfileHeaderSkeleton />
      <FeedSkeleton size={7} />
    </main>
  )
}
