import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { MyGlossaryList } from '@/components/feature/my/MyGlossaryList'

describe('MyGlossaryList', () => {
  it('renders learned terms as keyboard-accessible detail actions without changing the list state', () => {
    const markup = renderToStaticMarkup(
      <MyGlossaryList
        learnedTermCount={1}
        entries={[
          {
            termId: '62ef76f1-8d61-49f4-8d1d-75b123c68e1a',
            term: '순매수',
            definition: '산 금액이 판 금액보다 많은 상태예요.',
            category: '수급',
            learnedAt: '2026-08-10T10:00:00',
          },
        ]}
        isEmpty={false}
        onSelectEntry={() => {}}
      />,
    )

    expect(markup).toContain('type="button"')
    expect(markup).toContain('순매수')
    expect(markup).toContain('산 금액이 판 금액보다 많은 상태예요.')
  })
})
