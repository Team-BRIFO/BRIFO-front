/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const settingsMocks = vi.hoisted(() => ({
  renderSettings: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ clear: vi.fn() }),
}))
vi.mock('@/components/common/MenuRow', () => ({
  MenuRow: ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  ),
  MenuRowGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/feature/my/AccountConfirmModal', () => ({
  AccountConfirmModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <button type="button" onClick={onClose}>
        계정 모달 닫기
      </button>
    ) : null,
}))
vi.mock('@/components/feature/my/MySettings', () => ({
  MySettings: ({ accountManagement }: { accountManagement?: React.ReactNode }) => {
    settingsMocks.renderSettings()
    return <div>{accountManagement}</div>
  },
}))
vi.mock('@/pages/MyPage/MyPageLayout', () => ({
  MyPageLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}))
vi.mock('@/pages/MyPage/hooks/useDeleteMyAccountMutation', () => ({
  useDeleteMyAccountMutation: () => ({
    isError: false,
    isPending: false,
    mutate: vi.fn(),
    reset: vi.fn(),
  }),
}))
vi.mock('@/pages/MyPage/hooks/useLogoutMutation', () => ({
  useLogoutMutation: () => ({
    isError: false,
    isPending: false,
    mutate: vi.fn(),
  }),
}))

import { MySettingsPage } from '@/pages/MyPage/MySettingsPage'

describe('Settings render boundary', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    settingsMocks.renderSettings.mockReset()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('keeps the settings menu outside the account-confirmation modal state', () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <MySettingsPage />
        </MemoryRouter>,
      )
    })

    expect(settingsMocks.renderSettings).toHaveBeenCalledTimes(1)

    const logoutButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === '로그아웃',
    )
    if (!logoutButton) throw new Error('로그아웃 버튼을 찾을 수 없습니다.')

    act(() => logoutButton.click())

    expect(container.textContent).toContain('계정 모달 닫기')
    expect(settingsMocks.renderSettings).toHaveBeenCalledTimes(1)

    act(() => {
      Array.from(container.querySelectorAll('button'))
        .find((button) => button.textContent === '계정 모달 닫기')
        ?.click()
    })

    expect(settingsMocks.renderSettings).toHaveBeenCalledTimes(1)
  })
})
