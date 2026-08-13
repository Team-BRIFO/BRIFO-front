/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const notificationMocks = vi.hoisted(() => ({
  renderItem: vi.fn(),
  renderStatusBar: vi.fn(),
}))

vi.mock('@/components/common/StatusBar', () => ({
  StatusBar: ({ left, title }: { left?: React.ReactNode; title?: React.ReactNode }) => {
    notificationMocks.renderStatusBar()
    return (
      <header>
        {left}
        {title}
      </header>
    )
  },
  StatusBarBackButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" aria-label="뒤로 가기" {...props} />
  ),
}))
vi.mock('@/components/feature/notification/NotificationItem', () => ({
  default: ({ title }: { title: string }) => {
    notificationMocks.renderItem(title)
    return <div>{title}</div>
  },
}))
vi.mock('@/components/feature/notification/NotificationTabs', () => ({
  default: ({
    onChange,
  }: {
    onChange: (value: 'all' | 'settlement' | 'employee' | 'system') => void
  }) => (
    <div>
      <button type="button" onClick={() => onChange('settlement')}>
        정산
      </button>
    </div>
  ),
}))
vi.mock('@/components/feedback/PageErrorView', () => ({ PageErrorView: () => <div>오류</div> }))
vi.mock('@/components/feedback/PageLoadingView', () => ({ PageLoadingView: () => <div>로딩</div> }))
vi.mock('@/pages/NotificationPage/hooks/useNotificationQueries', () => ({
  useNotificationListQuery: () => ({
    data: {
      pages: [
        {
          notifications: [
            {
              id: 'notification-1',
              code: 'SETTLEMENT_DONE',
              category: 'settlement',
              title: '정산 완료',
              description: '정산이 완료되었어요.',
              time: '방금',
              createdAt: '2026-08-13T00:00:00Z',
              target: { type: 'DECISION', targetId: 'decision-1' },
            },
            {
              id: 'notification-2',
              code: 'SYSTEM_NOTICE',
              category: 'system',
              title: '시스템 알림',
              description: '점검 안내예요.',
              time: '1분 전',
              createdAt: '2026-08-13T00:00:00Z',
              target: { type: 'NONE', targetId: null },
            },
          ],
        },
      ],
    },
    error: undefined,
    fetchStatus: 'idle',
    hasNextPage: false,
    isFetchingNextPage: false,
    isFetchNextPageError: false,
    fetchNextPage: vi.fn(),
  }),
}))

import { NotificationPage } from '@/pages/NotificationPage/NotificationPage'

function getRenderCount(title: string) {
  return notificationMocks.renderItem.mock.calls.filter(([value]) => value === title).length
}

describe('Notification render boundary', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    notificationMocks.renderItem.mockReset()
    notificationMocks.renderStatusBar.mockReset()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('keeps the header and retained notification item outside the category-tab state', () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <NotificationPage />
        </MemoryRouter>,
      )
    })

    expect(notificationMocks.renderStatusBar).toHaveBeenCalledTimes(1)
    expect(getRenderCount('정산 완료')).toBe(1)
    expect(getRenderCount('시스템 알림')).toBe(1)

    const settlementTab = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === '정산',
    )
    if (!settlementTab) throw new Error('정산 탭을 찾을 수 없습니다.')

    act(() => settlementTab.click())

    expect(notificationMocks.renderStatusBar).toHaveBeenCalledTimes(1)
    expect(getRenderCount('정산 완료')).toBe(1)
    expect(getRenderCount('시스템 알림')).toBe(1)
    expect(container.textContent).not.toContain('시스템 알림')
  })
})
