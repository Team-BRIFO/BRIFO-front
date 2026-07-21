export type NotificationCategory = 'all' | 'settlement' | 'employee' | 'system'

interface NotificationTabsProps {
  value: NotificationCategory
  onChange: (value: NotificationCategory) => void
}

const TAB_ITEMS: {
  value: NotificationCategory
  label: string
}[] = [
  { value: 'all', label: '전체' },
  { value: 'settlement', label: '정산' },
  { value: 'employee', label: '사원' },
  { value: 'system', label: '시스템' },
]

export default function NotificationTabs({ value, onChange }: NotificationTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="알림 카테고리"
      className="bg-Gray-1 flex h-6 w-full items-center rounded-full"
    >
      {TAB_ITEMS.map((tab) => {
        const isActive = value === tab.value

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={`pretendard-Caption1 flex h-full flex-1 items-center justify-center rounded-full transition-colors ${
              isActive ? 'bg-Yellow-40 text-white' : 'text-Gray-6'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
