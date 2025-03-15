import { uploadImage } from "@/app/lib/actions"
import PageHeader from "@/app/ui/page-header"

export default function SettingsPage() {
  return (
    <main>
      <PageHeader title="Settings" />

      <form action={uploadImage}>
        <input type="file" name="image" />
        <button>Submit</button>
      </form>
    </main>
  )
}
