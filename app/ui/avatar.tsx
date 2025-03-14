import clsx from "clsx"

export default function Avatar({
  src,
  size = "md",
}: {
  src: string
  size: string
}) {
  return (
    <div
      className={clsx("rounded-full bg-black", {
        "w-[2rem] h-[2rem]": size === "sm",
        "w-[4rem] h-[4rem]": size === "md",
        "w-[8rem] h-[8rem]": size === "lg",
      })}
    ></div>
  )
}

Avatar.defaultProps = {
  size: "md",
}
