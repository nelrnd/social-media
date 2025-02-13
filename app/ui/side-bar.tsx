import Link from "next/link"
import { signOut } from "@/auth"

export default function SideBar() {
  return (
    <nav className="w-[18rem] h-screen p-8 border-r border-gray-200">
      <ul className="flex flex-col h-full gap-4">
        <li className="mb-8">
          <Link href="/">
            <span className="text-2xl font-bold">AHSI</span>
          </Link>
        </li>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/notifications">Notifications</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
        <li className="mt-auto">
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button>Log out</button>
          </form>
        </li>
      </ul>
    </nav>
  )
}
