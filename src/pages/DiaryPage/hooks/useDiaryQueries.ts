import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import {
  DIARY_PAGE_SIZE,
  getDiaries,
  getDiaryCalendar,
  getDiaryDetail,
  getDiaryStats,
} from '@/api/diary'
import {
  mapDiaryCalendar,
  mapDiaryDetail,
  mapDiaryEntryPage,
  mapDiaryStatistics,
} from '@/mappers/diaryMapper'

import { diaryQueryKeys } from './diaryQueryKeys'

export function useDiaryCalendarQuery(year: number, month: number, enabled: boolean = true) {
  return useQuery({
    queryKey: diaryQueryKeys.calendar(year, month),
    staleTime: 0,
    queryFn: async () => mapDiaryCalendar(await getDiaryCalendar(year, month)),
    enabled,
  })
}

export function useDiaryListQuery(size: number = DIARY_PAGE_SIZE, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: diaryQueryKeys.list(size),
    staleTime: 0,
    queryFn: async ({ pageParam }) => mapDiaryEntryPage(await getDiaries(pageParam, size)),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled,
  })
}

export function useDiaryDetailQuery(diaryId: string | null) {
  return useQuery({
    queryKey: diaryQueryKeys.detail(diaryId ?? ''),
    staleTime: 0,
    queryFn: async () => mapDiaryDetail(await getDiaryDetail(diaryId!)),
    enabled: Boolean(diaryId),
  })
}

export function useDiaryStatisticsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: diaryQueryKeys.stats(),
    staleTime: 0,
    queryFn: async () => mapDiaryStatistics(await getDiaryStats()),
    enabled,
  })
}
