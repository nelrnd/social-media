import NavBar from "@/app/ui/nav-bar"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NavBar />
      {children}
    </>
  )
}
