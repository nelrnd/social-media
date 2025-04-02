import Link from "next/link"

export default function NotFound({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh flex flex-col justify-center items-center gap-2">
      <h2 className="text-2xl">404 Not Found</h2>
      <p>{children}</p>
      <Link
        href="/"
        className="w-fit h-[3.125rem] mt-3 py-3 px-6 flex items-center gap-4 justify-center  disabled:opacity-50 transition-all rounded-sm relative press text-background dark:text-foreground bg-accent hover:bg-accent-variant"
      >
        Go home
      </Link>
    </main>
  )
}
