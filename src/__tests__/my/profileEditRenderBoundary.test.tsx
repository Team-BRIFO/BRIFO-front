/** @vitest-environment jsdom */

import { act, useCallback, useMemo, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { InterestStockOption } from '@/types/domain/stock'

const profileMocks = vi.hoisted(() => ({
  renderChip: vi.fn(),
  renderStockRankItem: vi.fn(),
  renderTextField: vi.fn(),
}))

vi.mock('@/assets/images/not_found.svg?react', () => ({ default: () => <svg /> }))
vi.mock('@/components/common/Button', () => ({
  default: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}))
vi.mock('@/components/common/Chip', () => ({
  Chip: ({
    children,
    onRemove,
  }: {
    children: React.ReactNode
    onRemove?: React.MouseEventHandler<HTMLButtonElement>
  }) => {
    const name = String(children)
    profileMocks.renderChip(name)

    return (
      <button type="button" aria-label={`${name} 삭제`} onClick={onRemove}>
        {children}
      </button>
    )
  },
}))
vi.mock('@/components/common/Image', () => ({ Image: () => <img alt="" /> }))
vi.mock('@/components/common/StatusBar', () => ({
  StatusBar: ({ children }: { children?: React.ReactNode }) => <header>{children}</header>,
  StatusBarBackButton: () => <button type="button" />,
}))
vi.mock('@/components/common/TextField', () => ({
  TextField: ({
    label,
    name,
    onChange,
    value,
  }: {
    label?: string
    name?: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    value: string
  }) => {
    const identifier = label ?? name ?? 'unnamed'
    profileMocks.renderTextField(identifier)

    return <input aria-label={identifier} value={value} onChange={onChange} />
  },
}))
vi.mock('@/components/domain/agent/AgentAvatar', () => ({ AgentAvatar: () => <div /> }))
vi.mock('@/components/domain/stock/StockRankItem', () => ({
  default: ({ name, onClick }: { name: string; onClick?: () => void }) => {
    profileMocks.renderStockRankItem(name)

    return (
      <button type="button" data-stock-name={name} onClick={onClick}>
        {name}
      </button>
    )
  },
}))

import StockSearchView from '@/components/feature/interest-stock/StockSearchView'
import { MyProfileEdit } from '@/components/feature/my/MyProfileEdit'

const STOCKS: InterestStockOption[] = [
  { id: 'stock-1', name: '삼성전자', price: '100,000원', changeRate: 1.5, logoUrl: '' },
  { id: 'stock-2', name: 'SK하이닉스', price: '200,000원', changeRate: 2.5, logoUrl: '' },
  { id: 'stock-3', name: '현대차', price: '300,000원', changeRate: -1.5, logoUrl: '' },
]

const noop = () => {}

function StockSelectionHarness() {
  const [selectedStockIds, setSelectedStockIds] = useState(['stock-1'])
  const selectedStocks = useMemo(
    () => STOCKS.filter((stock) => selectedStockIds.includes(stock.id)),
    [selectedStockIds],
  )
  const handleToggleStock = useCallback((stockId: string) => {
    setSelectedStockIds((current) =>
      current.includes(stockId) ? current.filter((id) => id !== stockId) : [...current, stockId],
    )
  }, [])

  return (
    <StockSearchView
      embedded
      stocks={STOCKS}
      searchKeyword=""
      selectedStockIds={selectedStockIds}
      selectedStocks={selectedStocks}
      onSearchKeywordChange={noop}
      onToggleStock={handleToggleStock}
      onBack={noop}
      onComplete={noop}
    />
  )
}

function getRenderCount(mock: ReturnType<typeof vi.fn>, identifier: string) {
  return mock.mock.calls.filter(([name]) => name === identifier).length
}

function changeInput(input: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  if (!valueSetter) throw new Error('input value setter를 찾을 수 없습니다.')

  valueSetter.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('Profile edit render boundaries', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    ;(
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true
    profileMocks.renderChip.mockReset()
    profileMocks.renderStockRankItem.mockReset()
    profileMocks.renderTextField.mockReset()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('re-renders only the edited text field', () => {
    act(() => {
      root.render(
        <MyProfileEdit
          initialValues={{
            nickname: '브리포',
            companyName: '브리포 투자사',
            interestStocks: [
              { id: 'stock-1', name: '삼성전자' },
              { id: 'stock-2', name: 'SK하이닉스' },
            ],
          }}
          characterType="rookie"
          onSubmit={noop}
          onAddStock={noop}
        />,
      )
    })

    expect(getRenderCount(profileMocks.renderTextField, '닉네임')).toBe(1)
    expect(getRenderCount(profileMocks.renderTextField, '회사명')).toBe(1)
    expect(getRenderCount(profileMocks.renderChip, '삼성전자')).toBe(1)
    expect(getRenderCount(profileMocks.renderChip, 'SK하이닉스')).toBe(1)

    const nicknameInput = container.querySelector<HTMLInputElement>('input[aria-label="닉네임"]')
    if (!nicknameInput) throw new Error('닉네임 입력 필드를 찾을 수 없습니다.')

    act(() => {
      changeInput(nicknameInput, '새 브리포')
    })

    expect(getRenderCount(profileMocks.renderTextField, '닉네임')).toBe(2)
    expect(getRenderCount(profileMocks.renderTextField, '회사명')).toBe(1)
    expect(getRenderCount(profileMocks.renderChip, '삼성전자')).toBe(1)
    expect(getRenderCount(profileMocks.renderChip, 'SK하이닉스')).toBe(1)
  })

  it('does not show a profile photo change control', () => {
    act(() => {
      root.render(
        <MyProfileEdit
          initialValues={{
            nickname: '브리포',
            companyName: '브리포 투자사',
            interestStocks: [{ id: 'stock-1', name: '삼성전자' }],
          }}
          characterType="rookie"
          onSubmit={noop}
          onAddStock={noop}
        />,
      )
    })

    expect(container.textContent).not.toContain('사진 변경')
  })

  it('re-renders only the stock row whose selection changed', () => {
    act(() => {
      root.render(<StockSelectionHarness />)
    })

    expect(getRenderCount(profileMocks.renderStockRankItem, '삼성전자')).toBe(1)
    expect(getRenderCount(profileMocks.renderStockRankItem, 'SK하이닉스')).toBe(1)
    expect(getRenderCount(profileMocks.renderStockRankItem, '현대차')).toBe(1)

    const stockButton = container.querySelector<HTMLButtonElement>(
      'button[data-stock-name="SK하이닉스"]',
    )
    if (!stockButton) throw new Error('관심종목 행을 찾을 수 없습니다.')

    act(() => stockButton.click())

    expect(getRenderCount(profileMocks.renderStockRankItem, '삼성전자')).toBe(1)
    expect(getRenderCount(profileMocks.renderStockRankItem, 'SK하이닉스')).toBe(2)
    expect(getRenderCount(profileMocks.renderStockRankItem, '현대차')).toBe(1)
  })
})
