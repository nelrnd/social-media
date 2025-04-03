import { Metadata } from "next"
import SocialLogin from "../ui/social-login"
import JoinForm from "../ui/join-form"

export const metadata: Metadata = {
  title: "Join today",
}

export default function JoinPage() {
  return (
    <main>
      <div className="max-w-[32rem] m-auto p-4 pt-6 space-y-6">
        <h1 className="text-xl font-bold">Join today</h1>
        <JoinForm />
        <SocialLogin />
      </div>
    </main>
  )
}
