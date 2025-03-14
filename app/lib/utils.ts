import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNowStrict } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDate(initialDate: Date) {
  const date = new Date(initialDate)
  const now = new Date()

  let sameYear
  let sameDay

  if (date.getFullYear() === now.getFullYear()) {
    sameYear = true
    if (
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    ) {
      sameDay = true
    }
  }

  if (sameDay) {
    return formatDistanceToNowStrict(date)
      .split(" ")
      .map((part, id) => (id === 1 ? part.slice(0, 1) : part))
      .join("")
  } else if (sameYear) {
    return format(date, "LLL d")
  } else {
    return format(date, "LLL d, y")
  }
}
