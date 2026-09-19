import { type OAuthLoginResponseBody, OAuthLoginResponseSchema } from '@/api/contracts/auth'
import {
  loginAsGuest,
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

/** 소셜 계정 없이 매 호출마다 새 게스트 계정을 발급받는다. 항상 SIGNUP_REQUIRED로 응답한다 */
export function useGuestLoginMutation() {
  return useApiMutation({
    operation: loginAsGuest,
    endpoint: 'loginAsGuest',
    responseSchema: OAuthLoginResponseSchema,
    response: 'body',
    getArgs: (): [] => [],
  })
}

export type SocialLoginResponseBody = OAuthLoginResponseBody
