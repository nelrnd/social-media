import { fetchComments, fetchPostById } from "@/app/lib/data"
import CommentForm from "@/app/ui/comment-form"
import CommentList from "@/app/ui/comment-list"
import PageHeader from "@/app/ui/page-header"
import Post from "@/app/ui/post"
import PostLikes from "@/app/ui/post-likes"

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
    <main>
      <PageHeader title="Post" allowBack={true} />
      <Post post={post} />
      <div className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Comments</h3>
          <PostLikes postId={post.id} />
        </div>
        <CommentForm postId={post.id} />
        <CommentList comments={comments} />
      </div>
    </main>
  )
}
