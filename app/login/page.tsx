import Link from "next/link"
import LoginForm from "../ui/login-form"

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
      <p>
        You don't have an account yet? <Link href="/register">Register</Link>
      </p>
    </main>
  )
}
