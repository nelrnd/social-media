import Image from "next/image"

export default function Avatar({
  src,
  size,
  username,
}: {
  src?: string | null
  size?: string
  username?: string
}) {
  function getSize(size?: string) {
    switch (size) {
      case "sm":
        return 32
      case "md":
        return 64
      case "lg":
        return 96
      case "xl":
      default:
        return 128
    }
  }

  return (
    <div className="rounded-full w-fit h-fit overflow-hidden outline outline-gray-50">
      <Image
        src={src || "/avatar-fallback.jpg"}
        alt={username ? username + "'s avatar" : "avatar"}
        width={getSize(size)}
        height={getSize(size)}
        className="aspect-square object-cover"
      />
    </div>
  )
}

/*
const sizes = {
  "w-[2rem] h-[2rem]": size === "sm",
  "w-[4rem] h-[4rem]": size === "md",
  "w-[6rem] h-[6rem]": size === "lg",
  "w-[8rem] h-[8rem]": size === "xl",
}
*/
