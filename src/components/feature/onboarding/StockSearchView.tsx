import { useMemo } from 'react'

import NotFound from '@/assets/images/not_found.svg?react'
import Button from '@/components/common/Button'
import { Image } from '@/components/common/Image'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { TextField } from '@/components/common/TextField'
import StockRankItem from '@/components/domain/stock/StockRankItem'
import type { OnboardingStock } from '@/pages/OnboardingPage/mockStocks'

interface StockSearchViewProps {
  stocks: OnboardingStock[]
  searchKeyword: string
  selectedStockIds: number[]
  onSearchKeywordChange: (value: string) => void
  onToggleStock: (stockId: number) => void
  onBack: () => void
  onComplete: () => void
}

export default function StockSearchView({
  stocks,
  searchKeyword,
  selectedStockIds,
  onSearchKeywordChange,
  onToggleStock,
  onBack,
  onComplete,
}: StockSearchViewProps) {
  const selectedStocks = useMemo(
    () => stocks.filter((stock) => selectedStockIds.includes(stock.id)),
    [stocks, selectedStockIds],
  )

  const filteredStocks = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase()

    if (!keyword) return stocks

    return stocks.filter((stock) => stock.name.toLowerCase().includes(keyword))
  }, [stocks, searchKeyword])

  const hasSearchResult = filteredStocks.length > 0

  return (
    <main className="flex w-full flex-1 flex-col px-4 pt-6 pb-5">
      <StatusBar
        hasStatusArea
        className="w-full [&>div:last-child]:px-0"
        left={<StatusBarBackButton onClick={onBack} />}
      />

      <div className="mt-4">
        <TextField
          name="stockSearch"
          variant="search"
          value={searchKeyword}
          placeholder="코스피 200 종목 검색"
          onChange={(event) => onSearchKeywordChange(event.target.value)}
          onClear={() => onSearchKeywordChange('')}
        />
      </div>

      {!searchKeyword.trim() && selectedStocks.length > 0 && (
        <section className="mt-5">
          <h2 className="pretendard-Body2-Semibold text-Yellow-30">나의 관심종목</h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedStocks.map((stock) => (
              <button
                key={stock.id}
                type="button"
                onClick={() => onToggleStock(stock.id)}
                className="pretendard-Caption2 bg-Yellow-100 text-Yellow-20 flex items-center gap-1 rounded-full px-3 py-1.5"
              >
                {stock.name}
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-7 flex-1">
        {hasSearchResult ? (
          <>
            {!searchKeyword.trim() && (
              <h2 className="pretendard-Body2-Semibold text-Yellow-30 mb-3">현재 인기 종목 랭킹</h2>
            )}

            <div className="border-Gray-2 overflow-hidden rounded-xl border">
              {filteredStocks.map((stock, index) => (
                <div key={stock.id} className="border-Gray-2 border-b last:border-b-0">
                  <StockRankItem
                    rank={searchKeyword.trim() ? undefined : index + 1}
                    logo={
                      <Image
                        src={stock.logoUrl!}
                        alt={`${stock.name} 로고`}
                        responsiveSize="none"
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
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-80 flex-col items-center justify-center">
            <NotFound className="h-34 w-40" />
          </div>
        )}
      </section>

      <Button
        type="button"
        isFullWidth
        disabled={selectedStockIds.length < 3}
        onClick={onComplete}
        className="mt-6"
      >
        완료
      </Button>
    </main>
  )
}
