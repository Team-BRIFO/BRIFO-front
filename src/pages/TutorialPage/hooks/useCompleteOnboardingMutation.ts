import { completeOnboarding } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponseCompleteOnboardingResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'

export function useCompleteOnboardingMutation() {
  return useApiMutation({
    operation: completeOnboarding,
    endpoint: 'completeOnboarding',
    responseSchema: ApiResponseCompleteOnboardingResponse,
    response: 'requiredResult',
    getArgs: (): [] => [],
  })
}
