"use client"

import React from "react"
import Link from "next/link"
import {
  BellIcon as BellIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  HomeIcon as HomeIconOutline,
  UserIcon as UserIconOutline,
} from "@heroicons/react/24/outline"
import {
  BellIcon as BellIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid"
import { usePathname } from "next/navigation"

function checkIfActive(pathname: string, href: string) {
  if (pathname.startsWith("/profile")) return pathname === href
  return pathname.split("/").at(-1) === href.slice(1)
}

export default function NavLinks({ username }: { username?: string }) {
  const pathname = usePathname()

  const links = [
    {
      href: "/",
      text: "Home",
      icons: {
        default: <HomeIconOutline />,
        active: <HomeIconSolid />,
      },
    },
    {
      href: "/notifications",
      text: "Notifications",
      icons: {
        default: <BellIconOutline />,
        active: <BellIconSolid />,
      },
    },
    {
      href: `/profile/${username}`,
      text: "Profile",
      icons: {
        default: <UserIconOutline />,
        active: <UserIconSolid />,
      },
    },
    {
      href: "/settings",
      text: "Settings",
      icons: {
        default: <Cog6ToothIconOutline />,
        active: <Cog6ToothIconSolid />,
      },
    },
  ]

  return (
    <>
      {links.map((link) => {
        const isActive = checkIfActive(pathname, link.href)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className="p-3 -mx-3 hover:bg-gray-50 rounded-full font-semibold flex items-center gap-2"
            >
              {React.cloneElement(
                isActive ? link.icons.active : link.icons.default,
                { className: "size-6" }
              )}
              {link.text}
            </Link>
          </li>
        )
      })}
    </>
  )
}
