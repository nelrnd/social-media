export default function PageHeader({ title }: { title: string }) {
  return (
    <header className="p-4 border-b border-gray-200">
      <div className="font-semibold text-xl">{title}</div>
    </header>
  )
}
