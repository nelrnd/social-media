import React from "react"
import Link from "next/link"
import { auth, signOut } from "@/auth"
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline"
import NavLinks from "./nav-links"
import { spaceMono } from "../fonts"

export default async function SideBar() {
  const session = await auth()
  const username = session?.user.profile?.username

  return (
    <nav className="w-full xl:w-[18rem] h-20 xl:h-screen p-4 xl:p-8 border-t xl:border-r xl:border-t-0 bg-background border-border bottom-0 xl:bottom-auto fixed z-50">
      <ul className="flex xl:flex-col gap-3 h-full">
        <li className="mb-8 hidden xl:block">
          <Link href="/">
            <span
              className={`text-2xl font-bold hover:underline ${spaceMono.className}`}
            >
              AHSI
            </span>
          </Link>
        </li>

        <NavLinks username={username} />

        <li className="mt-auto -m-3 hidden xl:block">
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button
              type="submit"
              className="w-full p-3 hover:bg-subtle rounded-full font-semibold flex items-center gap-2 text-danger transition-colors"
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
