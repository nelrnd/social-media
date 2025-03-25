"use client"

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
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setTheme("light")}
          className={clsx("p-2 border border-border rounded-sm", {
            "ring-2 ring-offset-2  ring-foreground ring-offset-background":
              theme === "light",
          })}
        >
          Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={clsx("p-2 border border-border rounded-sm", {
            "ring-2 ring-offset-2 ring-foreground ring-offset-background":
              theme === "dark",
          })}
        >
          Dark
        </button>
        <button
          onClick={() => setTheme("system")}
          className={clsx("p-2 border border-border rounded-sm", {
            "ring-2 ring-offset-2 ring-foreground ring-offset-background":
              theme === "system",
          })}
        >
          System
        </button>
      </div>
    </div>
  )
}
