import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { NewsCardPointList } from '@/components/domain/newsCard/NewsCardPointList'
import type { GlossaryTerm } from '@/types/domain/glossary'

function countOccurrences(html: string, needle: string): number {
  return html.split(needle).length - 1
}

describe('NewsCardPointList term highlighting', () => {
  it('highlights only the first occurrence of a term repeated within one line', () => {
    const terms: GlossaryTerm[] = [{ termId: 'term-1', surface: '순매수', displayOrder: 1 }]

    const html = renderToStaticMarkup(
      <NewsCardPointList
        points={['외국인 순매수가 이어지며 순매수 규모가 커졌다']}
        terms={terms}
      />,
    )

    expect(countOccurrences(html, 'bg-Yellow-80')).toBe(1)
    expect(countOccurrences(html, '순매수')).toBe(2)
  })

  it('highlights only the first occurrence across multiple lines', () => {
    const terms: GlossaryTerm[] = [{ termId: 'term-1', surface: 'PER', displayOrder: 1 }]

    const html = renderToStaticMarkup(
      <NewsCardPointList
        points={['PER이 낮아졌다', '업종 평균 PER과 비교하면 여전히 낮다']}
        terms={terms}
      />,
    )

    expect(countOccurrences(html, 'bg-Yellow-80')).toBe(1)
  })

  it('still highlights each distinct term once', () => {
    const terms: GlossaryTerm[] = [
      { termId: 'term-1', surface: 'PER', displayOrder: 1 },
      { termId: 'term-2', surface: '순매수', displayOrder: 2 },
    ]

    const html = renderToStaticMarkup(
      <NewsCardPointList points={['PER과 순매수가 함께 상승했다']} terms={terms} />,
    )

    expect(countOccurrences(html, 'bg-Yellow-80')).toBe(2)
  })
})
