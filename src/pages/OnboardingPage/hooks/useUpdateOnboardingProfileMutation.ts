import { updateOnboardingProfile } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponse, type UpdateOnboardingProfileRequest } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'

export function useUpdateOnboardingProfileMutation() {
  return useApiMutation({
    operation: updateOnboardingProfile,
    endpoint: 'updateOnboardingProfile',
    responseSchema: ApiResponse,
    getArgs: (request: UpdateOnboardingProfileRequest): [UpdateOnboardingProfileRequest] => [
      request,
    ],
  })
}
