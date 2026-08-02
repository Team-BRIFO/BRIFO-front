import { completeOnboarding } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponseCompleteOnboardingResponse } from '@/api/generated/schemas'
import { getSignupToken } from '@/auth/oauth'
import { useApiMutation } from '@/hooks/api'

export function useCompleteOnboardingMutation() {
  const signupToken = getSignupToken()

  return useApiMutation({
    operation: completeOnboarding,
    endpoint: 'completeOnboarding',
    responseSchema: ApiResponseCompleteOnboardingResponse,
    response: 'requiredResult',
    getArgs: (): [] => [],
    requestConfig: signupToken
      ? { headers: { Authorization: `Bearer ${signupToken}` } }
      : undefined,
  })
}
