import type { GetStocksResponse } from '@/api/generated/schemas/stock-controller/getStocksResponse.zod'
import StockLogoPlaceholder from '@/assets/images/diary/stock-logo-placeholder.png'
import type { InterestStockOption } from '@/types/domain/stock'

type StockListItem = GetStocksResponse['page']['items'][number]

/** 종목 목록 API 항목을 관심종목 선택 UI 모델로 변환한다. */
export function mapInterestStockOption(stock: StockListItem): InterestStockOption {
  return {
    id: stock.stockId,
    name: stock.name,
    price: stock.price.toLocaleString('ko-KR'),
    changeRate: stock.changeRate,
    logoUrl: stock.logoUrl ?? StockLogoPlaceholder,
  }
}
