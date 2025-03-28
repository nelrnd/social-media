import { getDate } from "@/app/lib/utils"

export default function Date({ date }: { date: Date }) {
  return (
    <time
      className="text-soft text-sm relative z-10"
      dateTime={date.toString()}
      title={date.toString()}
    >
      {getDate(date)}
    </time>
  )
}
