import { describe, expect, it } from 'vitest'

import { createAxiosAdapter } from '@/__tests__/api/testAxiosAdapter'
import { NotificationsResponseSchema } from '@/api/contracts/notification'
import { getNotifications } from '@/api/generated/endpoints/notification-controller/notification-controller'
import { executeGeneratedApiOperation } from '@/hooks/api'
import { mapNotificationPage } from '@/mappers/notificationMapper'

function notificationsResponse() {
  return {
    success: true,
    code: 'COMMON_200',
    message: '요청에 성공했습니다.',
    result: {
      page: {
        items: [
          {
            notificationId: '019fd537-93a1-7bbb-8850-af72451ba9ad',
            code: 'ATTENDANCE_REWARDED',
            title: '출석 보너스 +50 AP',
            body: '1일 연속 출석 중이에요. 내일도 만나요!',
            createdAt: '2026-08-06T03:56:57.113442',
            target: { type: 'NONE' },
          },
        ],
        hasNext: false,
      },
    },
  }
}

describe('Notification API integration', () => {
  it('validates offset-less createdAt and maps the original response string', async () => {
    const adapter = createAxiosAdapter(() => ({ data: notificationsResponse() }))

    const page = await executeGeneratedApiOperation({
      operation: getNotifications,
      endpoint: 'getNotifications',
      args: [{ request: { size: 20 } }],
      responseSchema: NotificationsResponseSchema,
      response: 'requiredResult',
      requestConfig: { adapter },
      map: mapNotificationPage,
    })

    expect(page).toMatchObject({
      notifications: [
        {
          id: '019fd537-93a1-7bbb-8850-af72451ba9ad',
          code: 'ATTENDANCE_REWARDED',
          title: '출석 보너스 +50 AP',
          description: '1일 연속 출석 중이에요. 내일도 만나요!',
          category: 'system',
          createdAt: '2026-08-06T03:56:57.113442',
        },
      ],
      nextCursor: null,
      hasNext: false,
    })
  })
})
