import type { NotificationCategory } from '@/components/feature/notification/NotificationTabs'

export type NotificationTargetType =
  | 'DECISION'
  | 'BRIEFING'
  | 'BADGE'
  | 'AGENT'
  | 'STOCK_BRIEFINGS'
  | 'NEWS_CARD_LIST'
  | 'NONE'

export interface NotificationTarget {
  type: NotificationTargetType
  targetId: string | null
}

export interface Notification {
  id: string
  code: string
  category: Exclude<NotificationCategory, 'all'>
  title: string
  description: string
  time: string
  createdAt: string
  target: NotificationTarget
}

export interface NotificationPage {
  notifications: Notification[]
  nextCursor: string | null
  hasNext: boolean
}
