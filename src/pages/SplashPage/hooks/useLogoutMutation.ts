import { logout } from '@/api/generated/endpoints/auth-controller/auth-controller'
import { ApiResponse } from '@/api/generated/schemas'
import type { RefreshTokenRequest } from '@/api/generated/schemas/auth-controller'
import { useApiMutation } from '@/hooks/api'

export function useLogoutMutation() {
  return useApiMutation({
    operation: logout,
    endpoint: 'logout',
    responseSchema: ApiResponse,
    getArgs: (request: RefreshTokenRequest) => [request] as [RefreshTokenRequest],
  })
}
