import { Tabs } from '@/components/common/Tabs'

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
    <Tabs
      value={value}
      onChange={(val) => onChange(val as NotificationCategory)}
      items={TAB_ITEMS}
      variant="segmented"
      segmentedType={2}
      isFullWidth
      ariaLabel="알림 카테고리"
    />
  )
}
