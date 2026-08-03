import {
  loginWithKakao,
  loginWithNaver,
} from '@/api/generated/endpoints/auth-controller/auth-controller'
import {
  ApiResponseOAuthLoginResponse,
  type KakaoLoginRequest,
  type NaverLoginRequest,
} from '@/api/generated/schemas/auth-controller'
import { useApiMutation } from '@/hooks/api'

export function useKakaoLoginMutation() {
  return useApiMutation({
    operation: loginWithKakao,
    endpoint: 'loginWithKakao',
    responseSchema: ApiResponseOAuthLoginResponse,
    response: 'requiredResult',
    getArgs: (request: KakaoLoginRequest) => [request] as [KakaoLoginRequest],
  })
}

export function useNaverLoginMutation() {
  return useApiMutation({
    operation: loginWithNaver,
    endpoint: 'loginWithNaver',
    responseSchema: ApiResponseOAuthLoginResponse,
    response: 'requiredResult',
    getArgs: (request: NaverLoginRequest) => [request] as [NaverLoginRequest],
  })
}
