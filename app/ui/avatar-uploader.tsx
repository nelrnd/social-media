import Avatar from "./avatar"

export default function AvatarUploader({
  initialImage,
}: {
  initialImage?: string
}) {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        id="image"
        name="image"
        className="hidden"
      />
      <label htmlFor="image" className="rounded-full">
        <Avatar src={initialImage} size="lg" />
      </label>
    </div>
  )
}
