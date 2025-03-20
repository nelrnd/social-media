import React from "react"
import Link from "next/link"
import { auth, signOut } from "@/auth"
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline"
import NavLinks from "./nav-links"
import { spaceMono } from "../fonts"
import { fetchUnreadNotificationsCount } from "../lib/data"

export default async function SideBar() {
  const session = await auth()
  const username = session?.user.profile?.username

  const notificationCount = await fetchUnreadNotificationsCount()

  return (
    <nav className="w-full md:w-[18rem] md:h-screen p-4 md:p-8 border-t md:border-r md:border-t-0 bg-white border-gray-200 bottom-0 md:bottom-auto fixed z-20">
      <ul className="flex md:flex-col gap-3 h-full">
        <li className="mb-8 hidden md:block">
          <Link href="/">
            <span
              className={`text-2xl font-bold hover:underline ${spaceMono.className}`}
            >
              AHSI
            </span>
          </Link>
        </li>

        <NavLinks username={username} notificationCount={notificationCount} />

        <li className="mt-auto -m-3 hidden md:block">
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
