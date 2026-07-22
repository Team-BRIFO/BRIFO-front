import shareCardHit from '@/assets/images/diary/share-card-hit.png'
import shareCardMiss from '@/assets/images/diary/share-card-miss.png'
import stockLogoPlaceholder from '@/assets/images/diary/stock-logo-placeholder.png'
import type {
  DiaryCalendarApiResponse,
  DiaryDetailApiResponse,
  DiaryListApiResponse,
  DiaryShareImageApiResponse,
  DiaryStatsApiResponse,
} from '@/types/api/diary'

// TODO: 실제 API 연동 시 제거 — 서버 응답 shape 그대로 흉내낸 mock

const OK = { success: true as const, code: 'COMMON_200', message: '요청에 성공했습니다.' }

/** 캘린더 기본 조회 월 */
export const MOCK_DIARY_YEAR = 2026
export const MOCK_DIARY_MONTH = 7

/** GET /api/diaries/calendar?year&month */
export const MOCK_DIARY_CALENDAR_RESPONSE: DiaryCalendarApiResponse = {
  ...OK,
  result: {
    year: MOCK_DIARY_YEAR,
    month: MOCK_DIARY_MONTH,
    settledDecisionCount: 21,
    correctDecisionCount: 12,
    accuracyRate: 57,
    days: [
      { date: '2026-07-01', direction: { up: true, down: true, neutral: false } },
      { date: '2026-07-02', direction: { up: false, down: false, neutral: true } },
      { date: '2026-07-03', direction: { up: true, down: false, neutral: false } },
      { date: '2026-07-06', direction: { up: true, down: true, neutral: true } },
      { date: '2026-07-08', direction: { up: false, down: true, neutral: false } },
      { date: '2026-07-09', direction: { up: true, down: false, neutral: true } },
      { date: '2026-07-13', direction: { up: true, down: false, neutral: false } },
      { date: '2026-07-14', direction: { up: true, down: true, neutral: false } },
      { date: '2026-07-15', direction: { up: false, down: false, neutral: true } },
      { date: '2026-07-16', direction: { up: true, down: true, neutral: true } },
      { date: '2026-07-17', direction: { up: false, down: true, neutral: false } },
      { date: '2026-07-20', direction: { up: true, down: false, neutral: false } },
      { date: '2026-07-21', direction: { up: true, down: true, neutral: false } },
      { date: '2026-07-22', direction: { up: false, down: false, neutral: true } },
    ],
  },
}

