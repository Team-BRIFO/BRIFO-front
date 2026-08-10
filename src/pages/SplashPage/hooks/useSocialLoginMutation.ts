import { type OAuthLoginResponseBody, OAuthLoginResponseSchema } from '@/api/contracts/auth'
import {
  loginWithKakao,
  loginWithNaver,
} from '@/api/generated/endpoints/auth-controller/auth-controller'
import {
  type KakaoLoginRequest,
  type NaverLoginRequest,
} from '@/api/generated/schemas/auth-controller'
import { useApiMutation } from '@/hooks/api'

export function useKakaoLoginMutation() {
  return useApiMutation({
    operation: loginWithKakao,
    endpoint: 'loginWithKakao',
    responseSchema: OAuthLoginResponseSchema,
    response: 'body',
    getArgs: (request: KakaoLoginRequest) => [request] as [KakaoLoginRequest],
  })
}

export function useNaverLoginMutation() {
  return useApiMutation({
    operation: loginWithNaver,
    endpoint: 'loginWithNaver',
    responseSchema: OAuthLoginResponseSchema,
    response: 'body',
    getArgs: (request: NaverLoginRequest) => [request] as [NaverLoginRequest],
  })
}

export type SocialLoginResponseBody = OAuthLoginResponseBody
