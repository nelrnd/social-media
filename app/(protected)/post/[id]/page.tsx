import { fetchComments, fetchPostById } from "@/app/lib/data"
import CommentForm from "@/app/ui/comment-form"
import CommentList from "@/app/ui/comment-list"
import PageHeader from "@/app/ui/page-header"
import Post from "@/app/ui/post/post"

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
      <CommentList comments={comments} />
      <CommentForm postId={post.id} />
    </main>
  )
}
