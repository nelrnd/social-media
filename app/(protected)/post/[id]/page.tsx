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
    <main className="relative h-[200vh]">
      <PageHeader title="Post" allowBack={true} />
      <Post post={post} />
      <div className="p-6 fixed w-[calc(36rem_-_2px)] bottom-0 border-t border-gray-200 bg-white/70 backdrop-blur-md z-20">
        <CommentForm postId={post.id} />
      </div>
      <div className="p-6">
        <h3 className="font-bold leading-none mb-2">Comments</h3>
        <CommentList comments={comments} />
      </div>
    </main>
  )
}
