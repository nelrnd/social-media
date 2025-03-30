import { CommentSkeleton } from "@/app/ui/comment"
import PageHeader from "@/app/ui/page-header"
import { PostSkeleton } from "@/app/ui/post"

export default function Loading() {
  return (
    <main className="relative min-h-[calc(100dvh-5rem)] xl:min-h-dvh flex flex-col">
      <div>
        <PageHeader title="Post" allowBack={true} />
        <PostSkeleton />
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold leading-none p-6">Comments</h3>

        <div className="p-6 py-0 flex-1 flex flex-col">
          <div>
            {[...Array(3).keys()].map((item) => (
              <CommentSkeleton key={item} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
