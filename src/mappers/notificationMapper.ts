import { getKstLocalDateTimeTimestamp, KstLocalDateTimeSchema } from '@/api/contracts/localDateTime'
import type { NotificationItemOutput } from '@/api/generated/schemas/notification-controller'
import type { GetNotificationsResponseOutput } from '@/api/generated/schemas/notification-controller'
import type { NotificationCategory } from '@/components/feature/notification/NotificationTabs'
import { PATH } from '@/routes/paths'
import type {
  Notification,
  NotificationPage,
  NotificationTarget,
  NotificationTargetType,
} from '@/types/domain/notification'

const CATEGORY_BY_TARGET_TYPE: Record<
  NotificationTargetType,
  Exclude<NotificationCategory, 'all'>
> = {
  DECISION: 'settlement',
  AGENT: 'employee',
  BRIEFING: 'employee',
  BADGE: 'system',
  STOCK_BRIEFINGS: 'system',
  NEWS_CARD_LIST: 'system',
  NONE: 'system',
}

export function formatNotificationRelativeTime(isoDate: string) {
  const parsedDate = KstLocalDateTimeSchema.safeParse(isoDate)

  if (!parsedDate.success) return isoDate.slice(0, 10)

  const createdAt = getKstLocalDateTimeTimestamp(parsedDate.data)
  const diffMinutes = Math.floor((Date.now() - createdAt) / 60_000)

  if (diffMinutes < 1) return '방금 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}시간 전`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}일 전`

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(parsedDate.data)
  if (match) return `${match[2]}.${match[3]}`

  return isoDate.slice(0, 10)
}

function mapNotificationTarget(target: NotificationItemOutput['target']): NotificationTarget {
  return {
    type: target.type,
    targetId: target.targetId ?? null,
  }
}

export function mapNotification(item: NotificationItemOutput): Notification {
  const target = mapNotificationTarget(item.target)

  return {
    id: item.notificationId,
    code: item.code,
    category: CATEGORY_BY_TARGET_TYPE[target.type],
    title: item.title,
    description: item.body ?? '',
    time: formatNotificationRelativeTime(item.createdAt),
    createdAt: item.createdAt,
    target,
  }
}

export function mapNotificationPage(result: GetNotificationsResponseOutput): NotificationPage {
  return {
    notifications: result.page.items.map(mapNotification),
    nextCursor: result.page.nextCursor ?? null,
    hasNext: result.page.hasNext,
  }
}

export function getNotificationNavigationPath(notification: Notification) {
  const { type, targetId } = notification.target

  switch (type) {
    case 'DECISION':
      return targetId ? PATH.DIARY_DETAIL(targetId) : PATH.DIARY
    case 'BRIEFING':
      return targetId ? PATH.BRIEFING_DETAIL(targetId) : PATH.OFFICE
    case 'BADGE':
      return PATH.MY_BADGES
    case 'AGENT':
      return targetId ? PATH.TEAM_DETAIL(targetId) : PATH.TEAM
    case 'STOCK_BRIEFINGS':
      return PATH.OFFICE
    case 'NEWS_CARD_LIST':
      return targetId ? PATH.CARD_NEWS_DETAIL(targetId) : PATH.HOME
    case 'NONE':
      return null
  }
}
