import Link from "next/link"
import LoginForm from "../ui/login-form"

export default function LoginPage() {
  return (
    <main>
      <div className="max-w-[50rem] m-auto p-4">
        <LoginForm />
        <p>
          You don't have an account yet?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  )
}
