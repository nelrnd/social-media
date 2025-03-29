import { fetchComments, fetchPostById } from "@/app/lib/data"
import CommentForm from "@/app/ui/comment-form"
import CommentList from "@/app/ui/comment-list"
import PageHeader from "@/app/ui/page-header"
import Post from "@/app/ui/post"

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const post = await fetchPostById(id)
  const { comments: initialComments, hasMoreComments } = await fetchComments({
    postId: id,
  })

  if (!post) return null

  return (
    <main className="relative min-h-[calc(100dvh-5rem)] xl:min-h-dvh flex flex-col">
      <div>
        <PageHeader title="Post" allowBack={true} />
        <Post post={post} />
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold leading-none p-6">Comments</h3>

        <div className="p-6 py-0 flex-1 flex flex-col">
          <div>
            <CommentList
              initialComments={initialComments}
              initialHasMoreComments={hasMoreComments}
              postId={id}
            />
          </div>
          <div className="-mx-6 mt-auto p-6 sticky sm:w-[calc(40rem_-_2px)] bottom-20 xl:bottom-0 border-t border-border backdrop-blur-md z-20">
            <CommentForm postId={post.id} />
            <div className="bg-background opacity-90 absolute inset-0 -z-10"></div>
          </div>
        </div>
      </div>
    </main>
  )
}
