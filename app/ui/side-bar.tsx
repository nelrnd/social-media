import React from "react"
import Link from "next/link"
import { signOut } from "@/auth"
import {
  ArrowLeftStartOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline"

const links = [
  {
    href: "/",
    text: "Home",
    icon: <HomeIcon />,
  },
  {
    href: "/notifications",
    text: "Notifications",
    icon: <BellIcon />,
  },
  {
    href: "/profile",
    text: "Profile",
    icon: <UserIcon />,
  },
  {
    href: "/settings",
    text: "Settings",
    icon: <Cog6ToothIcon />,
  },
]

export default function SideBar() {
  return (
    <nav className="lg:w-[18rem] h-screen p-8 border-r bg-white border-gray-200 lg:fixed w-fit">
      <ul className="flex flex-col gap-3 h-full">
        <li className="mb-8">
          <Link href="/">
            <span className="text-2xl font-bold hover:underline">AHSI</span>
          </Link>
        </li>

        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="p-3 -mx-3 hover:bg-gray-50 rounded-full font-semibold flex items-center gap-2"
            >
              {React.cloneElement(link.icon, { className: "size-6" })}
              {link.text}
            </Link>
          </li>
        ))}

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
