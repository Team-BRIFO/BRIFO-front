import type { StockSearchResponse } from '@/types/api/stocks'

interface GetStocksParams {
  keyword?: string
  cursor?: string
  size?: number
}

/**
 * 종목 검색 및 인기 종목 조회 API
 * @param params keyword, cursor, size
 */
export const getStocks = async (params?: GetStocksParams): Promise<StockSearchResponse> => {
  const keyword = params?.keyword
  const isSearch = Boolean(keyword && keyword.trim().length > 0)

  // TODO: 실제 API 연동
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        code: 'COMMON_200',
        message: '요청에 성공했습니다.',
        result: isSearch
          ? {
              mode: 'SEARCH',
              keyword,
              page: {
                items: [
                  {
                    stockId: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31',
                    code: '005930',
                    name: '삼성전자',
                    price: 71000.0,
                    changeRate: 2.1,
                  },
                ],
                nextCursor: null,
                hasNext: false,
              },
            }
          : {
              mode: 'POPULAR',
              page: {
                items: [
                  {
                    rank: 1,
                    stockId: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31',
                    code: '005930',
                    name: '삼성전자',
                    price: 71000.0,
                    changeRate: 2.1,
                  },
                ],
                nextCursor: null,
                hasNext: false,
              },
            },
      })
    }, 300)
  })
}
