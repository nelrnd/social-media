import PageHeader from "@/app/ui/page-header"
import Search from "@/app/ui/search"
import SearchProfileList from "@/app/ui/search-profile-list"

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
        <SearchProfileList query={query} />
      </section>
    </main>
  )
}
