import PageHeader from "@/app/ui/page-header"
import Search from "@/app/ui/search"

export default function SearchPage() {
  return (
    <main>
      <PageHeader title="Search" />
      <section className="p-6">
        <Search placeholder="Search profiles" />
      </section>
    </main>
  )
}
