import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import NotificationListSection from '@/components/feature/notification/NotificationListSection'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { getNotificationNavigationPath } from '@/mappers/notificationMapper'
import { useNotificationListQuery } from '@/pages/NotificationPage/hooks/useNotificationQueries'

export function NotificationPage() {
  const navigate = useNavigate()
  const query = useNotificationListQuery()

  const notifications = useMemo(() => {
    if (!query.data) return []

    return query.data.pages.flatMap((page) => page.notifications)
  }, [query.data])
  const handleSelectNotification = useCallback(
    (notification: (typeof notifications)[number]) => {
      const path = getNotificationNavigationPath(notification)
      if (path) navigate(path)
    },
    [navigate],
  )
  const handleLoadMore = useCallback(() => {
    void query.fetchNextPage()
  }, [query])

  if (!!query.error && query.fetchStatus === 'idle' && !query.data) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex w-full flex-col gap-3 px-4">
          <StatusBar
            hasStatusArea={false}
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
            hasStatusArea={false}
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
          hasStatusArea={false}
          className="w-full [&>div:last-child]:px-0"
          left={<StatusBarBackButton onClick={() => navigate(-1)} />}
          title="알림"
        />
        <NotificationListSection
          notifications={notifications}
          hasNext={query.hasNextPage}
          isLoadingMore={query.isFetchingNextPage}
          loadMoreError={query.isFetchNextPageError}
          onLoadMore={handleLoadMore}
          onSelectNotification={handleSelectNotification}
        />
      </div>
    </main>
  )
}
