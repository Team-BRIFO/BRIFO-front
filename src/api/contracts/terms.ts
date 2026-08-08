import { KstLocalDateTimeSchema } from '@/api/contracts/localDateTime'
import { ApiResponseGetMyTermsResponse } from '@/api/generated/schemas/term-controller'

const generatedResult = ApiResponseGetMyTermsResponse.shape.result.unwrap()
const generatedPage = generatedResult.shape.page

/** My glossary `learnedAt` values use the strict, raw KST LocalDateTime contract. */
export const MyTermsResponseSchema = ApiResponseGetMyTermsResponse.extend({
  result: generatedResult
    .extend({
      page: generatedPage.extend({
        items: generatedPage.shape.items.element
          .extend({ learnedAt: KstLocalDateTimeSchema })
          .array(),
      }),
    })
    .optional(),
})
