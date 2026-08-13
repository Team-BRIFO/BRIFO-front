/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/api/client/ApiError'

vi.mock('@/assets/icons/loader-1.svg?react', () => ({ default: () => <svg /> }))
vi.mock('@/assets/icons/share/download.svg?react', () => ({ default: () => <svg /> }))
vi.mock('@/assets/icons/share/kakao.svg?react', () => ({ default: () => <svg /> }))
vi.mock('@/components/common/StatusBar', () => ({
  StatusBar: ({
    left,
    right,
    title,
  }: {
    left?: React.ReactNode
    right?: React.ReactNode
    title?: string
  }) => (
    <header>
      {left}
      <h1>{title}</h1>
      {right}
    </header>
  ),
  StatusBarBackButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" aria-label="뒤로 가기" {...props} />
  ),
  StatusBarNotificationButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" aria-label="알림" {...props} />
  ),
}))

const diaryMocks = vi.hoisted(() => ({
  detail: null as {
    id: string
    shareImageUrl: string | null
    stockName: string
  } | null,
  mutation: {
    mutate: vi.fn(),
    reset: vi.fn(),
    isIdle: true,
    isPending: false,
    isError: false,
    error: null as unknown,
    mutationDiaryId: null as string | null,
  },
}))

vi.mock('@/pages/DiaryPage/hooks/useDiaryQueries', () => ({
  useDiaryDetailQuery: () => ({
    data: diaryMocks.detail,
    fetchStatus: 'idle',
    error: null,
    refetch: vi.fn(),
  }),
  useDiaryStatisticsQuery: () => ({ data: { cumulativeHitRate: 73 } }),
}))

vi.mock('@/pages/DiaryPage/hooks/useCreateDiaryShareImageMutation', () => ({
  useCreateDiaryShareImageMutation: () => diaryMocks.mutation,
}))

import { DiaryDetailPage } from '@/pages/DiaryPage/DiaryDetailPage'

const diaryId = '019fd537-93a1-7bbb-8850-af72451ba9ad'
const nextDiaryId = '019fd537-93a1-7bbb-8850-af72451ba9ae'

function getButton(label: string) {
  const button = document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)
  if (!button) throw new Error(`${label} 버튼을 찾을 수 없습니다.`)
  return button
}

function DetailRoutes() {
  const navigate = useNavigate()

  return (
    <>
      <button
        type="button"
        aria-label="다른 결정 카드 열기"
        onClick={() => navigate(`/diary/${nextDiaryId}`)}
      />
      <Routes>
        <Route path="/diary/:id" element={<DiaryDetailPage />} />
      </Routes>
    </>
  )
}

function renderDetail(root: Root) {
  act(() => {
    root.render(
      <MemoryRouter initialEntries={[`/diary/${diaryId}`]}>
        <DetailRoutes />
      </MemoryRouter>,
    )
  })
}

describe('DiaryDetailPage share image flow', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    diaryMocks.detail = { id: diaryId, shareImageUrl: null, stockName: '삼성전자' }
    diaryMocks.mutation.mutate.mockReset()
    diaryMocks.mutation.reset.mockReset()
    diaryMocks.mutation.isIdle = true
    diaryMocks.mutation.isPending = false
    diaryMocks.mutation.isError = false
    diaryMocks.mutation.error = null
    diaryMocks.mutation.mutationDiaryId = null
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('creates an absent share image and enables image saving after the cache URL is available', () => {
    renderDetail(root)

    expect(diaryMocks.mutation.mutate).toHaveBeenCalledWith(diaryId)
    expect(getButton('이미지 저장').disabled).toBe(true)

    diaryMocks.detail = {
      id: diaryId,
      shareImageUrl: 'https://images.example.com/decision-card.png',
      stockName: '삼성전자',
    }
    diaryMocks.mutation.isIdle = false
    diaryMocks.mutation.mutationDiaryId = diaryId
    renderDetail(root)

    expect(getButton('이미지 저장').disabled).toBe(false)
    expect(getButton('카카오톡으로 공유').disabled).toBe(true)
    expect(container.querySelector('[aria-label="인스타그램으로 공유"]')).toBeNull()
    expect(container.textContent).not.toContain('공유 카드가 준비되었어요.')
  })

  it('shows the generation failure reason and retries the same diary', () => {
    renderDetail(root)
    diaryMocks.mutation.isIdle = false
    diaryMocks.mutation.isError = true
    diaryMocks.mutation.mutationDiaryId = diaryId
    diaryMocks.mutation.error = new ApiError({
      kind: 'http',
      endpoint: 'createDiaryShareImage',
      code: 'IMAGE_NOT_READY',
      message: '서버에서 요청을 처리하지 못했습니다.',
      serviceMessage: '정산이 완료된 결정만 공유 카드를 만들 수 있습니다.',
    })
    renderDetail(root)

    expect(container.textContent).toContain('정산이 완료된 결정만 공유 카드를 만들 수 있습니다.')
    expect(getButton('카카오톡으로 공유').disabled).toBe(true)

    const retryButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '다시 시도',
    )
    if (!retryButton) throw new Error('재시도 버튼을 찾을 수 없습니다.')

    act(() => retryButton.click())

    expect(diaryMocks.mutation.mutate).toHaveBeenLastCalledWith(diaryId)
    expect(diaryMocks.mutation.mutate).toHaveBeenCalledTimes(2)
  })

  it('does not show the previous diary mutation failure after navigating to another diary', () => {
    renderDetail(root)
    diaryMocks.mutation.isIdle = false
    diaryMocks.mutation.isError = true
    diaryMocks.mutation.mutationDiaryId = diaryId
    diaryMocks.mutation.error = new ApiError({
      kind: 'http',
      endpoint: 'createDiaryShareImage',
      code: 'IMAGE_NOT_READY',
      message: '서버에서 요청을 처리하지 못했습니다.',
      serviceMessage: '첫 번째 일기의 공유 카드 생성에 실패했습니다.',
    })
    renderDetail(root)
    expect(container.textContent).toContain('첫 번째 일기의 공유 카드 생성에 실패했습니다.')

    diaryMocks.detail = { id: nextDiaryId, shareImageUrl: null, stockName: 'SK하이닉스' }
    diaryMocks.mutation.reset.mockClear()
    act(() => getButton('다른 결정 카드 열기').click())

    expect(container.textContent).not.toContain('첫 번째 일기의 공유 카드 생성에 실패했습니다.')
    expect(container.textContent).not.toContain('공유 카드를 불러오는 중이에요.')
    expect(diaryMocks.mutation.reset).toHaveBeenCalledOnce()
  })
})
