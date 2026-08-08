import { NotificationsResponseSchema } from '@/api/contracts/notification'
import { getNotifications } from '@/api/generated/endpoints/notification-controller/notification-controller'
import { type GetNotificationsParams } from '@/api/generated/schemas/notification-controller'
import { useApiInfiniteQuery } from '@/hooks/api'
import { notificationQueryKeys } from '@/hooks/queries/notification/notificationQueryKeys'
import { mapNotificationPage } from '@/mappers/notificationMapper'

const NOTIFICATION_PAGE_SIZE = 20

function getNextPageCursor(
  lastPage: { hasNext: boolean; nextCursor: string | null },
  endpoint: string,
) {
  if (!lastPage.hasNext) return undefined
  if (lastPage.nextCursor) return lastPage.nextCursor

  console.warn(`[${endpoint}] hasNext is true but nextCursor is missing; stopping pagination.`)
  return undefined
}

export function useNotificationListQuery(size: number = NOTIFICATION_PAGE_SIZE) {
  return useApiInfiniteQuery({
    queryKey: notificationQueryKeys.list(size),
    operation: getNotifications,
    endpoint: 'getNotifications',
    responseSchema: NotificationsResponseSchema,
    response: 'requiredResult',
    getArgs: ({ pageParam }): [GetNotificationsParams] => [
      { request: { cursor: pageParam ?? undefined, size } },
    ],
    map: mapNotificationPage,
    staleTime: 0,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => getNextPageCursor(lastPage, 'getNotifications'),
  })
}
