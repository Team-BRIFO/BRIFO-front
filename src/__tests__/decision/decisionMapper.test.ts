import { describe, expect, it } from 'vitest'

import { mapDecisionList } from '@/mappers/decisionMapper'

const baseItem = {
  decisionId: '8fd2c732-b4f1-4b66-b53a-95b5f11df391',
  direction: 'UP' as const,
  confidenceLevel: 3,
  isSettled: false,
  agent: {
    agentId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
    agentType: 'ROOKIE' as const,
  },
  stock: {
    stockId: 'a3f1b6d2-1c44-4f0e-9c4e-2c1f4a9b7e10',
    name: '삼성전자',
    logoUrl: 'https://example.com/logo.png',
    price: 72420,
    changeRate: 2.1,
    tradeDate: '2026-08-20',
  },
}

describe('decisionMapper', () => {
  it('takes the settlement state from the server instead of the client clock', () => {
    const [pending, settled] = mapDecisionList([
      baseItem,
      { ...baseItem, decisionId: '3a1c9f18-6a2b-4a0d-8f5c-1d7e2b3c4a5f', isSettled: true },
    ])

    expect(pending?.isSettled).toBe(false)
    expect(settled?.isSettled).toBe(true)
  })

  it('keeps the settlement state even when the price snapshot is missing', () => {
    const [item] = mapDecisionList([
      {
        ...baseItem,
        isSettled: true,
        stock: { stockId: baseItem.stock.stockId, name: '삼성전자' },
      },
    ])

    expect(item?.isSettled).toBe(true)
    expect(item?.stock.changeRate).toBe(0)
    expect(item?.stock.logoUrl).toBeUndefined()
  })

  it('falls back to the lowest confidence level for out-of-range values', () => {
    const [item] = mapDecisionList([{ ...baseItem, confidenceLevel: 9 }])

    expect(item?.confidenceLevel).toBe(1)
  })
})
