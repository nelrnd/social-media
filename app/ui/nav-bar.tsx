import { spaceMono } from "../fonts"

export default async function NavBar() {
  return (
    <div>
      <nav className="max-w-[50rem] m-auto p-4">
        <div
          className={`text-2xl font-bold select-none ${spaceMono.className}`}
        >
          AHSI
        </div>
      </nav>
    </div>
  )
}
