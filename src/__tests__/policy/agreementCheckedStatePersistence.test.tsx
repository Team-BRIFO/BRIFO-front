/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components/common/Button', () => ({
  default: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}))
vi.mock('@/components/common/StatusBar', () => ({
  StatusBar: ({ left, title }: { left?: React.ReactNode; title?: React.ReactNode }) => (
    <header>
      {left}
      {title}
    </header>
  ),
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

/** 동의 화면으로 돌아왔을 때 넘어온 라우터 state를 그대로 드러내는 검사용 화면. */
function AgreementStateProbe() {
  const location = useLocation()

  return <output data-testid="agreement-state">{JSON.stringify(location.state)}</output>
}

describe('약관 상세를 다녀와도 체크 상태가 유지된다', () => {
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

  it('확인하지 않고 뒤로 가도 이전 체크를 그대로 돌려준다', () => {
    const checked = {
      age: true,
      service: true,
      privacy: false,
      investment: false,
      marketing: false,
    }

    act(() => {
      root.render(
        <MemoryRouter
          initialEntries={[
            { pathname: PATH.AGREEMENT_DETAIL, state: { agreementId: 'privacy', checked } },
          ]}
        >
          <Routes>
            <Route path={PATH.AGREEMENT_DETAIL} element={<AgreementDetailPage />} />
            <Route path={PATH.AGREEMENT} element={<AgreementStateProbe />} />
          </Routes>
        </MemoryRouter>,
      )
    })

    const backButton = container.querySelector<HTMLButtonElement>('button[aria-label="뒤로 가기"]')
    expect(backButton).not.toBeNull()

    act(() => backButton?.click())

    const probe = container.querySelector('[data-testid="agreement-state"]')
    expect(probe).not.toBeNull()
    // navigate(-1)로 돌아가면 동의 화면이 초기 상태로 다시 마운트돼 age·service 체크가 풀렸다.
    expect(JSON.parse(probe?.textContent ?? 'null')).toEqual({ checked })
  })
})
