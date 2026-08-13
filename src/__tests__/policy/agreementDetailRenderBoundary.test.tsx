/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const policyMocks = vi.hoisted(() => ({
  renderStatusBar: vi.fn(),
}))

vi.mock('@/components/common/Button', () => ({
  default: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}))
vi.mock('@/components/common/StatusBar', () => ({
  StatusBar: ({ left, title }: { left?: React.ReactNode; title?: React.ReactNode }) => {
    policyMocks.renderStatusBar()
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
vi.mock('@/hooks/queries/policy/usePolicyQueries', () => ({
  usePolicyDetailQuery: () => ({
    data: undefined,
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
}))

import AgreementDetailPage from '@/pages/AgreementPage/AgreementDetailPage'
import { PATH } from '@/routes/paths'

describe('Agreement detail render boundary', () => {
  let root: Root
  let container: HTMLDivElement
  let originalClientHeight: PropertyDescriptor | undefined
  let originalScrollHeight: PropertyDescriptor | undefined

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    policyMocks.renderStatusBar.mockReset()
    originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')
    originalScrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight')
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 100 })
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 500 })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    if (originalClientHeight) {
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight)
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight')
    }
    if (originalScrollHeight) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight)
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollHeight')
    }
  })

  it('keeps the agreement header outside the scroll-completion state', () => {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={[PATH.AGREEMENT_DETAIL]}>
          <Routes>
            <Route path={PATH.AGREEMENT_DETAIL} element={<AgreementDetailPage />} />
          </Routes>
        </MemoryRouter>,
      )
    })

    expect(policyMocks.renderStatusBar).toHaveBeenCalledTimes(1)

    const scrollContainer = container.querySelector<HTMLElement>('div.overflow-y-auto')
    if (!scrollContainer) throw new Error('약관 스크롤 영역을 찾을 수 없습니다.')
    Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, value: 400 })

    act(() => scrollContainer.dispatchEvent(new Event('scroll')))

    expect(policyMocks.renderStatusBar).toHaveBeenCalledTimes(1)
  })
})
