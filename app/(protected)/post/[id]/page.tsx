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
  const comments = await fetchComments(id)

  if (!post) return null

  return (
    <main className="relative">
      <div>
        <PageHeader title="Post" allowBack={true} />
        <Post post={post} />
      </div>

      <div>
        <h3 className="font-bold leading-none p-6">Comments</h3>

        <div className="p-6 py-0">
          <div>
            <CommentList comments={comments} />
          </div>
          <div className="-mx-6 p-6 sticky w-[calc(36rem_-_2px)] bottom-0 border-t border-border backdrop-blur-md z-20">
            <CommentForm postId={post.id} />
            <div className="bg-background opacity-90 absolute inset-0 -z-10"></div>
          </div>
        </div>
      </div>
    </main>
  )
}
