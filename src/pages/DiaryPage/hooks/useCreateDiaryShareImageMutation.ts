import { useQueryClient } from '@tanstack/react-query'

import { createDiaryShareImage } from '@/api/generated/endpoints/diary-controller/diary-controller'
import { ApiResponseCreateDiaryShareImageResponse } from '@/api/generated/schemas/diary-controller'
import { useApiMutation } from '@/hooks/api'
import { diaryQueryKeys } from '@/hooks/queries/diary/diaryQueryKeys'
import { mapDiaryShareImage } from '@/mappers/diaryMapper'
import type { DiaryDetail } from '@/types/domain/diary'

export function useCreateDiaryShareImageMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: createDiaryShareImage,
    endpoint: 'createDiaryShareImage',
    responseSchema: ApiResponseCreateDiaryShareImageResponse,
    response: 'requiredResult',
    getArgs: (diaryId: string): [string] => [diaryId],
    map: mapDiaryShareImage,
    onSuccess: (result, diaryId) => {
      queryClient.setQueryData<DiaryDetail>(diaryQueryKeys.detail(diaryId), (previous) =>
        previous ? { ...previous, shareImageUrl: result.shareImageUrl } : previous,
      )
    },
  })
}
