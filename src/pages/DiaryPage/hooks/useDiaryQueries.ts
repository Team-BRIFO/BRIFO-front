import {
  getDiaries,
  getDiaryCalendar,
  getDiaryDetail,
  getDiaryStats,
} from '@/api/generated/endpoints/diary-controller/diary-controller'
import {
  ApiResponseGetDiariesResponse,
  ApiResponseGetDiaryCalendarResponse,
  ApiResponseGetDiaryDetailResponse,
  ApiResponseGetDiaryStatsResponse,
  type GetDiariesParams,
} from '@/api/generated/schemas/diary-controller'
import { useApiInfiniteQuery, useApiQuery } from '@/hooks/api'
import { diaryQueryKeys } from '@/hooks/queries/diary/diaryQueryKeys'
import {
  mapDiaryCalendar,
  mapDiaryDetail,
  mapDiaryEntryPage,
  mapDiaryStatistics,
} from '@/mappers/diaryMapper'

/** 목록 조회 기본 페이지 크기 (API 허용 범위: 1~50) */
const DIARY_PAGE_SIZE = 20

export function useDiaryCalendarQuery(year: number, month: number, enabled: boolean = true) {
  return useApiQuery({
    queryKey: diaryQueryKeys.calendar(year, month),
    operation: getDiaryCalendar,
    endpoint: 'getDiaryCalendar',
    args: [{ request: { year, month } }],
    responseSchema: ApiResponseGetDiaryCalendarResponse,
    response: 'requiredResult',
    map: mapDiaryCalendar,
    staleTime: 0,
    enabled,
  })
}

export function useDiaryListQuery(size: number = DIARY_PAGE_SIZE, enabled: boolean = true) {
  return useApiInfiniteQuery({
    queryKey: diaryQueryKeys.list(size),
    operation: getDiaries,
    endpoint: 'getDiaries',
    getArgs: ({ pageParam }): [GetDiariesParams] => [
      { request: { cursor: pageParam ?? undefined, size } },
    ],
    responseSchema: ApiResponseGetDiariesResponse,
    response: 'requiredResult',
    map: mapDiaryEntryPage,
    staleTime: 0,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled,
  })
}

export function useDiaryDetailQuery(diaryId: string | null) {
  return useApiQuery({
    queryKey: diaryQueryKeys.detail(diaryId ?? ''),
    operation: getDiaryDetail,
    endpoint: 'getDiaryDetail',
    args: [diaryId ?? ''],
    responseSchema: ApiResponseGetDiaryDetailResponse,
    response: 'requiredResult',
    map: mapDiaryDetail,
    staleTime: 0,
    enabled: Boolean(diaryId),
  })
}

export function useDiaryStatisticsQuery(enabled: boolean = true) {
  return useApiQuery({
    queryKey: diaryQueryKeys.stats(),
    operation: getDiaryStats,
    endpoint: 'getDiaryStats',
    args: [],
    responseSchema: ApiResponseGetDiaryStatsResponse,
    response: 'requiredResult',
    map: mapDiaryStatistics,
    staleTime: 0,
    enabled,
  })
}
