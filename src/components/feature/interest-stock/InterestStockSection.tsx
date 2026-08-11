import { useMemo } from 'react'

import { TextField } from '@/components/common/TextField'
import StockRankItem from '@/components/domain/stock/StockRankItem'
import type { InterestStockOption } from '@/types/domain/stock'
import { MAX_INTEREST_STOCK_COUNT } from '@/utils/profileValidation'

interface InterestStockSectionProps {
  stocks: InterestStockOption[]
  searchKeyword: string
  selectedStockIds: string[]
  selectedStocks?: Pick<InterestStockOption, 'id' | 'name'>[]
  onToggleStock: (stockId: string) => void
  onOpenSearch: () => void
  errorMessage?: string
}

export default function InterestStockSection({
  stocks,
  searchKeyword,
  selectedStockIds,
  selectedStocks: selectedStocksProp,
  onToggleStock,
  onOpenSearch,
  errorMessage,
}: InterestStockSectionProps) {
  const filteredStocks = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase()

    if (!normalizedKeyword) return stocks

    return stocks.filter((stock) => stock.name.toLowerCase().includes(normalizedKeyword))
  }, [searchKeyword, stocks])

  const selectedStocks =
    selectedStocksProp ?? stocks.filter((stock) => selectedStockIds.includes(stock.id))
  const hasReachedSelectionLimit = selectedStockIds.length >= MAX_INTEREST_STOCK_COUNT

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenSearch()
    }
  }

  return (
    <section className="mt-8">
      <div
        role="button"
        tabIndex={0}
        aria-label="관심종목 검색 열기"
        onClick={onOpenSearch}
        onKeyDown={handleSearchKeyDown}
        className="focus-visible:ring-Yellow-45 cursor-pointer rounded-lg focus-visible:ring-2 focus-visible:outline-none"
      >
        <div className="pointer-events-none">
          <TextField
            name="stockSearch"
            variant="search"
            label="관심종목"
            value={searchKeyword}
            placeholder="코스피 200 종목 검색"
            readOnly
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="mt-5">
        <h2 className="pretendard-Caption1 text-Yellow-30">현재 인기 종목</h2>

        <div className="border-Gray-2 mt-3 overflow-hidden rounded-xl border">
          {filteredStocks.length > 0 ? (
            filteredStocks.map((stock, index) => (
              <div key={stock.id} className="border-Gray-2 border-b last:border-b-0">
                <StockRankItem
                  rank={index + 1}
                  logo={
                    <img
                      src={stock.logoUrl}
                      alt={`${stock.name} 로고`}
                      className="h-full w-full object-cover"
                    />
                  }
                  name={stock.name}
                  price={stock.price}
                  changeRate={stock.changeRate}
                  isFavorite={selectedStockIds.includes(stock.id)}
                  disabled={hasReachedSelectionLimit && !selectedStockIds.includes(stock.id)}
                  disabledMessage={
                    hasReachedSelectionLimit && !selectedStockIds.includes(stock.id)
                      ? '관심종목은 최대 3개까지 선택할 수 있어요.'
                      : undefined
                  }
                  onToggleFavorite={() => onToggleStock(stock.id)}
                  onClick={() => onToggleStock(stock.id)}
                />
              </div>
            ))
          ) : (
            <div className="pretendard-Body2-Regular text-Gray-5 flex h-24 items-center justify-center">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <h2 className="pretendard-Body2-Medium text-Yellow-30 font-semibold">나의 관심종목</h2>

        {selectedStocks.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedStocks.map((stock) => (
              <button
                key={stock.id}
                type="button"
                onClick={() => onToggleStock(stock.id)}
                className="pretendard-Caption2 bg-Yellow-100 text-Yellow-20 flex items-center gap-2 rounded-full px-3 py-1.5"
              >
                <span>{stock.name}</span>
                <span aria-hidden="true">×</span>
                <span className="sr-only">{stock.name} 관심 종목 해제</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="pretendard-Caption2 text-Gray-5 mt-3">{/*확인 필요*/}</p>
        )}

        {errorMessage && (
          <p role="alert" className="pretendard-Caption2 text-Pink-30 mt-3">
            {errorMessage}
          </p>
        )}

        {hasReachedSelectionLimit && (
          <p role="status" className="pretendard-Caption2 text-Gray-6 mt-3">
            관심종목은 최대 3개까지 선택할 수 있어요. 선택한 종목을 해제하면 다른 종목을 추가할 수
            있어요.
          </p>
        )}
      </div>
    </section>
  )
}
