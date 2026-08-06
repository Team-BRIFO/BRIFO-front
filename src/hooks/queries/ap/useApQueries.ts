import { useQueryClient } from '@tanstack/react-query'

import {
  createAttendanceReward,
  createCreditLoan,
} from '@/api/generated/endpoints/ap-controller/ap-controller'
import {
  ApiResponseApBalanceResponse,
  ApiResponseCreateAttendanceRewardResponse,
} from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'

export function useCreateCreditLoanMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: createCreditLoan,
    endpoint: 'createCreditLoan',
    responseSchema: ApiResponseApBalanceResponse,
    response: 'requiredResult',
    getArgs: (params: { agentId: string }) => [params] as const,
    onSuccess: async () => {
      // 대출 성공 시 유저 프로필(잔액) 정보 갱신
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() })
    },
  })
}

export function useCreateAttendanceRewardMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: createAttendanceReward,
    endpoint: 'createAttendanceReward',
    responseSchema: ApiResponseCreateAttendanceRewardResponse,
    response: 'requiredResult',
    getArgs: () => [] as const,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.home() })
    },
  })
}
