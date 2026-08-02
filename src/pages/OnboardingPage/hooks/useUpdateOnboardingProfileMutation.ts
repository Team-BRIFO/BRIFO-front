import { updateOnboardingProfile } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponse, type UpdateOnboardingProfileRequest } from '@/api/generated/schemas'
import { getSignupToken } from '@/auth/oauth'
import { useApiMutation } from '@/hooks/api'

export function useUpdateOnboardingProfileMutation() {
  const signupToken = getSignupToken()

  return useApiMutation({
    operation: updateOnboardingProfile,
    endpoint: 'updateOnboardingProfile',
    responseSchema: ApiResponse,
    getArgs: (request: UpdateOnboardingProfileRequest): [UpdateOnboardingProfileRequest] => [
      request,
    ],
    requestConfig: signupToken
      ? { headers: { Authorization: `Bearer ${signupToken}` } }
      : undefined,
  })
}
