import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/ui/dropdown-menu"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline"
import { Button } from "./buttons"
import { useActionState } from "react"
import { deleteComment } from "../lib/actions"
import { usePathname } from "next/navigation"

export default function CommentMenu({ commentId }: { commentId: string }) {
  const pathname = usePathname()
  const [, action, isPending] = useActionState(deleteComment, undefined)

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-2 right-2 cursor-pointer size-10 bg-white hover:bg-gray-100 border border-gray-100 flex items-center justify-center rounded-full transition-colors peer-disabled:opacity-50 peer-disabled:cursor-default peer-disabled:hover:bg-white">
            <span className="sr-only">Open menu</span>
            <EllipsisHorizontalIcon className="size-5 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <span className="text-red-500">Delete comment</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment</DialogTitle>
          <DialogDescription>
            Do you really want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form action={action}>
            <input type="hidden" name="commentId" value={commentId} />
            <input type="hidden" name="redirectTo" value={pathname} />
            <Button
              isLoading={isPending}
              className="bg-red-500 hover:bg-red-600 outline-none ring-red-200 focus:ring-2 ring-offset-2"
            >
              Delete
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
