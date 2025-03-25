import { Button } from "@/app/ui/buttons"
import PageHeader from "@/app/ui/page-header"
import { signOut } from "@/auth"

export default function SettingsPage() {
  return (
    <main>
      <PageHeader title="Settings" />

      <section className="p-6 py-12 flex flex-col gap-3">
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button className="w-full">Log out</Button>
        </form>
        <Button className="w-full">Delete account</Button>
      </section>
    </main>
  )
}
