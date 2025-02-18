import CommentForm from "./comment-form"
import CommentList from "./comment-list"

export default function PostCommentSection({ postId }: { postId: string }) {
  return (
    <section className="border-t border-gray-200">
      <CommentForm postId={postId} />
      <CommentList postId={postId} />
    </section>
  )
}
