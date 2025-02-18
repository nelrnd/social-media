import { signIn } from "@/auth"

export default function SocialLogin() {
  return (
    <div className="space-y-2">
      <div className="relative select-none">
        <div className="text-gray-600 w-fit bg-white px-4 m-auto">or</div>
        <div className="h-[1px] w-full bg-gray-200 absolute top-1/2 -z-10"></div>
      </div>

      <form
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <button
          type="submit"
          className="block w-full p-2 border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          Sign in with Google
        </button>
      </form>

      <form
        action={async () => {
          "use server"
          await signIn("github")
        }}
      >
        <button
          type="submit"
          className="block w-full p-2 border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          Sign in with GitHub
        </button>
      </form>
    </div>
  )
}
