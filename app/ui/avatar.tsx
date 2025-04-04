import clsx from "clsx"
import Image from "next/image"

export default function Avatar({
  src,
  size,
  username,
  className,
}: {
  src?: string | null
  size?: string
  username?: string
  className?: string
}) {
  return (
    <div
      className={clsx(
        "rounded-full overflow-hidden outline-1 outline-gray-50 relative aspect-square",
        {
          "w-12 h-12": size === "sm",
          "w-16 h-16": size === "md",
          "w-24 h-24": size === "lg",
          "w-24 h-24 sm:w-32 sm:h-32": size === "xl" || !size,
        },
        className
      )}
    >
      <Image
        src={src || "/avatar-fallback.jpg"}
        alt={username ? username + "'s avatar" : "avatar"}
        fill={true}
        className="object-cover"
        quality={100}
      />
    </div>
  )
}
