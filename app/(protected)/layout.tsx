import SideBar from "../ui/side-bar"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-[auto_1fr]">
      <SideBar />
      {children}
    </div>
  )
}
