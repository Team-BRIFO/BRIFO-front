import { KstLocalDateTimeSchema } from '@/api/contracts/localDateTime'
import { ApiResponseGetApTransactionsResponse } from '@/api/generated/schemas/ap-controller'

const generatedResult = ApiResponseGetApTransactionsResponse.shape.result.unwrap()
const generatedPage = generatedResult.shape.page
const generatedItem = generatedPage.shape.items.element

/** AP transaction timestamps use the strict, raw KST LocalDateTime contract. */
export const ApTransactionsResponseSchema = ApiResponseGetApTransactionsResponse.extend({
  result: generatedResult
    .extend({
      page: generatedPage.extend({
        items: generatedItem.extend({ createdAt: KstLocalDateTimeSchema }).array(),
      }),
    })
    .optional(),
})
