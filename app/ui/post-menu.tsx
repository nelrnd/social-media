import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/ui/dropdown-menu"
import {
  EllipsisHorizontalIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import { Button } from "./buttons"
import { useActionState, useRef, useState } from "react"
import { deletePost } from "../lib/actions"
import { usePathname } from "next/navigation"
import DialogItem, { DialogItemProps } from "./dialog-item"

export default function PostMenu({
  postId,
  asAuthor,
}: {
  postId: string
  asAuthor: boolean
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hasOpenDialog, setHasOpenDialog] = useState(false)
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null)
  const focusRef = useRef<HTMLButtonElement | null>(null)

  function handleDialogItemSelect() {
    focusRef.current = dropdownTriggerRef.current
  }

  function handleDialogItemOpenChange(open: boolean) {
    setHasOpenDialog(open)
    if (open === false) {
      setDropdownOpen(false)
    }
  }

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <button
          className="press absolute top-2 right-2 cursor-pointer size-10 bg-background hover:bg-subtle border border-border flex items-center justify-center rounded-full transition-colors peer-disabled:opacity-50 peer-disabled:cursor-default peer-disabled:hover:bg-background"
          ref={dropdownTriggerRef}
        >
          <span className="sr-only">Open menu</span>
          <EllipsisHorizontalIcon className="size-5 text-soft" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        hidden={hasOpenDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus()
            focusRef.current = null
            event.preventDefault()
          }
        }}
      >
        <CopyPostLink postId={postId} />
        {asAuthor && (
          <DeletePost
            postId={postId}
            onSelect={handleDialogItemSelect}
            onOpenChange={handleDialogItemOpenChange}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type DeletePostProps = Omit<DialogItemProps, "triggerChildren" | "children"> & {
  postId: string
}

function DeletePost({ postId, onSelect, onOpenChange }: DeletePostProps) {
  const pathname = usePathname()
  const [, action, isPending] = useActionState(deletePost, undefined)

  return (
    <DialogItem
      triggerChildren={
        <button className="text-danger flex items-center gap-2">
          <TrashIcon className="size-4" />
          Delete
        </button>
      }
      onSelect={onSelect}
      onOpenChange={onOpenChange}
    >
      <DialogHeader>
        <DialogTitle>Delete post</DialogTitle>
        <DialogDescription>
          Do you really want to delete post? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <form action={action}>
          <input type="hidden" name="postId" value={postId} />
          <input
            type="hidden"
            name="redirectTo"
            value={pathname.startsWith("/post") ? "/" : pathname}
          />
          <Button
            isLoading={isPending}
            className="bg-red-500 hover:bg-red-600 outline-none ring-red-200 focus:ring-2 ring-offset-2"
          >
            Delete
          </Button>
        </form>
      </DialogFooter>
    </DialogItem>
  )
}

function CopyPostLink({ postId }: { postId: string }) {
  function handleCopy() {
    const { origin } = new URL(document.URL)
    const url = origin + "/post/" + postId
    navigator.clipboard.writeText(url)
  }

  return (
    <DropdownMenuItem>
      <button className="flex items-center gap-2" onClick={handleCopy}>
        <LinkIcon className="size-4" />
        Copy link
      </button>
    </DropdownMenuItem>
  )
}
