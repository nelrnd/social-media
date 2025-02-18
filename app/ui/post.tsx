import { Prisma } from "@prisma/client"
import moment from "moment"
import Link from "next/link"
import { likePost } from "../lib/actions"
import { useSession } from "next-auth/react"
import CommentForm from "./comment-form"
import PostCommentSection from "./post-comment-section"
import PostMenu from "./post-menu"

export default function Post({
  post,
}: {
  post: Prisma.PostGetPayload<{
    include: { user: { select: { profile: true } }; likes: true }
  }>
}) {
  return (
    <article className="border-b border-gray-200 space-y-2">
      <div className="p-4">
        <header className="flex items-center justify-between">
          <p>
            <Link
              href={`/profile/${post.user.profile?.username}`}
              className="hover:underline"
            >
              <span className="font-bold">{post.user.profile?.name}</span>{" "}
              <span className="text-gray-600">
                {post.user.profile?.username}
              </span>
            </Link>
          </p>
          <time className="text-gray-600 text-sm">
            {moment(post.createdAt).format("LT")}
          </time>
        </header>
        <p>{post.content}</p>
      </div>
      <PostMenu post={post} />
      <PostCommentSection postId={post.id} />
    </article>
  )
}
