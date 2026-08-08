import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import NotificationItem from '@/components/feature/notification/NotificationItem'
import NotificationTabs, {
  type NotificationCategory,
} from '@/components/feature/notification/NotificationTabs'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { getNotificationNavigationPath } from '@/mappers/notificationMapper'
import { useNotificationListQuery } from '@/pages/NotificationPage/hooks/useNotificationQueries'

export function NotificationPage() {
  const navigate = useNavigate()
  const query = useNotificationListQuery()
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all')

  const notifications = useMemo(() => {
    if (!query.data) return []

    const all = query.data.pages.flatMap((page) => page.notifications)
    if (selectedCategory === 'all') return all

    return all.filter((notification) => notification.category === selectedCategory)
  }, [query.data, selectedCategory])

  if (!!query.error && query.fetchStatus === 'idle' && !query.data) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex w-full flex-col gap-3 px-4">
          <StatusBar
            className="w-full [&>div:last-child]:px-0"
            left={<StatusBarBackButton onClick={() => navigate(-1)} />}
            title="알림"
          />
          <PageErrorView
            title="알림을 불러오지 못했어요."
            error={query.error}
            onRetry={() => query.refetch()}
          />
        </div>
      </main>
    )
  }

  if (!query.data) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex w-full flex-col gap-3 px-4">
          <StatusBar
            className="w-full [&>div:last-child]:px-0"
            left={<StatusBarBackButton onClick={() => navigate(-1)} />}
            title="알림"
          />
          <PageLoadingView />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="flex w-full flex-col gap-3 px-4">
        <StatusBar
          className="w-full [&>div:last-child]:px-0"
          left={<StatusBarBackButton onClick={() => navigate(-1)} />}
          title="알림"
        />
        <NotificationTabs value={selectedCategory} onChange={setSelectedCategory} />

        <div className="flex flex-col gap-2">
          {notifications.length === 0 ? (
            <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
              {query.hasNextPage
                ? '아직 불러온 알림에는 해당 항목이 없어요. 더 보기를 눌러 추가 알림을 확인해주세요.'
                : '알림이 없어요.'}
            </p>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                title={notification.title}
                description={notification.description}
                time={notification.time}
                onClick={() => {
                  const path = getNotificationNavigationPath(notification)
                  if (path) navigate(path)
                }}
              />
            ))
          )}

          {query.hasNextPage && (
            <button
              type="button"
              onClick={() => query.fetchNextPage()}
              disabled={query.isFetchingNextPage}
              className="pretendard-Button2 text-Gray-6 focus-visible:ring-Yellow-45 rounded-lg py-3 focus-visible:ring-2 focus-visible:outline-hidden disabled:opacity-50"
            >
              {query.isFetchingNextPage ? '불러오는 중…' : '더 보기'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
