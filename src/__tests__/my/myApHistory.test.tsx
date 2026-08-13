import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { MyApHistory } from '@/components/feature/my/MyApHistory'

const summary = { balance: 1_250, earned: 620, lost: 140 }

describe('MyApHistory', () => {
  it('does not claim a filtered history is empty while more server pages remain', () => {
    const markup = renderToStaticMarkup(<MyApHistory summary={summary} transactions={[]} hasNext />)

    expect(markup).toContain('아직 불러온 내역에는 해당 항목이 없어요.')
    expect(markup).toContain('더 보기')
    expect(markup).not.toContain('해당 내역이 없어요.</p>')
  })

  it('shows the final empty state after every server page has loaded', () => {
    const markup = renderToStaticMarkup(<MyApHistory summary={summary} transactions={[]} />)

    expect(markup).toContain('해당 내역이 없어요.')
    expect(markup).not.toContain('더 보기')
  })
})
