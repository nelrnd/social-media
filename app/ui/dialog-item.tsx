import { forwardRef } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/app/ui/dialog"
import { DropdownMenuItem } from "./dropdown-menu"

export type DialogItemProps = {
  triggerChildren: React.ReactNode
  children: React.ReactNode
  onSelect?: () => void
  onOpenChange?: (open: boolean) => void
}

const DialogItem = forwardRef<HTMLDivElement, DialogItemProps>(
  (props, forwardedRef) => {
    const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } =
      props

    return (
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={forwardedRef}
            onSelect={(event) => {
              event.preventDefault()
              onSelect && onSelect()
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    )
  }
)

export default DialogItem
