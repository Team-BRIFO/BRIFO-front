import { memo, useCallback, useMemo, useState } from 'react'

import NotificationItem from '@/components/feature/notification/NotificationItem'
import NotificationTabs, {
  type NotificationCategory,
} from '@/components/feature/notification/NotificationTabs'
import type { Notification } from '@/types/domain/notification'

interface NotificationListSectionProps {
  notifications: Notification[]
  hasNext: boolean
  isLoadingMore: boolean
  loadMoreError: boolean
  onLoadMore: () => void
  onSelectNotification: (notification: Notification) => void
}

interface NotificationListItemProps {
  notification: Notification
  onSelectNotification: (notification: Notification) => void
}

const NotificationListItem = memo(function NotificationListItem({
  notification,
  onSelectNotification,
}: NotificationListItemProps) {
  const handleClick = useCallback(() => {
    onSelectNotification(notification)
  }, [notification, onSelectNotification])

  return (
    <NotificationItem
      title={notification.title}
      description={notification.description}
      time={notification.time}
      onClick={handleClick}
    />
  )
})

/** 알림 탭 선택과 필터링을 관리하는 본문 영역. */
export default function NotificationListSection({
  notifications,
  hasNext,
  isLoadingMore,
  loadMoreError,
  onLoadMore,
  onSelectNotification,
}: NotificationListSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all')
  const filteredNotifications = useMemo(() => {
    if (selectedCategory === 'all') return notifications

    return notifications.filter((notification) => notification.category === selectedCategory)
  }, [notifications, selectedCategory])

  return (
    <>
      <NotificationTabs value={selectedCategory} onChange={setSelectedCategory} />

      <div className="flex flex-col gap-2">
        {filteredNotifications.length === 0 ? (
          <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
            {hasNext
              ? '아직 불러온 알림에는 해당 항목이 없어요. 더 보기를 눌러 추가 알림을 확인해주세요.'
              : '알림이 없어요.'}
          </p>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              onSelectNotification={onSelectNotification}
            />
          ))
        )}

        {hasNext && (
          <div className="flex flex-col gap-2">
            {loadMoreError && (
              <p role="alert" className="pretendard-Caption2 text-Pink-30 text-center">
                추가 알림을 불러오지 못했어요.
              </p>
            )}
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="pretendard-Button2 text-Gray-6 focus-visible:ring-Yellow-45 rounded-lg py-3 focus-visible:ring-2 focus-visible:outline-hidden disabled:opacity-50"
            >
              {isLoadingMore ? '불러오는 중…' : loadMoreError ? '다시 시도' : '더 보기'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
