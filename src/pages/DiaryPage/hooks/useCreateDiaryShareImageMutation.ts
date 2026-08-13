import { useCallback, useState } from 'react'

import { createDiaryShareImage } from '@/api/generated/endpoints/diary-controller/diary-controller'
import { ApiResponseCreateDiaryShareImageResponse } from '@/api/generated/schemas/diary-controller'
import { useApiMutation } from '@/hooks/api'
import { mapDiaryShareImage } from '@/mappers/diaryMapper'

export function useCreateDiaryShareImageMutation() {
  const [mutationDiaryId, setMutationDiaryId] = useState<string | null>(null)

  const {
    mutate: executeMutation,
    reset: resetMutation,
    ...mutation
  } = useApiMutation({
    operation: createDiaryShareImage,
    endpoint: 'createDiaryShareImage',
    responseSchema: ApiResponseCreateDiaryShareImageResponse,
    response: 'requiredResult',
    getArgs: (diaryId: string): [string] => [diaryId],
    map: mapDiaryShareImage,
  })

  const mutate = useCallback(
    (diaryId: string) => {
      setMutationDiaryId(diaryId)
      executeMutation(diaryId)
    },
    [executeMutation],
  )

  const reset = useCallback(() => {
    setMutationDiaryId(null)
    resetMutation()
  }, [resetMutation])

  return { ...mutation, mutate, reset, mutationDiaryId }
}
