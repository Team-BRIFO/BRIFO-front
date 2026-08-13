/** @vitest-environment jsdom */

import type * as React from 'react'
import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const badgeMocks = vi.hoisted(() => ({
  data: undefined as unknown,
}))

vi.mock('@/components/feature/my/BadgeUnlockSection', () => ({
  default: ({ initialBadgeId }: { initialBadgeId: string | null }) => (
    <output>{initialBadgeId}</output>
  ),
}))
vi.mock('@/components/feedback/PageErrorView', () => ({ PageErrorView: () => <div>오류</div> }))
vi.mock('@/components/feedback/PageLoadingView', () => ({ PageLoadingView: () => <div>로딩</div> }))
vi.mock('@/pages/MyPage/MyPageLayout', () => ({
  MyPageLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}))
vi.mock('@/pages/MyPage/hooks/useMyQueries', () => ({
  useMyBadgesQuery: () => ({
    data: badgeMocks.data,
    error: undefined,
    fetchStatus: 'idle',
    refetch: vi.fn(),
  }),
}))

import { MyBadgePage } from '@/pages/MyPage/MyBadgePage'

function BadgePageHarness() {
  const [, forceUpdate] = useState(0)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          badgeMocks.data = []
          forceUpdate((value) => value + 1)
        }}
      >
        배지 목록 로드
      </button>
      <MyBadgePage />
    </>
  )
}

describe('MyBadgePage deep link', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    badgeMocks.data = undefined
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('keeps a new badge ID until a pending badge list finishes loading', () => {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/my/badges?newBadgeId=badge-1']}>
          <BadgePageHarness />
        </MemoryRouter>,
      )
    })

    expect(container.textContent).toContain('로딩')

    act(() => {
      Array.from(container.querySelectorAll('button'))
        .find((button) => button.textContent === '배지 목록 로드')
        ?.click()
    })

    expect(container.querySelector('output')?.textContent).toBe('badge-1')
  })
})
