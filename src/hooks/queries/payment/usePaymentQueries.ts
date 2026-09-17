import { useQueryClient } from '@tanstack/react-query'

import { confirm, ready } from '@/api/generated/endpoints/payment-controller/payment-controller'
import {
  ApiResponseApBalanceResponse,
  ApiResponseReadyPaymentResponse,
} from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'

export function useReadyPaymentMutation() {
  return useApiMutation({
    operation: ready,
    endpoint: 'ready',
    responseSchema: ApiResponseReadyPaymentResponse,
    response: 'requiredResult',
    getArgs: (params: { amount: number }) => [params] as const,
  })
}

export function useConfirmPaymentMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: confirm,
    endpoint: 'confirm',
    responseSchema: ApiResponseApBalanceResponse,
    response: 'requiredResult',
    getArgs: (params: { paymentKey: string; orderId: string; amount: number }) => [params] as const,
    onSuccess: async () => {
      // 충전 성공 시 유저 프로필(잔액) 정보 갱신
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() })
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.home() })
    },
  })
}
