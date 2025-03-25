import { Button } from "@/app/ui/buttons"
import DeleteAccount from "@/app/ui/delete-account"
import PageHeader from "@/app/ui/page-header"
import ThemeSwitcher from "@/app/ui/theme-switcher"
import { signOut } from "@/auth"

export default function SettingsPage() {
  return (
    <main>
      <PageHeader title="Settings" />

      <section className="p-6 py-12 flex flex-col gap-3">
        <ThemeSwitcher />
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button className="w-full" variant="secondary">
            Log out
          </Button>
        </form>
        <DeleteAccount>
          <Button className="w-full" variant="danger">
            Delete account
          </Button>
        </DeleteAccount>
      </section>
    </main>
  )
}
