import NotificationIcon from '@/assets/images/notification_face.svg?react'

interface NotificationItemProps {
  title: string
  description: string
  time: string
  onClick?: () => void
}

export default function NotificationItem({
  title,
  description,
  time,
  onClick,
}: NotificationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-Gray-2 } flex w-full items-start gap-3 rounded-lg border bg-white p-3 text-left"
    >
      <NotificationIcon className="h-10 w-10 shrink-0" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="pretendard-Body2-Semibold text-Gray-10 truncate">{title}</p>

          <span className="pretendard-Caption3 text-Gray-4 shrink-0">{time}</span>
        </div>

        <p className="pretendard-Caption3 mt-1 truncate text-[#6C6D6F]">{description}</p>
      </div>
    </button>
  )
}
