import {
  MOCK_DIARY_CALENDAR_RESPONSE,
  MOCK_DIARY_DETAIL_RESPONSES,
  MOCK_DIARY_LIST_RESPONSE,
  MOCK_DIARY_SHARE_IMAGE_RESPONSE,
  MOCK_DIARY_SHARE_IMAGES,
  MOCK_DIARY_STATS_RESPONSE,
} from '@/pages/DiaryPage/mockDiary'
import type {
  DiaryCalendarResult,
  DiaryDetailResult,
  DiaryListResult,
  DiaryShareImageResult,
  DiaryStatsResult,
} from '@/types/api/diary'

/** 목록 조회 기본 페이지 크기 (명세 기본값) */
export const DIARY_PAGE_SIZE = 20

/**
 * mock 전용: 생성된 공유 이미지 URL 보관소.
 * 서버는 diary_entries.share_image_url 에 저장하고 재요청 시 재사용하므로, 그 동작을 흉내낸다.
 * TODO: 실제 API 연결 시 이 블록 전체 제거
 */
const mockShareImageUrls = new Map<string, string>()

/**
 * [다건] 월별 결정일기 캘린더를 조회합니다.
 * @param year 조회 연도 (2000 이상)
 * @param month 조회 월 (1~12)
 */
export const getDiaryCalendar = async (
  year: number,
  month: number,
): Promise<DiaryCalendarResult> => {
  // TODO: API 연결
  // const { data } = await apiClient.get<DiaryCalendarApiResponse>('/api/diaries/calendar', {
  //   params: { year, month },
  // })
  // return data.result

  void year
  void month

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DIARY_CALENDAR_RESPONSE.result)
    }, 500)
  })
}

/**
 * [다건] 결정일기 목록을 커서 기반으로 조회합니다.
 * @param cursor 직전 응답의 nextCursor (첫 페이지는 생략)
 * @param size 조회 개수 (1~50, 기본 20)
 */
export const getDiaries = async (
  cursor?: string | null,
  size: number = DIARY_PAGE_SIZE,
): Promise<DiaryListResult> => {
  // TODO: API 연결
  // const { data } = await apiClient.get<DiaryListApiResponse>('/api/diaries', {
  //   params: { cursor: cursor ?? undefined, size },
  // })
  // return data.result

  void cursor
  void size

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DIARY_LIST_RESPONSE.result)
    }, 500)
  })
}

/**
 * [단건] 결정일기 상세를 조회합니다.
 * @param diaryId 결정일기 공개 ID (UUID)
 */
export const getDiaryDetail = async (diaryId: string): Promise<DiaryDetailResult> => {
  // TODO: API 연결
  // const { data } = await apiClient.get<DiaryDetailApiResponse>(`/api/diaries/${diaryId}`)
  // return data.result

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response = MOCK_DIARY_DETAIL_RESPONSES[diaryId]
      if (response) {
        resolve({
          ...response.result,
          shareImageUrl: mockShareImageUrls.get(diaryId) ?? response.result.shareImageUrl,
        })
      } else {
        reject(new Error('Diary not found'))
      }
    }, 500)
  })
}

/**
 * [생성] 결정일기 공유 이미지(PNG)를 생성합니다.
 * 이미 생성된 이미지가 있으면 서버가 재사용해 `reused: true` 로 응답합니다.
 * @param diaryId 결정일기 공개 ID (UUID)
 */
export const createDiaryShareImage = async (diaryId: string): Promise<DiaryShareImageResult> => {
  // TODO: API 연결
  // const { data } = await apiClient.post<DiaryShareImageApiResponse>(
  //   `/api/diaries/${diaryId}/share-images`,
  // )
  // return data.result

  return new Promise((resolve) => {
    setTimeout(() => {
      const reused = mockShareImageUrls.has(diaryId)
      const isCorrect = MOCK_DIARY_DETAIL_RESPONSES[diaryId]?.result.decision.isCorrect
      const shareImageUrl =
        mockShareImageUrls.get(diaryId) ??
        (isCorrect ? MOCK_DIARY_SHARE_IMAGES.hit : MOCK_DIARY_SHARE_IMAGES.miss)

      mockShareImageUrls.set(diaryId, shareImageUrl)

      resolve({ ...MOCK_DIARY_SHARE_IMAGE_RESPONSE.result, diaryId, shareImageUrl, reused })
    }, 500)
  })
}

/** [다건] 결정일기 통계를 조회합니다. */
export const getDiaryStats = async (): Promise<DiaryStatsResult> => {
  // TODO: API 연결
  // const { data } = await apiClient.get<DiaryStatsApiResponse>('/api/diaries/stats')
  // return data.result

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DIARY_STATS_RESPONSE.result)
    }, 500)
  })
}
