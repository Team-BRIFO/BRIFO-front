import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import NotificationItem from '@/components/feature/notification/NotificationItem'
import NotificationTabs, {
  type NotificationCategory,
} from '@/components/feature/notification/NotificationTabs'

import { NOTIFICATION_MOCK_DATA } from '@/pages/NotificationPage/mockData'

export function NotificationPage() {
  const navigate = useNavigate()

  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all')

  const filteredNotifications =
    selectedCategory === 'all'
      ? NOTIFICATION_MOCK_DATA
      : NOTIFICATION_MOCK_DATA.filter((notification) => notification.category === selectedCategory)

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex w-82 flex-col gap-3">
        <StatusBar
          className="w-full [&>div:last-child]:px-0"
          left={<StatusBarBackButton onClick={() => navigate(-1)} />}
          title="알림"
        />
        <NotificationTabs value={selectedCategory} onChange={setSelectedCategory} />

        <div className="flex flex-col gap-2">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              title={notification.title}
              description={notification.description}
              time={notification.time}
              onClick={() => {
                console.log('알림 클릭', notification.id)
              }}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
