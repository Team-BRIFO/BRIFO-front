/** @vitest-environment jsdom */

import type * as React from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const homeMocks = vi.hoisted(() => ({
  renderCardNews: vi.fn(),
  renderHeader: vi.fn(),
  renderOfficeCard: vi.fn(),
  renderPredictionCard: vi.fn(),
}))

vi.mock('@/assets/logo/brifo_logo_small.svg?react', () => ({ default: () => <svg /> }))
vi.mock('@/components/common/StatusBar', () => ({
  StatusBar: ({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) => (
    <header>
      {left}
      {right}
    </header>
  ),
  StatusBarNotificationButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" aria-label="알림" {...props} />
  ),
}))
vi.mock('@/components/feature/home/AttendanceBonusCard', () => ({
  default: ({ onClick }: { onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      출석 보상 받기
    </button>
  ),
}))
vi.mock('@/components/feature/home/AttendanceModal', () => ({
  default: ({ isOpen }: { isOpen: boolean }) => (isOpen ? <div>출석 모달</div> : null),
}))
vi.mock('@/components/feature/home/HomeCardNewsSection', () => ({
  default: () => {
    homeMocks.renderCardNews()
    return <div />
  },
}))
vi.mock('@/components/feature/home/HomeHeader', () => ({
  default: () => {
    homeMocks.renderHeader()
    return <div />
  },
}))
vi.mock('@/components/feature/home/OfficeCard', () => ({
  default: () => {
    homeMocks.renderOfficeCard()
    return <div />
  },
}))
vi.mock('@/components/feature/home/PredictionCard', () => ({
  default: () => {
    homeMocks.renderPredictionCard()
    return <div />
  },
}))
vi.mock('@/components/feature/home/SettlementCountdownCard', () => ({ default: () => <div /> }))
vi.mock('@/hooks/queries/ap/useApQueries', () => ({
  useCreateAttendanceRewardMutation: () => ({ isPending: false, mutate: vi.fn() }),
}))
vi.mock('@/pages/OfficePage/hooks/useOfficeBriefingsQuery', () => ({
  useOfficeBriefingsQuery: () => ({ data: [] }),
}))
vi.mock('@/pages/HomePage/hooks/useUserHomeQuery', () => ({
  useUserHomeQuery: () => ({
    data: {
      user: { balanceAp: 100, nickname: '브리포', companyName: '브리포 주식회사' },
      agents: [],
      todayDecisions: { count: 0 },
      todayNewsCards: { items: [], batchTime: null },
      weeklyAttendanceDays: 1,
      dates: ['2026-08-13'],
      attendedToday: false,
    },
  }),
}))

import { HomePage } from '@/pages/HomePage/HomePage'

describe('Home attendance reward render boundary', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    homeMocks.renderCardNews.mockReset()
    homeMocks.renderHeader.mockReset()
    homeMocks.renderOfficeCard.mockReset()
    homeMocks.renderPredictionCard.mockReset()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('keeps unrelated home cards outside the attendance-modal open state', () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>,
      )
    })

    expect(homeMocks.renderHeader).toHaveBeenCalledTimes(1)
    expect(homeMocks.renderOfficeCard).toHaveBeenCalledTimes(1)
    expect(homeMocks.renderPredictionCard).toHaveBeenCalledTimes(1)
    expect(homeMocks.renderCardNews).toHaveBeenCalledTimes(1)

    const attendanceButton = container.querySelector<HTMLButtonElement>('button:not([aria-label])')
    if (!attendanceButton) throw new Error('출석 보상 버튼을 찾을 수 없습니다.')

    act(() => attendanceButton.click())

    expect(container.textContent).toContain('출석 모달')
    expect(homeMocks.renderHeader).toHaveBeenCalledTimes(1)
    expect(homeMocks.renderOfficeCard).toHaveBeenCalledTimes(1)
    expect(homeMocks.renderPredictionCard).toHaveBeenCalledTimes(1)
    expect(homeMocks.renderCardNews).toHaveBeenCalledTimes(1)
  })
})
