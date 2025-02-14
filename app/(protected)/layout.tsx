import SideBar from "../ui/side-bar"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <SideBar />
      <div className="max-w-[36rem] m-auto border-r border-l border-gray-200 min-h-screen">
        {children}
      </div>
    </div>
  )
}
