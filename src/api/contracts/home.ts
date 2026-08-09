import { KstLocalDateTimeSchema } from '@/api/contracts/localDateTime'
import { ApiResponseGetUserHomeResponse } from '@/api/generated/schemas/user-controller'

const generatedResult = ApiResponseGetUserHomeResponse.shape.result.unwrap()
const generatedTodayNewsCards = generatedResult.shape.todayNewsCards
const generatedNewsCard = generatedTodayNewsCards.shape.items.element
const generatedNews = generatedNewsCard.shape.news

/** Home batch and news timestamps use the strict, raw KST LocalDateTime contract. */
export const UserHomeResponseSchema = ApiResponseGetUserHomeResponse.extend({
  result: generatedResult
    .extend({
      todayNewsCards: generatedTodayNewsCards.extend({
        batchTime: KstLocalDateTimeSchema.optional(),
        items: generatedNewsCard
          .extend({ news: generatedNews.extend({ publishedAt: KstLocalDateTimeSchema }) })
          .array(),
      }),
    })
    .optional(),
})
