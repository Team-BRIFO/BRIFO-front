import { KstLocalDateTimeSchema } from '@/api/contracts/localDateTime'
import { ApiResponseGetPolicyDetailResponse } from '@/api/generated/schemas/policy-controller'

const generatedResult = ApiResponseGetPolicyDetailResponse.shape.result.unwrap()

/** Policy `createdAt` values use the strict, raw KST LocalDateTime contract. */
export const PolicyDetailResponseSchema = ApiResponseGetPolicyDetailResponse.extend({
  result: generatedResult.extend({ createdAt: KstLocalDateTimeSchema }).optional(),
})
