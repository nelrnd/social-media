import PageHeader from "@/app/ui/page-header"
import ProfileForm from "@/app/ui/profile-form"

export default function Page() {
  return (
    <main>
      <PageHeader title="Edit profile" />
      <section className="p-4">
        <ProfileForm />
      </section>
    </main>
  )
}
