import { signupTokenStore } from '@/api/client/tokenStore'
import { completeOnboarding } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponseCompleteOnboardingResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'

export function useCompleteOnboardingMutation() {
  const signupToken = signupTokenStore.get()

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
