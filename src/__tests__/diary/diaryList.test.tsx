import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { DiaryList } from '@/components/feature/diary/DiaryList'

const entry = {
  id: '1bcbac27-b08b-452e-a88a-3b7a41c1fe54',
  stockId: '62ef76f1-8d61-49f4-8d1d-75b123c68e1a',
  stockName: '삼성전자',
  direction: 'up' as const,
  isCorrect: true,
  apDelta: 100,
  price: 70_000,
  changeRate: 1.2,
  date: '2026-08-10',
  logoUrl: undefined,
}

describe('DiaryList load-more state', () => {
  it('keeps loaded decision cards visible and offers a retry when the next cursor page fails', () => {
    const markup = renderToStaticMarkup(
      <DiaryList entries={[entry]} hasNext loadMoreError onLoadMore={() => {}} />,
    )

    expect(markup).toContain('삼성전자')
    expect(markup).toContain('추가 결정 기록을 불러오지 못했어요.')
    expect(markup).toContain('다시 시도')
  })
})
