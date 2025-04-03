import { Metadata } from "next"
import NotFound from "./ui/not-found"

export const metadata: Metadata = {
  title: "Page not found",
}

export default function NotFoundPage() {
  return <NotFound>Could not find this page</NotFound>
}
