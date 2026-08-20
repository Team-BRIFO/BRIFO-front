/** @vitest-environment jsdom */

import type * as React from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const termMocks = vi.hoisted(() => ({
  markAsLearned: vi.fn(),
  isLearned: false,
}))

vi.mock('@/hooks/queries/term/useTermQueries', () => ({
  useGetTermDetail: () => ({
    data: {
      termId: '62ef76f1-8d61-49f4-8d1d-75b123c68e1a',
      term: '순매수',
      definition: '산 금액이 판 금액보다 많은 상태예요.',
      category: '수급',
      isLearned: termMocks.isLearned,
    },
    isLoading: false,
    error: undefined,
    refetch: vi.fn(),
  }),
  usePutMyTerm: () => ({
    mutate: termMocks.markAsLearned,
    isPending: false,
    error: undefined,
  }),
}))
vi.mock('@/components/domain/agent/AgentChat', () => ({
  AgentChat: ({ message }: { message: string }) => <p>{message}</p>,
}))

import { GlossaryBottomSheet } from '@/components/feature/glossary/GlossaryBottomSheet'
import { GlossaryStatusBadge } from '@/components/feature/glossary/GlossaryStatusBadge'

const term = { termId: '62ef76f1-8d61-49f4-8d1d-75b123c68e1a', surface: '순매수', displayOrder: 0 }

describe('GlossaryStatusBadge', () => {
  it('shows the saved badge only for a term that is actually saved', () => {
    expect(renderToStaticMarkup(<GlossaryStatusBadge isLearned />)).toContain(
      '내 용어장에 저장했어요',
    )
    expect(renderToStaticMarkup(<GlossaryStatusBadge isLearned={false} />)).toBe('')
  })
})

describe('GlossaryBottomSheet', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    termMocks.markAsLearned.mockReset()
    termMocks.isLearned = false
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function renderSheet(onClose: () => void) {
    act(() => {
      root.render(<GlossaryBottomSheet isOpen onClose={onClose} term={term} />)
    })
  }

  function clickOverlay() {
    const overlay = document.querySelector('[role="dialog"]')?.parentElement
    act(() => overlay?.dispatchEvent(new MouseEvent('click', { bubbles: true })))
  }

  it('saves the term to the glossary when dismissed without pressing the button', () => {
    const onClose = vi.fn()
    renderSheet(onClose)

    clickOverlay()

    expect(termMocks.markAsLearned).toHaveBeenCalledWith(term.termId)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not save again for a term that is already in the glossary', () => {
    termMocks.isLearned = true
    const onClose = vi.fn()
    renderSheet(onClose)

    clickOverlay()

    expect(termMocks.markAsLearned).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('still saves from the 이해했어요 button', () => {
    renderSheet(vi.fn())

    const button = [...document.querySelectorAll('button')].find(
      (element) => element.textContent === '이해했어요',
    )
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })))

    expect(termMocks.markAsLearned).toHaveBeenCalledWith(term.termId)
  })
})
