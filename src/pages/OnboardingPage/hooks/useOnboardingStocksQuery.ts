import { signupSession } from '@/api/client/signupSession'
import { getStocks } from '@/api/generated/endpoints/stock-controller/stock-controller'
import { ApiResponseGetStocksResponse } from '@/api/generated/schemas'
import SkHynixLogo from '@/assets/logo/sk-hynix.png'
import { useApiQuery } from '@/hooks/api'
import type { OnboardingStock } from '@/pages/OnboardingPage/mockStocks'

const STOCK_PAGE_SIZE = 20

export function useOnboardingStocksQuery() {
  return useApiQuery({
    queryKey: ['onboarding', 'stocks'],
    operation: getStocks,
    endpoint: 'getStocks',
    args: [{ request: { size: STOCK_PAGE_SIZE } }],
    responseSchema: ApiResponseGetStocksResponse,
    response: 'requiredResult',
    enabled: signupSession.isActive(),
    map: (result): OnboardingStock[] =>
      result.page.items.map((stock) => ({
        id: stock.stockId,
        name: stock.name,
        price: stock.price?.toLocaleString('ko-KR') ?? '-',
        changeRate: stock.changeRate ?? 0,
        logoUrl: stock.logoUrl ?? SkHynixLogo,
      })),
  })
}
