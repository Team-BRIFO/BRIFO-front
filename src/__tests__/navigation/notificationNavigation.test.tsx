/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components/common/StatusBar', () => ({
  StatusBar: ({
    left,
    right,
    title,
  }: {
    left?: React.ReactNode
    right?: React.ReactNode
    title?: React.ReactNode
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
vi.mock('@/components/common/Button', () => ({
  default: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}))
vi.mock('@/components/common/Modal', () => ({
  default: ({ children }: { children?: React.ReactNode }) => children,
}))
vi.mock('@/components/common/Tabs', () => ({ Tabs: () => <div /> }))
vi.mock('@/components/domain/agent/AgentCard', () => ({ AgentCard: () => <div /> }))
vi.mock('@/components/feature/analyze/AnalyzeCard', () => ({ AnalyzeCard: () => <div /> }))
vi.mock('@/components/feature/analyze/AnalyzeRequestModal', () => ({
  AnalyzeRequestModal: () => null,
}))
vi.mock('@/components/feature/briefing/BriefingAgentListItem', () => ({
  BriefingAgentListItem: () => <div />,
}))
vi.mock('@/components/feature/briefing/BriefingMainContentSheet', () => ({
  BriefingMainContentSheet: () => <div />,
}))
vi.mock('@/components/feature/decision/DecisionBottomSheet', () => ({
  DecisionBottomSheet: () => null,
}))
vi.mock('@/components/feature/decision/DecisionResultModal', () => ({
  DecisionResultModalContent: () => null,
}))
vi.mock('@/components/feature/decision/PredictionCompleteModal', () => ({
  PredictionCompleteModal: () => null,
}))
vi.mock('@/components/feature/glossary/GlossaryBottomSheet', () => ({
  GlossaryBottomSheet: () => null,
}))
vi.mock('@/components/feature/newsCard/NewsCard', () => ({ NewsCard: () => <div /> }))
vi.mock('@/components/feature/newsCard/NewsCardIndicator', () => ({
  NewsCardIndicator: () => <div />,
}))
vi.mock('@/components/feature/office/Office', () => ({ Office: () => <div /> }))
vi.mock('@/components/feedback/PageErrorView', () => ({ PageErrorView: () => <div /> }))
vi.mock('@/components/feedback/PageLoadingView', () => ({ PageLoadingView: () => <div /> }))
vi.mock('@/components/feedback/PageStatusShell', () => ({
  PageStatusShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/feedback/StatusMessage', () => ({ StatusMessage: () => <div /> }))
vi.mock('@/hooks/queries/agent/useAgentListQuery', () => ({
  useAgentListQuery: () => ({
    data: [{ id: 'agent-1', name: '루키', dailyAP: 10 }],
    fetchStatus: 'idle',
    error: null,
    refetch: vi.fn(),
  }),
}))
vi.mock('@/hooks/queries/ap/useApQueries', () => ({
  useCreateCreditLoanMutation: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('@/pages/BriefingPage/hooks/useBriefingDetailQuery', () => ({
  useBriefingDetailQuery: () => ({
    data: {
      stock: { id: 'stock-1', name: '삼성전자', changeRate: 0 },
      agent: { id: 'agent-1', name: '루키' },
      briefing: { badgeText: '상승', badgeType: 'UP', comment: '상승할 것 같아요.' },
      activeTab: 'rookie',
    },
    fetchStatus: 'idle',
    error: null,
    refetch: vi.fn(),
  }),
}))
vi.mock('@/pages/BriefingPage/hooks/usePostBriefingRequestMutation', () => ({
  usePostBriefingRequestMutation: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('@/pages/BriefingPage/hooks/usePostDecisionMutation', () => ({
  usePostDecisionMutation: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('@/pages/BriefingPage/hooks/useStockBriefingsQuery', () => ({
  useStockBriefingsQuery: () => ({
    data: { stock: { hashtags: [] }, items: [] },
    fetchStatus: 'idle',
    error: null,
    refetch: vi.fn(),
  }),
}))
vi.mock('@/pages/NewsCardPage/hooks/useNewsQueries', () => ({
  useGetNewsCardDetail: () => ({
    data: [{ cardId: 'card-1', relatedStocks: [{ name: '삼성전자' }], terms: [] }],
    isLoading: false,
    fetchStatus: 'idle',
    error: null,
    refetch: vi.fn(),
  }),
}))

import { BriefingAssignPage } from '@/pages/BriefingPage/BriefingAssignPage'
import { BriefingDetailPage } from '@/pages/BriefingPage/BriefingDetailPage'
import { BriefingPage } from '@/pages/BriefingPage/BriefingPage'
import { NewsCardPage } from '@/pages/NewsCardPage/NewsCardPage'
import { PATH } from '@/routes/paths'

function LocationDisplay() {
  const location = useLocation()

  return <output>{location.pathname}</output>
}

const notificationNavigationCases = [
  {
    name: 'BriefingPage',
    path: PATH.BRIEFING,
    element: <BriefingPage />,
    initialEntry: PATH.BRIEFING,
  },
  {
    name: 'BriefingAssignPage',
    path: PATH.BRIEFING_ASSIGN_ROUTE,
    element: <BriefingAssignPage />,
    initialEntry: PATH.BRIEFING_ASSIGN('stock-1'),
  },
  {
    name: 'BriefingDetailPage',
    path: PATH.BRIEFING_DETAIL_ROUTE,
    element: <BriefingDetailPage />,
    initialEntry: PATH.BRIEFING_DETAIL('briefing-1'),
  },
  {
    name: 'NewsCardPage',
    path: PATH.CARD_NEWS_DETAIL_ROUTE,
    element: <NewsCardPage />,
    initialEntry: PATH.CARD_NEWS_DETAIL('stock-1'),
  },
]

describe('notification navigation', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it.each(notificationNavigationCases)(
    '$name 알림 버튼은 알림 페이지로 이동한다',
    ({ path, element, initialEntry }) => {
      act(() => {
        root.render(
          <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
              <Route path={path} element={element} />
              <Route path={PATH.NOTIFICATION} element={<LocationDisplay />} />
            </Routes>
          </MemoryRouter>,
        )
      })

      const notificationButton =
        container.querySelector<HTMLButtonElement>('button[aria-label="알림"]')
      if (!notificationButton) throw new Error('알림 버튼을 찾을 수 없습니다.')

      act(() => notificationButton.click())

      expect(container.querySelector('output')?.textContent).toBe(PATH.NOTIFICATION)
    },
  )
})
