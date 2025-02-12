import { auth, signOut } from "@/auth"
import Link from "next/link"

export default async function NavBar() {
  const session = await auth()
  const isLoggedIn = session?.user

  return (
    <div>
      <nav>
        <Link href="/">
          <div>AHSI</div>
        </Link>

        {!isLoggedIn ? (
          <Link href="/login">Log in</Link>
        ) : (
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <button>Log out</button>
          </form>
        )}
      </nav>
    </div>
  )
}
