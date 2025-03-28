"use client"

import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div>
      <h3 className="mb-2">Theme</h3>
      <div className="grid min-[420px]:grid-cols-3 gap-3">
        <button
          onClick={() => setTheme("light")}
          className={clsx(
            "py-2 px-3 border border-border rounded-sm flex items-center gap-2",
            {
              "ring-2 ring-offset-2  ring-foreground ring-offset-background":
                theme === "light",
            }
          )}
        >
          <SunIcon className="size-5" />
          Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={clsx(
            "py-2 px-3 border border-border rounded-sm flex items-center gap-2",
            {
              "ring-2 ring-offset-2 ring-foreground ring-offset-background":
                theme === "dark",
            }
          )}
        >
          <MoonIcon className="size-5" />
          Dark
        </button>
        <button
          onClick={() => setTheme("system")}
          className={clsx(
            "py-2 px-3 border border-border rounded-sm flex items-center gap-2",
            {
              "ring-2 ring-offset-2 ring-foreground ring-offset-background":
                theme === "system",
            }
          )}
        >
          <ComputerDesktopIcon className="size-5" />
          System
        </button>
      </div>
    </div>
  )
}
