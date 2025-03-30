"use client"

import clsx from "clsx"
import { useHomePosts } from "../providers/home-posts-provider"

export default function FeedModeSwitcher() {
  const { feedMode, setFeedMode } = useHomePosts()

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFeedMode(event.currentTarget.value as "discover" | "following")
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
            checked={feedMode === "discover"}
            className="absolute inset-0 appearance-none cursor-pointer"
          />
          <label
            htmlFor="discover"
            className={clsx(
              "h-[56px] flex items-center justify-center px-6 py-3 text-center rounded-lg transition-colors",
              { underline: feedMode === "discover" }
            )}
          >
            Discover
          </label>
        </div>
        <div className="relative z-10">
          <input
            type="radio"
            name="feedMode"
            id="following"
            value="following"
            onChange={handleChange}
            checked={feedMode === "following"}
            className="absolute inset-0 appearance-none cursor-pointer"
          />
          <label
            htmlFor="following"
            className={clsx(
              "h-[56px] flex items-center justify-center px-6 py-3 text-center rounded-lg transition-colors",
              { underline: feedMode === "following" }
            )}
          >
            Following
          </label>
        </div>
        <div
          className={clsx(
            "bg-subtle h-[56px] w-1/2 absolute top-0 left-0 z-0 transition-transform rounded-lg group-active:scale-95",
            {
              "translate-x-0": feedMode === "discover",
              "translate-x-full": feedMode === "following",
            }
          )}
        />
      </div>
    </div>
  )
}
