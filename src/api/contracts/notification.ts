import { z } from 'zod'

import { ApiResponseGetNotificationsResponse } from '@/api/generated/schemas/notification-controller'

const KOREA_STANDARD_TIME_OFFSET = '+09:00'
const LOCAL_DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeLocalDateTime(value: unknown) {
  if (typeof value !== 'string' || !LOCAL_DATE_TIME_PATTERN.test(value)) return value

  return `${value}${KOREA_STANDARD_TIME_OFFSET}`
}

/**
 * 백엔드는 알림 시각을 Asia/Seoul 기준의 offset 없는 LocalDateTime으로 반환한다.
 * generated OpenAPI schema가 요구하는 RFC 3339 datetime으로 정규화한 뒤 검증한다.
 */
function normalizeNotificationDateTimes(response: unknown): unknown {
  if (!isRecord(response)) return response

  const result = response.result
  if (!isRecord(result)) return response

  const page = result.page
  if (!isRecord(page)) return response
  if (!Array.isArray(page.items)) return response

  return {
    ...response,
    result: {
      ...result,
      page: {
        ...page,
        items: page.items.map((item) =>
          isRecord(item) ? { ...item, createdAt: normalizeLocalDateTime(item.createdAt) } : item,
        ),
      },
    },
  }
}

export const NotificationsResponseSchema = z.preprocess(
  normalizeNotificationDateTimes,
  ApiResponseGetNotificationsResponse,
)
