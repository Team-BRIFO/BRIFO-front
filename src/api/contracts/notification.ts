import { KstLocalDateTimeSchema } from '@/api/contracts/localDateTime'
import { ApiResponseGetNotificationsResponse } from '@/api/generated/schemas/notification-controller'

const generatedResult = ApiResponseGetNotificationsResponse.shape.result.unwrap()
const generatedPage = generatedResult.shape.page
const generatedItem = generatedPage.shape.items.element

/** Notification `createdAt` values use the strict, raw KST LocalDateTime contract. */
export const NotificationsResponseSchema = ApiResponseGetNotificationsResponse.extend({
  result: generatedResult
    .extend({
      page: generatedPage.extend({
        items: generatedItem.extend({ createdAt: KstLocalDateTimeSchema }).array(),
      }),
    })
    .optional(),
})
