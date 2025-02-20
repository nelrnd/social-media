import { fetchLikes } from "@/app/lib/data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"

export default async function PostLikesModal({ postId }: { postId: string }) {
  const likes = await fetchLikes(postId)

  return (
    <Dialog>
      <DialogTrigger>Likes</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post likes</DialogTitle>
          <DialogDescription className="sr-only">
            People who liked this post
          </DialogDescription>
        </DialogHeader>
        <div>
          {likes.map((like) => (
            <p key={like.id}>{like.user?.profile?.username}</p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
