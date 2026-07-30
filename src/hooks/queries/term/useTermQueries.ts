import { useQueryClient } from '@tanstack/react-query'

import { browserTokenStore } from '@/api/client/tokenStore'
import { getTerm, saveTerm } from '@/api/generated/endpoints/term-controller/term-controller'
import { ApiResponse } from '@/api/generated/schemas'
import { ApiResponseGetTermResponse } from '@/api/generated/schemas/term-controller'
import { useApiMutation, useApiQuery } from '@/hooks/api'
import { termQueryKeys } from '@/hooks/queries/term/termQueryKeys'
import { mapTermDetail } from '@/mappers/termMapper'

// Fallback Mock Data for getTerm
const mockGetTerm = async (termId: string) => {
  const MOCK_DATA: ApiResponseGetTermResponse = {
    success: true,
    code: 'COMMON_200',
    message: '요청에 성공했습니다.',
    result: {
      termId,
      term: '임시 용어',
      definition: '공통 axios 인스턴스 연동 전 표시되는 임시 데이터입니다.',
      category: '임시 카테고리',
      isLearned: false,
    },
  }

  if (!browserTokenStore.getAccessToken()) {
    return MOCK_DATA
  }

  try {
    return await getTerm(termId)
  } catch {
    return MOCK_DATA
  }
}

export function useGetTermDetail(termId: string | null) {
  return useApiQuery({
    queryKey: termQueryKeys.detail(termId ?? ''),
    operation: mockGetTerm as typeof getTerm,
    endpoint: 'getTerm',
    args: [termId ?? ''],
    responseSchema: ApiResponseGetTermResponse,
    response: 'requiredResult',
    map: (result) => mapTermDetail(result),
    enabled: Boolean(termId),
    staleTime: 0,
  })
}

export function usePutMyTerm() {
  const queryClient = useQueryClient()

  const mockSaveTerm = async (termId: string) => {
    const MOCK_DATA: ApiResponse = {
      success: true,
      code: 'COMMON_200',
      message: '성공',
    }

    if (!browserTokenStore.getAccessToken()) {
      return MOCK_DATA
    }

    try {
      return await saveTerm(termId)
    } catch {
      return MOCK_DATA
    }
  }

  return useApiMutation({
    operation: mockSaveTerm as typeof saveTerm,
    endpoint: 'saveTerm',
    responseSchema: ApiResponse,
    response: 'body',
    getArgs: (termId: string) => [termId] as const,
    onSuccess: (_, termId) => {
      // Invalidate the specific term detail and the learned terms list
      void queryClient.invalidateQueries({
        queryKey: termQueryKeys.detail(termId),
      })
      void queryClient.invalidateQueries({
        queryKey: termQueryKeys.all, // or myTerms specific key if needed
      })
    },
  })
}
