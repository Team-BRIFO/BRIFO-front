/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sessionMocks = vi.hoisted(() => ({
  getAccessToken: vi.fn(),
  getMyPage: vi.fn(),
  getRefreshToken: vi.fn(),
}))

vi.mock('@/api/client/tokenStore', () => ({
  browserTokenStore: {
    getAccessToken: sessionMocks.getAccessToken,
    getRefreshToken: sessionMocks.getRefreshToken,
  },
}))

vi.mock('@/api/generated/endpoints/user-controller/user-controller', () => ({
  getMyPage: sessionMocks.getMyPage,
}))

import { useSessionValidationOnFocus } from '@/hooks/auth/useSessionValidationOnFocus'

function SessionValidationHarness() {
  useSessionValidationOnFocus()
  return null
}

function setVisibilityState(state: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    value: state,
  })
}

describe('useSessionValidationOnFocus', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    sessionMocks.getAccessToken.mockReset()
    sessionMocks.getRefreshToken.mockReset()
    sessionMocks.getMyPage.mockReset()
    sessionMocks.getAccessToken.mockReturnValue('access-token')
    sessionMocks.getRefreshToken.mockReturnValue('refresh-token')
    sessionMocks.getMyPage.mockResolvedValue(undefined)
    setVisibilityState('visible')
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  async function renderHarness() {
    await act(async () => {
      root.render(<SessionValidationHarness />)
      await Promise.resolve()
    })
  }

  it('validates on mount and when the document becomes visible again', async () => {
    await renderHarness()

    expect(sessionMocks.getMyPage).toHaveBeenCalledOnce()

    await act(async () => {
      setVisibilityState('hidden')
      document.dispatchEvent(new Event('visibilitychange'))
      await Promise.resolve()
    })
    expect(sessionMocks.getMyPage).toHaveBeenCalledOnce()

    await act(async () => {
      setVisibilityState('visible')
      document.dispatchEvent(new Event('visibilitychange'))
      await Promise.resolve()
    })
    expect(sessionMocks.getMyPage).toHaveBeenCalledTimes(2)
  })

  it('does not validate without any stored token', async () => {
    sessionMocks.getAccessToken.mockReturnValue(null)
    sessionMocks.getRefreshToken.mockReturnValue(null)

    await renderHarness()

    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
      await Promise.resolve()
    })
    expect(sessionMocks.getMyPage).not.toHaveBeenCalled()
  })

  it('does not start another validation while one is pending', async () => {
    let resolveRequest: (() => void) | undefined
    sessionMocks.getMyPage.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveRequest = resolve
        }),
    )

    await renderHarness()
    expect(sessionMocks.getMyPage).toHaveBeenCalledOnce()

    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
      await Promise.resolve()
    })
    expect(sessionMocks.getMyPage).toHaveBeenCalledOnce()

    await act(async () => {
      resolveRequest?.()
      await Promise.resolve()
    })
  })
})
