/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mutationMocks = vi.hoisted(() => ({
  completeOnboarding: vi.fn(),
  createTutorialReward: vi.fn(),
}))

vi.mock('@/pages/TutorialPage/hooks/useCompleteOnboardingMutation', () => ({
  useCompleteOnboardingMutation: () => ({
    mutate: mutationMocks.completeOnboarding,
    isPending: false,
    error: null,
  }),
}))

vi.mock('@/pages/TutorialPage/hooks/useCreateTutorialRewardMutation', () => ({
  useCreateTutorialRewardMutation: () => ({
    mutate: mutationMocks.createTutorialReward,
    isPending: false,
    error: null,
  }),
}))

vi.mock('@/components/feature/tutorial/TutorialStepLayout', () => ({
  default: ({
    buttonLabel = '다음',
    onNext,
    onSkip,
  }: {
    buttonLabel?: string
    onNext: () => void
    onSkip: () => void
  }) => (
    <div>
      <button type="button" onClick={onNext}>
        {buttonLabel}
      </button>
      <button type="button" onClick={onSkip}>
        건너뛰기
      </button>
    </div>
  ),
}))

vi.mock('@/components/feature/tutorial/TutorialComplete', () => ({
  default: ({ onComplete }: { onComplete: () => void }) => (
    <button type="button" onClick={onComplete}>
      설정으로 돌아가기
    </button>
  ),
}))

import { TUTORIAL_STEPS } from '@/constants/tutorialSteps'
import { TutorialPage } from '@/pages/TutorialPage/TutorialPage'
import { PATH } from '@/routes/paths'

function CurrentPath() {
  const { pathname } = useLocation()
  return <output data-testid="current-path">{pathname}</output>
}

function getButtonByLabel(label: string) {
  const button = Array.from(document.querySelectorAll('button')).find(
    (element) => element.textContent?.trim() === label,
  )

  if (!button) throw new Error(`"${label}" 버튼을 찾을 수 없습니다.`)
  return button
}

describe('tutorial replay completion', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    mutationMocks.completeOnboarding.mockReset()
    mutationMocks.createTutorialReward.mockReset()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  const renderReplay = () => {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={[PATH.TUTORIAL_REPLAY]}>
          <TutorialPage />
          <CurrentPath />
        </MemoryRouter>,
      )
    })
  }

  const expectSettingsNavigationWithoutOnboardingMutations = () => {
    expect(container.querySelector('[data-testid="current-path"]')?.textContent).toBe(
      PATH.MY_SETTINGS,
    )
    expect(mutationMocks.completeOnboarding).not.toHaveBeenCalled()
    expect(mutationMocks.createTutorialReward).not.toHaveBeenCalled()
  }

  it('returns to settings without granting rewards when the replay is skipped', () => {
    renderReplay()

    act(() => getButtonByLabel('건너뛰기').click())

    expectSettingsNavigationWithoutOnboardingMutations()
  })

  it('returns to settings without onboarding side effects after the replay is completed', () => {
    renderReplay()

    TUTORIAL_STEPS.forEach((step) => {
      act(() => getButtonByLabel(step.buttonLabel ?? '다음').click())
    })
    act(() => getButtonByLabel('설정으로 돌아가기').click())

    expectSettingsNavigationWithoutOnboardingMutations()
  })
})
