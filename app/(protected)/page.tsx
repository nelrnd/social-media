import { Metadata } from "next"
import PageHeader from "../ui/page-header"
import { PostFormWrapper } from "../ui/post-form"
import { HomePostList } from "../ui/post-list"

export const metadata: Metadata = {
  title: "Home",
}

export default async function HomePage() {
  return (
    <main>
      <PageHeader title="Home" />
      <div className="p-6 border-b border-border">
        <PostFormWrapper />
      </div>
      <HomePostList />
    </main>
  )
}
