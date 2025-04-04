import { Button } from "@/app/ui/buttons"
import DeleteAccount from "@/app/ui/delete-account"
import PageHeader from "@/app/ui/page-header"
import ThemeSwitcher from "@/app/ui/theme-switcher"
import { signOut } from "@/auth"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
}

export default function SettingsPage() {
  return (
    <main>
      <PageHeader title="Settings" />

      <section className="p-6 py-12 flex flex-col gap-6">
        <ThemeSwitcher />
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/join" })
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
