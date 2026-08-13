/** @vitest-environment jsdom */

import type * as React from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const homeMocks = vi.hoisted(() => ({
  renderCardNewsSection: vi.fn(),
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
vi.mock('@/components/feature/home/AttendanceBonusCard', () => ({ default: () => <div /> }))
vi.mock('@/components/feature/home/AttendanceModal', () => ({ default: () => null }))
vi.mock('@/components/feature/home/HomeHeader', () => ({ default: () => <div /> }))
vi.mock('@/components/feature/home/OfficeCard', () => ({ default: () => <div /> }))
vi.mock('@/components/feature/home/PredictionCard', () => ({ default: () => <div /> }))
vi.mock('@/components/feature/home/HomeCardNewsSection', () => ({
  default: () => {
    homeMocks.renderCardNewsSection()
    return <div data-testid="card-news-section" />
  },
}))
vi.mock('@/hooks/queries/ap/useApQueries', () => ({
  useCreateAttendanceRewardMutation: () => ({ isPending: false, mutate: vi.fn() }),
}))
vi.mock('@/pages/HomePage/hooks/useUserHomeQuery', () => ({
  useUserHomeQuery: () => ({
    data: {
      user: { balanceAp: 100, nickname: '브리포', companyName: '브리포 주식회사' },
      agents: [],
      todayDecisions: { count: 0 },
      todayNewsCards: { items: [], batchTime: null },
      weeklyAttendanceDays: 0,
      dates: [],
      attendedToday: false,
    },
  }),
}))

import { HomePage } from '@/pages/HomePage/HomePage'

describe('HomePage render boundary', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-13T06:20:00.000Z'))
    homeMocks.renderCardNewsSection.mockReset()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.useRealTimers()
  })

  it('keeps the card-news section outside the one-second settlement countdown updates', () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>,
      )
    })

    expect(homeMocks.renderCardNewsSection).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(2_000)
    })

    expect(homeMocks.renderCardNewsSection).toHaveBeenCalledTimes(1)
    expect(container.textContent).toContain('00:09:58')
  })
})
