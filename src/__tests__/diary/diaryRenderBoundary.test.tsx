/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes, useSearchParams } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const diaryMocks = vi.hoisted(() => ({
  renderNavigationItem: vi.fn(),
  renderStatusBar: vi.fn(),
}))

vi.mock('@/assets/logo/brifo_logo_small.svg?react', () => ({ default: () => <svg /> }))
vi.mock('@/components/common/StatusBar', () => ({
  StatusBar: ({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) => {
    diaryMocks.renderStatusBar()
    return (
      <header>
        {left}
        {right}
      </header>
    )
  },
  StatusBarNotificationButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" aria-label="알림" {...props} />
  ),
}))
vi.mock('@/components/common/NavigationItem', () => ({
  default: ({ label, onClick }: { label: string; onClick: () => void }) => {
    diaryMocks.renderNavigationItem()
    return (
      <button type="button" onClick={onClick}>
        {label}
      </button>
    )
  },
}))
vi.mock('@/components/feature/diary/DiaryCalendar', () => ({
  DiaryCalendar: () => <div>calendar content</div>,
}))
vi.mock('@/components/feature/diary/DiaryList', () => ({
  DiaryList: () => <div>list content</div>,
}))
vi.mock('@/components/feature/diary/DiaryStatistics', () => ({
  DiaryStatistics: () => <div>statistics content</div>,
}))
vi.mock('@/components/feature/diary/DiaryTabScreen', () => ({
  DiaryTabScreen: ({
    children,
    onChangeView,
    view,
  }: {
    children: React.ReactNode
    onChangeView: (view: 'calendar' | 'list' | 'statistics') => void
    view: string
  }) => (
    <section data-testid="diary-tab-screen" data-view={view}>
      <button type="button" onClick={() => onChangeView('list')}>
        리스트
      </button>
      {children}
    </section>
  ),
}))
vi.mock('@/components/feedback/PageErrorView', () => ({
  PageErrorView: () => <div>error</div>,
}))
vi.mock('@/components/feedback/PageLoadingView', () => ({
  PageLoadingView: () => <div>loading</div>,
}))
vi.mock('@/hooks/queries/user/useUserProfileQuery', () => ({
  useUserProfileQuery: () => ({ data: { apSummary: { balance: 100 } } }),
}))
vi.mock('@/pages/DiaryPage/hooks/useDiaryQueries', () => ({
  useDiaryCalendarQuery: (_year: number, _month: number, enabled: boolean) => ({
    data: enabled ? { marks: [], hitRate: 0 } : undefined,
    error: undefined,
    fetchStatus: 'idle',
  }),
  useDiaryListQuery: (_size: number | undefined, enabled: boolean) => ({
    data: undefined,
    error: undefined,
    fetchStatus: enabled ? 'fetching' : 'idle',
  }),
  useDiaryStatisticsQuery: () => ({ data: undefined, error: undefined, fetchStatus: 'idle' }),
}))
vi.mock('@/hooks/policy/usePolicyReagreement', () => ({
  usePolicyReagreement: () => ({
    isOpen: false,
    items: [],
    preCheckedPolicyIds: [],
    isPending: false,
    errorMessage: null,
    onAgree: vi.fn(),
    onViewPolicy: vi.fn(),
  }),
}))
vi.mock('@/hooks/auth/useSessionValidationOnFocus', () => ({
  useSessionValidationOnFocus: vi.fn(),
}))
vi.mock('@/components/feature/policy/PolicyReagreementBottomSheet', () => ({
  PolicyReagreementBottomSheet: () => null,
}))

import { AppLayout } from '@/layouts/AppLayout'
import { DiaryPage } from '@/pages/DiaryPage/DiaryPage'

function SearchParamChangeControl() {
  const [, setSearchParams] = useSearchParams()

  return (
    <button type="button" onClick={() => setSearchParams({ view: 'list' })}>
      쿼리 탭 전환
    </button>
  )
}

describe('Diary render boundary', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    diaryMocks.renderNavigationItem.mockReset()
    diaryMocks.renderStatusBar.mockReset()
    Object.assign(HTMLElement.prototype, { scrollTo: vi.fn() })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('keeps the diary top bar and tab frame mounted while a new tab loads', () => {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/diary']}>
          <DiaryPage />
        </MemoryRouter>,
      )
    })

    expect(diaryMocks.renderStatusBar).toHaveBeenCalledTimes(1)
    expect(container.querySelector('[data-testid="diary-tab-screen"]')).not.toBeNull()

    act(() => {
      container.querySelector<HTMLButtonElement>('[data-testid="diary-tab-screen"] button')?.click()
    })

    expect(diaryMocks.renderStatusBar).toHaveBeenCalledTimes(1)
    expect(container.querySelector('[data-testid="diary-tab-screen"]')).not.toBeNull()
    expect(container.textContent).toContain('loading')
  })

  it('does not re-render navigation items for a diary search-parameter change', () => {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/diary']}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/diary" element={<SearchParamChangeControl />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      )
    })

    expect(diaryMocks.renderNavigationItem).toHaveBeenCalledTimes(5)

    act(() => {
      container.querySelector<HTMLButtonElement>('main button')?.click()
    })

    expect(diaryMocks.renderNavigationItem).toHaveBeenCalledTimes(5)
  })
})