/** GET /api/diaries?cursor&size (mock 은 단일 페이지) */
export const MOCK_DIARY_LIST_RESPONSE: DiaryListApiResponse = {
  ...OK,
  result: {
    page: {
      // price / changeRate / tradeDate / logoUrl 은 명세에 없는 필드다 (types/api/diary.ts 주석 참고)
      items: [
        {
          diaryId: '8fd2c732-b4f1-4b66-b53a-95b5f11df391',
          stock: { stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01', name: '삼성전자' },
          decision: { direction: 'UP', apDelta: 80, isCorrect: true },
          price: 2679000,
          changeRate: 6.3,
          tradeDate: '2026-07-21',
          logoUrl: stockLogoPlaceholder,
        },
        {
          diaryId: '6c1a90b4-2f77-4d51-9a3e-1b0c7e4a55d2',
          stock: { stockId: 'ee5f7320-7acb-4f12-8427-e1f24ef10d21', name: 'SK하이닉스' },
          decision: { direction: 'NEUTRAL', apDelta: 0, isCorrect: false },
          price: 198500,
          changeRate: 0.2,
          tradeDate: '2026-07-20',
          logoUrl: stockLogoPlaceholder,
        },
        {
          diaryId: '3b57e2d9-8c14-4a6f-b2d0-77e9a1c3f408',
          stock: { stockId: '0a827caf-5c8c-4c2f-8cc3-8a4af8631e4f', name: 'NAVER' },
          decision: { direction: 'DOWN', apDelta: -50, isCorrect: false },
          price: 172400,
          changeRate: -2.4,
          tradeDate: '2026-07-19',
          logoUrl: stockLogoPlaceholder,
        },
      ],
      nextCursor: null,
      hasNext: false,
    },
  },
}

/** GET /api/diaries/{diaryId} */
export const MOCK_DIARY_DETAIL_RESPONSES: Record<string, DiaryDetailApiResponse> = {
  '8fd2c732-b4f1-4b66-b53a-95b5f11df391': {
    ...OK,
    result: {
      diaryId: '8fd2c732-b4f1-4b66-b53a-95b5f11df391',
      // 생성 전 상태로 두어 POST /share-images 흐름을 확인할 수 있게 한다
      shareImageUrl: null,
      stock: { stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01', name: '삼성전자', changeRate: 2.0 },
      agent: {
        agentId: '0f2b7e7c-7d8a-4f4f-9b8e-0d1f3a2b9c11',
        agentType: 'ROOKIE',
        nickname: '루키',
      },
      briefing: {
        briefingId: '5f64e4df-83e5-4050-94f9-a42e0f7f9f1a',
        direction: 'UP',
        confidenceRate: 72,
      },
      decision: { isCorrect: true, confidenceLevel: 4 },
    },
  },
  '6c1a90b4-2f77-4d51-9a3e-1b0c7e4a55d2': {
    ...OK,
    result: {
      diaryId: '6c1a90b4-2f77-4d51-9a3e-1b0c7e4a55d2',
      shareImageUrl: null,
      stock: {
        stockId: 'ee5f7320-7acb-4f12-8427-e1f24ef10d21',
        name: 'SK하이닉스',
        changeRate: 0.3,
      },
      agent: {
        agentId: '7a1e6d33-890e-4f73-a18c-9d11c8e7f444',
        agentType: 'TANKER',
        nickname: '탱커',
      },
      briefing: {
        briefingId: 'b1d7c2f0-4e93-4c88-9a11-2d5f6b7c8e90',
        direction: 'NEUTRAL',
        confidenceRate: 55,
      },
      decision: { isCorrect: false, confidenceLevel: 3 },
    },
  },
  '3b57e2d9-8c14-4a6f-b2d0-77e9a1c3f408': {
    ...OK,
    result: {
      diaryId: '3b57e2d9-8c14-4a6f-b2d0-77e9a1c3f408',
      shareImageUrl: null,
      stock: { stockId: '0a827caf-5c8c-4c2f-8cc3-8a4af8631e4f', name: 'NAVER', changeRate: -1.4 },
      agent: {
        agentId: '2d9c6a71-3c5c-46e7-b8a2-54f5c1f7d912',
        agentType: 'PRO',
        nickname: '프로',
      },
      briefing: {
        briefingId: 'c9e4a5b1-7d02-4f36-8b45-3a1c9d0e2f77',
        direction: 'DOWN',
        confidenceRate: 64,
      },
      decision: { isCorrect: false, confidenceLevel: 5 },
    },
  },
}

/**
 * 공유 카드 이미지 (피그마 Decision Card A/B 프레임을 PNG 로 내려받은 것).
 * 실제로는 서버가 결정별로 렌더링해 URL 을 내려주므로, mock 은 적중/실패 두 장만 쓴다.
 * TODO: 실제 API 연동 시 제거
 */
export const MOCK_DIARY_SHARE_IMAGES = {
  hit: shareCardHit,
  miss: shareCardMiss,
} as const

/**
 * POST /api/diaries/{diaryId}/share-images
 * 서버가 공유 카드를 PNG로 렌더링해 URL을 돌려준다.
 */
export const MOCK_DIARY_SHARE_IMAGE_RESPONSE: DiaryShareImageApiResponse = {
  success: true,
  code: 'DIARY_200_01',
  message: '공유 이미지가 생성되었습니다.',
  result: {
    diaryId: '8fd2c732-b4f1-4b66-b53a-95b5f11df391',
    shareImageUrl: MOCK_DIARY_SHARE_IMAGES.hit,
    reused: false,
  },
}

/** GET /api/diaries/stats */
export const MOCK_DIARY_STATS_RESPONSE: DiaryStatsApiResponse = {
  ...OK,
  result: {
    summary: {
      recent30DaysSettledDecisionCount: 18,
      recent30DaysCorrectDecisionCount: 12,
      recent30DaysAccuracyRate: 66,
      settledDecisionCount: 52,
      correctDecisionCount: 31,
      averageConfidenceLevel: 3.6,
      bestCorrectStreak: 5,
    },
    directionStats: [
      { direction: 'UP', settledDecisionCount: 22, correctDecisionCount: 14, accuracyRate: 63 },
      { direction: 'NEUTRAL', settledDecisionCount: 12, correctDecisionCount: 8, accuracyRate: 66 },
      { direction: 'DOWN', settledDecisionCount: 18, correctDecisionCount: 9, accuracyRate: 50 },
    ],
    agentStats: [
      {
        agentId: '0f2b7e7c-7d8a-4f4f-9b8e-0d1f3a2b9c11',
        agentType: 'ROOKIE',
        nickname: '루키',
        settledDecisionCount: 16,
        correctDecisionCount: 9,
        accuracyRate: 56,
      },
      {
        agentId: '2d9c6a71-3c5c-46e7-b8a2-54f5c1f7d912',
        agentType: 'PRO',
        nickname: '프로',
        settledDecisionCount: 21,
        correctDecisionCount: 14,
        accuracyRate: 66,
      },
      {
        agentId: '7a1e6d33-890e-4f73-a18c-9d11c8e7f444',
        agentType: 'TANKER',
        nickname: '탱커',
        settledDecisionCount: 15,
        correctDecisionCount: 8,
        accuracyRate: 53,
      },
    ],
    confidenceLevelStats: [
      { level: 'LOW', settledDecisionCount: 13, correctDecisionCount: 6, accuracyRate: 46 },
      { level: 'MEDIUM', settledDecisionCount: 17, correctDecisionCount: 10, accuracyRate: 58 },
      { level: 'HIGH', settledDecisionCount: 22, correctDecisionCount: 15, accuracyRate: 68 },
    ],
    stockStats: [
      {
        stockId: '9a44f49e-d531-4b9f-93dd-f78f8d5c2c81',
        name: '삼성전자',
        settledDecisionCount: 20,
        correctDecisionCount: 13,
        accuracyRate: 65,
      },
      {
        stockId: '0a827caf-5c8c-4c2f-8cc3-8a4af8631e4f',
        name: 'NAVER',
        settledDecisionCount: 14,
        correctDecisionCount: 8,
        accuracyRate: 57,
      },
      {
        stockId: 'ee5f7320-7acb-4f12-8427-e1f24ef10d21',
        name: 'SK하이닉스',
        settledDecisionCount: 18,
        correctDecisionCount: 10,
        accuracyRate: 55,
      },
    ],
  },
}
