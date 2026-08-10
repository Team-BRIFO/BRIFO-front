import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/assets/characters/celebration.svg?react', () => ({ default: () => null }))

import TutorialComplete from '@/components/feature/tutorial/TutorialComplete'

describe('tutorial replay completion', () => {
  it('does not show or grant the onboarding reward and clearly returns the user to settings', () => {
    const markup = renderToStaticMarkup(<TutorialComplete isReplay onComplete={() => {}} />)

    expect(markup).toContain('튜토리얼을 다시 살펴봤어요!')
    expect(markup).toContain('설정으로 돌아가기')
    expect(markup).not.toContain('튜토리얼 보상')
    expect(markup).not.toContain('+ 200 AP')
  })
})
