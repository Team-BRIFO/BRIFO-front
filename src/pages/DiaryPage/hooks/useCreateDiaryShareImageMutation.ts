import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createDiaryShareImage } from '@/api/diary'
import { mapDiaryShareImage } from '@/mappers/diaryMapper'
import type { DiaryDetail } from '@/types/domain/diary'

import { diaryQueryKeys } from './diaryQueryKeys'

export function useCreateDiaryShareImageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (diaryId: string) => mapDiaryShareImage(await createDiaryShareImage(diaryId)),
    onSuccess: (result, diaryId) => {
      queryClient.setQueryData<DiaryDetail>(diaryQueryKeys.detail(diaryId), (previous) =>
        previous ? { ...previous, shareImageUrl: result.shareImageUrl } : previous,
      )
    },
  })
}
