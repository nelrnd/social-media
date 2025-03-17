import Image from "next/image"

export default function ImagePreview({ src }: { src: string }) {
  return (
    <div className="w-full aspect-square relative border border-gray-100 rounded-xl overflow-hidden">
      <Image
        src={src}
        alt=""
        layout="fill"
        objectFit="contain"
        className="absolute inset-0"
      />
    </div>
  )
}
