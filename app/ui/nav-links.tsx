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
import clsx from "clsx"
import { useNotifications } from "../providers/notifications-provider"

function checkIfActive(pathname: string, href: string) {
  if (pathname.startsWith("/profile")) return pathname === href
  return pathname.split("/").at(-1) === href.slice(1)
}

export default function NavLinks({ username }: { username?: string }) {
  const pathname = usePathname()
  const { count } = useNotifications()

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
      count,
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
          <li key={link.href} className="flex-1 xl:flex-initial">
            <Link
              href={link.href}
              className="p-3 xl:-mx-3 hover:bg-subtle rounded-full font-semibold flex justify-center xl:justify-start items-center gap-2 transition-colors"
            >
              <div className="relative">
                {!!link.count && (
                  <CountBadge
                    count={link.count}
                    className="absolute -top-1.5 -right-1.5 outline outline-1 outline-background"
                  />
                )}
                {React.cloneElement(
                  isActive ? link.icons.active : link.icons.default,
                  { className: "size-6" }
                )}
              </div>
              <span className="sr-only xl:not-sr-only">{link.text}</span>
            </Link>
          </li>
        )
      })}
    </>
  )
}

function CountBadge({
  count,
  className,
}: {
  count: number
  className?: string
}) {
  if (count === 0) return null

  return (
    <div
      className={clsx(
        "size-4 rounded-full bg-accent text-background dark:text-foreground grid place-content-center",
        className
      )}
    >
      <span className="text-xs">{count}</span>
    </div>
  )
}
