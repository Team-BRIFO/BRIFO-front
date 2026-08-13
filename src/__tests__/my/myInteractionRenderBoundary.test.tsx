/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const myMocks = vi.hoisted(() => ({
  renderBadgeItem: vi.fn(),
  renderSummary: vi.fn(),
  renderTransactionRow: vi.fn(),
}))

vi.mock('@/components/common/Button', () => ({
  default: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}))
vi.mock('@/components/common/Tabs', () => ({
  Tabs: ({
    items,
    onChange,
  }: {
    items: { value: string; label: string }[]
    onChange: (value: string) => void
  }) => (
    <div>
      {items.map((item) => (
        <button key={item.value} type="button" onClick={() => onChange(item.value)}>
          {item.label}
        </button>
      ))}
    </div>
  ),
}))
vi.mock('@/components/domain/ap/ApHistorySummaryCard', () => ({
  ApHistorySummaryCard: () => {
    myMocks.renderSummary()
    return <div />
  },
}))
vi.mock('@/components/domain/ap/ApTransactionRow', () => ({
  ApTransactionRow: ({ transaction }: { transaction: { id: string } }) => {
    myMocks.renderTransactionRow(transaction.id)
    return <li>{transaction.id}</li>
  },
}))
vi.mock('@/components/domain/badge/BadgeItem', () => ({
  BadgeItem: ({
    badge,
    onClick,
  }: {
    badge: { id: string; name: string }
    onClick?: () => void
  }) => {
    myMocks.renderBadgeItem(badge.id)
    return (
      <button type="button" onClick={onClick}>
        {badge.name}
      </button>
    )
  },
}))
vi.mock('@/components/domain/badge/BadgeProgressCard', () => ({
  BadgeProgressCard: () => <div />,
}))
vi.mock('@/components/feature/my/BadgeUnlockModal', () => ({
  BadgeUnlockModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <button type="button" onClick={onClose}>
        배지 모달 닫기
      </button>
    ) : null,
}))
vi.mock('@/pages/MyPage/hooks/useMyQueries', () => ({
  useMyBadgeDetailQuery: () => ({
    data: undefined,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  }),
}))

import BadgeUnlockSection from '@/components/feature/my/BadgeUnlockSection'
import { MyApHistory } from '@/components/feature/my/MyApHistory'

function getRenderCount(mock: ReturnType<typeof vi.fn>, id: string) {
  return mock.mock.calls.filter(([value]) => value === id).length
}

describe('My interaction render boundaries', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    myMocks.renderBadgeItem.mockReset()
    myMocks.renderSummary.mockReset()
    myMocks.renderTransactionRow.mockReset()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('keeps the badge gallery outside the badge-modal open and close state', () => {
    const badges = [
      {
        id: 'badge-1',
        name: '첫 배지',
        isUnlocked: true,
        description: '',
        unlockedAt: '2026-08-13T00:00:00Z',
      },
      { id: 'badge-2', name: '잠긴 배지', isUnlocked: false, description: '', unlockedAt: null },
    ]

    act(() => {
      root.render(<BadgeUnlockSection badges={badges} initialBadgeId={null} />)
    })

    expect(getRenderCount(myMocks.renderBadgeItem, 'badge-1')).toBe(1)
    expect(getRenderCount(myMocks.renderBadgeItem, 'badge-2')).toBe(1)

    const badgeButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === '첫 배지',
    )
    if (!badgeButton) throw new Error('획득 배지 버튼을 찾을 수 없습니다.')

    act(() => badgeButton.click())

    expect(container.textContent).toContain('배지 모달 닫기')
    expect(getRenderCount(myMocks.renderBadgeItem, 'badge-1')).toBe(1)
    expect(getRenderCount(myMocks.renderBadgeItem, 'badge-2')).toBe(1)

    act(() => {
      Array.from(container.querySelectorAll('button'))
        .find((button) => button.textContent === '배지 모달 닫기')
        ?.click()
    })

    expect(getRenderCount(myMocks.renderBadgeItem, 'badge-1')).toBe(1)
    expect(getRenderCount(myMocks.renderBadgeItem, 'badge-2')).toBe(1)
  })

  it('keeps the AP summary and unchanged transaction rows outside the period-tab state', () => {
    act(() => {
      root.render(
        <MyApHistory
          summary={{ balance: 1_250, earned: 620, lost: 140 }}
          transactions={[
            { id: 'earned-1', amount: 100, createdAt: '', reason: 'ATTENDANCE', label: '출석' },
            { id: 'spent-1', amount: -50, createdAt: '', reason: 'CREDIT_LOAN', label: '대출' },
          ]}
        />,
      )
    })

    expect(myMocks.renderSummary).toHaveBeenCalledTimes(1)
    expect(getRenderCount(myMocks.renderTransactionRow, 'earned-1')).toBe(1)
    expect(getRenderCount(myMocks.renderTransactionRow, 'spent-1')).toBe(1)

    const earnedTab = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === '획득',
    )
    if (!earnedTab) throw new Error('획득 탭을 찾을 수 없습니다.')

    act(() => earnedTab.click())

    expect(myMocks.renderSummary).toHaveBeenCalledTimes(1)
    expect(getRenderCount(myMocks.renderTransactionRow, 'earned-1')).toBe(1)
    expect(getRenderCount(myMocks.renderTransactionRow, 'spent-1')).toBe(1)
    expect(container.textContent).not.toContain('spent-1')
  })
})
