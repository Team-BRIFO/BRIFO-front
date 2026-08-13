import type { GetStocksResponse } from '@/api/generated/schemas/stock-controller/getStocksResponse.zod'
import StockLogoPlaceholder from '@/assets/images/diary/stock-logo-placeholder.png'
import type { InterestStockOption } from '@/types/domain/stock'

type StockListItem = GetStocksResponse['page']['items'][number]

/**
 * 종목 목록 API 항목을 관심종목 선택 UI 모델로 변환한다.
 *
 * 종가 배치가 아직 돌지 않은 종목은 서버가 더미 행(0원·0%)을 내려준다.
 * 이를 그대로 그리면 "0원짜리 종목"처럼 보이므로 값이 없는 것으로 처리한다.
 */
export function mapInterestStockOption(stock: StockListItem): InterestStockOption {
  const hasPrice = stock.price > 0

  return {
    id: stock.stockId,
    name: stock.name,
    price: hasPrice ? stock.price.toLocaleString('ko-KR') : null,
    changeRate: hasPrice ? stock.changeRate : null,
    logoUrl: stock.logoUrl ?? StockLogoPlaceholder,
  }
}
