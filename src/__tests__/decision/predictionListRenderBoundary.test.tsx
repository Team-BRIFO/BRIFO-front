/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const decisionMocks = vi.hoisted(() => ({
  renderAnalyzeCard: vi.fn(),
}))

vi.mock('@/components/common/Modal', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div role="dialog">{children}</div>,
}))
vi.mock('@/components/common/StatusBar', () => ({
  StatusBar: ({ left }: { left?: React.ReactNode }) => <header>{left}</header>,
  StatusBarBackButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" aria-label="뒤로 가기" {...props} />
  ),
}))
vi.mock('@/components/feature/analyze/AnalyzeCard', () => ({
  AnalyzeCard: ({ stock }: { stock: { name: string } }) => {
    decisionMocks.renderAnalyzeCard(stock.name)
    return <div>{stock.name}</div>
  },
}))
vi.mock('@/components/feature/decision/DecisionResultModal', () => ({
  DecisionResultModalContent: () => <div>예측 결과</div>,
}))
vi.mock('@/components/feedback/PageErrorView', () => ({ PageErrorView: () => <div>오류</div> }))
vi.mock('@/components/feedback/PageLoadingView', () => ({ PageLoadingView: () => <div>로딩</div> }))
vi.mock('@/pages/DecisionPage/hooks/useDecisionQueries', () => ({
  useDecisionListQuery: () => ({
    data: [
      {
        id: 'decision-1',
        confidenceLevel: 3,
        isSettled: true,
        stock: { name: '삼성전자', changeRate: 1.2 },
      },
      {
        id: 'decision-2',
        confidenceLevel: 4,
        isSettled: true,
        stock: { name: 'SK하이닉스', changeRate: 2.3 },
      },
    ],
    error: undefined,
    fetchStatus: 'idle',
  }),
  useDecisionDetailQuery: () => ({
    data: { isCorrect: true, apDelta: 50, stock: { name: '삼성전자', changeRate: 1.2 } },
    error: undefined,
    fetchStatus: 'idle',
    refetch: vi.fn(),
  }),
}))

import { PredictionListPage } from '@/pages/DecisionPage/PredictionListPage'

function getRenderCount(stockName: string) {
  return decisionMocks.renderAnalyzeCard.mock.calls.filter(([name]) => name === stockName).length
}

describe('Prediction list render boundary', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    decisionMocks.renderAnalyzeCard.mockReset()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('keeps other prediction cards outside a selected result modal state', () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <PredictionListPage />
        </MemoryRouter>,
      )
    })

    expect(getRenderCount('삼성전자')).toBe(1)
    expect(getRenderCount('SK하이닉스')).toBe(1)

    const settledCards = container.querySelectorAll<HTMLElement>('[role="button"]')
    act(() => settledCards[0]?.click())

    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('예측 결과')
    expect(getRenderCount('삼성전자')).toBe(2)
    expect(getRenderCount('SK하이닉스')).toBe(1)
  })
})
