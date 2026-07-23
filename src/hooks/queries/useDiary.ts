import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createDiaryShareImage,
  DIARY_PAGE_SIZE,
  getDiaries,
  getDiaryCalendar,
  getDiaryDetail,
  getDiaryStats,
} from '@/api/diary'
import type {
  DiaryCalendarResult,
  DiaryDetailResult,
  DiaryListResult,
  DiaryShareImageResult,
  DiaryStatsResult,
} from '@/types/api/diary'

export const DIARY_QUERY_KEYS = {
  all: ['diaries'] as const,
  calendar: (year: number, month: number) =>
    [...DIARY_QUERY_KEYS.all, 'calendar', year, month] as const,
  list: () => [...DIARY_QUERY_KEYS.all, 'list'] as const,
  detail: (diaryId: string) => [...DIARY_QUERY_KEYS.all, 'detail', diaryId] as const,
  stats: () => [...DIARY_QUERY_KEYS.all, 'stats'] as const,
}

/** [다건] 월별 캘린더 조회 */
export function useDiaryCalendar(year: number, month: number, enabled: boolean = true) {
  return useQuery<DiaryCalendarResult, Error>({
    queryKey: DIARY_QUERY_KEYS.calendar(year, month),
    queryFn: () => getDiaryCalendar(year, month),
    enabled,
  })
}

/** [다건] 결정일기 목록 (커서 기반 무한 스크롤) */
export function useDiaryList(size: number = DIARY_PAGE_SIZE, enabled: boolean = true) {
  return useInfiniteQuery<DiaryListResult, Error>({
    queryKey: DIARY_QUERY_KEYS.list(),
    queryFn: ({ pageParam }) => getDiaries(pageParam as string | null, size),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? (lastPage.page.nextCursor ?? undefined) : undefined,
    enabled,
  })
}

/** [단건] 결정일기 상세 조회 */
export function useDiaryDetail(diaryId: string | null) {
  return useQuery<DiaryDetailResult, Error>({
    queryKey: DIARY_QUERY_KEYS.detail(diaryId ?? ''),
    queryFn: () => getDiaryDetail(diaryId!),
    enabled: Boolean(diaryId),
  })
}

/** [다건] 결정일기 통계 조회 */
export function useDiaryStats(enabled: boolean = true) {
  return useQuery<DiaryStatsResult, Error>({
    queryKey: DIARY_QUERY_KEYS.stats(),
    queryFn: getDiaryStats,
    enabled,
  })
}

/**
 * [생성] 공유 이미지 생성.
 *
 * 응답의 shareImageUrl 을 상세 캐시에 직접 반영한다 — invalidate 후 재조회하면
 * 방금 받은 URL 을 위해 상세를 한 번 더 부르게 되므로 불필요하다.
 *
 * 미사용 필드: result.diaryId(요청 시 이미 알고 있음) · result.reused(재사용 여부에 따른 UI 분기가 없음)
 */
export function useCreateDiaryShareImage() {
  const queryClient = useQueryClient()

  return useMutation<DiaryShareImageResult, Error, string>({
    mutationFn: (diaryId) => createDiaryShareImage(diaryId),
    onSuccess: (result, diaryId) => {
      queryClient.setQueryData<DiaryDetailResult>(DIARY_QUERY_KEYS.detail(diaryId), (prev) =>
        prev ? { ...prev, shareImageUrl: result.shareImageUrl } : prev,
      )
    },
  })
}
