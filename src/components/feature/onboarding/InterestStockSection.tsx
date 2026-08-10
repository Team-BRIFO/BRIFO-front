import { useMemo } from 'react'

import { TextField } from '@/components/common/TextField'
import StockRankItem from '@/components/domain/stock/StockRankItem'
import type { OnboardingStock } from '@/pages/OnboardingPage/mockStocks'

interface InterestStockSectionProps {
  stocks: OnboardingStock[]
  searchKeyword: string
  selectedStockIds: string[]
  onToggleStock: (stockId: string) => void
  onOpenSearch: () => void
  errorMessage?: string
}

export default function InterestStockSection({
  stocks,
  searchKeyword,
  selectedStockIds,
  onToggleStock,
  onOpenSearch,
  errorMessage,
}: InterestStockSectionProps) {
  const filteredStocks = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase()

    if (!normalizedKeyword) return stocks

    return stocks.filter((stock) => stock.name.toLowerCase().includes(normalizedKeyword))
  }, [searchKeyword, stocks])

  const selectedStocks = useMemo(
    () => stocks.filter((stock) => selectedStockIds.includes(stock.id)),
    [selectedStockIds, stocks],
  )

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
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
      </div>
    </section>
  )
}
