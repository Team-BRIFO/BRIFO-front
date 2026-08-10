import { useMemo } from 'react'

import NotFound from '@/assets/images/not_found.svg?react'
import Button from '@/components/common/Button'
import { Image } from '@/components/common/Image'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { TextField } from '@/components/common/TextField'
import StockRankItem from '@/components/domain/stock/StockRankItem'
import type { InterestStockOption } from '@/types/domain/stock'
import { MAX_INTEREST_STOCK_COUNT, validateInterestStockIds } from '@/utils/profileValidation'

interface StockSearchViewProps {
  stocks: InterestStockOption[]
  searchKeyword: string
  selectedStockIds: string[]
  /** 목록 첫 페이지에 없는 기존 선택 종목도 칩으로 표시할 때 전달한다. */
  selectedStocks?: Pick<InterestStockOption, 'id' | 'name'>[]
  onSearchKeywordChange: (value: string) => void
  onToggleStock: (stockId: string) => void
  onBack: () => void
  onComplete: () => void
  /** 마이 프로필처럼 이미 화면 헤더가 있는 곳에 삽입할 때 사용한다. */
  embedded?: boolean
}

export default function StockSearchView({
  stocks,
  searchKeyword,
  selectedStockIds,
  selectedStocks: selectedStocksProp,
  onSearchKeywordChange,
  onToggleStock,
  onBack,
  onComplete,
  embedded = false,
}: StockSearchViewProps) {
  const selectedStocksFromList = useMemo(
    () => stocks.filter((stock) => selectedStockIds.includes(stock.id)),
    [stocks, selectedStockIds],
  )
  const selectedStocks = selectedStocksProp ?? selectedStocksFromList

  const filteredStocks = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase()

    if (!keyword) return stocks

    return stocks.filter((stock) => stock.name.toLowerCase().includes(keyword))
  }, [stocks, searchKeyword])

  const hasSearchResult = filteredStocks.length > 0
  const interestStocksError = validateInterestStockIds(selectedStockIds)
  const hasReachedSelectionLimit = selectedStockIds.length >= MAX_INTEREST_STOCK_COUNT

  return (
    <main
      className={
        embedded ? 'flex w-full flex-1 flex-col pb-5' : 'flex w-full flex-1 flex-col px-4 pt-6 pb-5'
      }
    >
      {!embedded && (
        <StatusBar
          hasStatusArea
          className="w-full [&>div:last-child]:px-0"
          left={<StatusBarBackButton onClick={onBack} />}
        />
      )}

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
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-80 flex-col items-center justify-center">
            <NotFound className="h-34 w-40" />
          </div>
        )}
      </section>

      {interestStocksError && (
        <p role="alert" className="pretendard-Caption2 text-Pink-30 mt-3 text-center">
          {interestStocksError}
        </p>
      )}

      <Button
        type="button"
        isFullWidth
        disabled={Boolean(interestStocksError)}
        onClick={onComplete}
        className="mt-6"
      >
        완료
      </Button>
    </main>
  )
}
