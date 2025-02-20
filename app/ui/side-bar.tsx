import React from "react"
import Link from "next/link"
import { auth, signOut } from "@/auth"
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline"
import NavLinks from "./nav-links"

export default async function SideBar() {
  const session = await auth()
  const username = session?.user.profile?.username

  return (
    <nav className="lg:w-[18rem] h-screen p-8 border-r bg-white border-gray-200 lg:fixed w-fit">
      <ul className="flex flex-col gap-3 h-full">
        <li className="mb-8">
          <Link href="/">
            <span className="text-2xl font-bold hover:underline">AHSI</span>
          </Link>
        </li>

        <NavLinks username={username} />

        <li className="mt-auto -m-3">
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button
              type="submit"
              className="w-full p-3 hover:bg-red-50 rounded-full font-semibold flex items-center gap-2 text-red-500"
            >
              <ArrowLeftStartOnRectangleIcon className="size-6" />
              Log out
            </button>
          </form>
        </li>
      </ul>
    </nav>
  )
}
