"use client"

import clsx from "clsx"
import { useState } from "react"

export default function TabSwitcher() {
  const [feedType, setFeedType] = useState("discover")

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFeedType(event.currentTarget.value)
  }

  return (
    <div className="p-1 border-b border-border group">
      <div className="relative grid grid-cols-2">
        <div className="relative z-10">
          <input
            type="radio"
            name="feedType"
            id="discover"
            value="discover"
            onChange={handleChange}
            checked={feedType === "discover"}
            className="absolute inset-0 appearance-none cursor-pointer"
          />
          <label
            htmlFor="discover"
            className={clsx(
              "h-[56px] flex items-center justify-center px-6 py-3 text-center rounded-lg transition-colors",
              { underline: feedType === "discover" }
            )}
          >
            Discover
          </label>
        </div>
        <div className="relative z-10">
          <input
            type="radio"
            name="feedType"
            id="following"
            value="following"
            onChange={handleChange}
            checked={feedType === "following"}
            className="absolute inset-0 appearance-none cursor-pointer"
          />
          <label
            htmlFor="following"
            className={clsx(
              "h-[56px] flex items-center justify-center px-6 py-3 text-center rounded-lg transition-colors",
              { underline: feedType === "following" }
            )}
          >
            Following
          </label>
        </div>
        <div
          className={clsx(
            "bg-subtle h-[56px] w-1/2 absolute top-0 left-0 z-0 transition-transform rounded-lg group-active:scale-95",
            {
              "translate-x-0": feedType === "discover",
              "translate-x-full": feedType === "following",
            }
          )}
        />
      </div>
    </div>
  )
}
