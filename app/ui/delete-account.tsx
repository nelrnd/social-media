"use client"

import { useActionState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog"
import { deleteUser } from "../lib/actions"
import { Button } from "./buttons"

export default function DeleteAccount({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, action, isPending] = useActionState(deleteUser, undefined)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <form action={action}>
            <Button variant="danger" isLoading={isPending}>
              Confirm
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
