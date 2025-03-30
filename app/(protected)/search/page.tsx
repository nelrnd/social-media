import PageHeader from "@/app/ui/page-header"
import Search from "@/app/ui/search"
import SearchProfileList, {
  SearchProfileListSkeleton,
} from "@/app/ui/search-profile-list"
import { Suspense } from "react"

export default async function SearchPage(props: {
  searchParams?: Promise<{
    query?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""

  return (
    <main>
      <PageHeader title="Search" />
      <section className="p-6 space-y-6">
        <Search placeholder="Search profiles" />
        <Suspense key={query} fallback={<SearchProfileListSkeleton />}>
          <SearchProfileList query={query} />
        </Suspense>
      </section>
    </main>
  )
}
