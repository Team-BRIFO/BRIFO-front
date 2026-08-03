import { createTutorialReward } from '@/api/generated/endpoints/ap-controller/ap-controller'
import { ApiResponseApBalanceResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'

export function useCreateTutorialRewardMutation() {
  return useApiMutation({
    operation: createTutorialReward,
    endpoint: 'createTutorialReward',
    responseSchema: ApiResponseApBalanceResponse,
    response: 'requiredResult',
    getArgs: (): [] => [],
  })
}
