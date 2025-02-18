import CommentForm from "../comment-form"
import CommentList from "../comment-list"

export default function PostCommentSection({ postId }: { postId: string }) {
  return (
    <section className="p-4 pt-0">
      <div className="h-[1px] bg-gray-200"></div>
      <CommentForm postId={postId} />
      <CommentList postId={postId} />
    </section>
  )
}
