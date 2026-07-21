import { twMerge } from 'tailwind-merge'

import { Badge, type BadgeType } from '@/components/common/Badge'
import { StockInfo } from '@/components/domain/stock/StockInfo'
import { StockPriceChange } from '@/components/domain/stock/StockPriceChange'

export type AnalyzeType = 'normal' | 'Analyze_small'
export type AnalyzeResultType =
  | 'SUCCESS_UP'
  | 'FAIL_UP'
  | 'SUCCESS_DOWN'
  | 'FAIL_DOWN'
  | 'SUCCESS_HOLD'
  | 'FAIL_HOLD'
  | 'ERROR'
  | 'HASHTAG'

export interface AnalyzeCardProps {
  /** 카드 레이아웃 형태 (normal: 하단바/해시태그 포함, Analyze_small: 상단 간단형) */
  type?: AnalyzeType
  /** 정산 결과 및 배지 유형 */
  resultType: AnalyzeResultType
  /** 종목 기본 정보 */
  stock: {
    name: string
    code?: string
    marketType?: string
    logoUrl?: string | null
    price: number
    changeRate: number
    tags?: string[]
  }
  /** 보상/차감 AP 포인트 (예: +100, -100) */
  apAmount?: number
  /** 정산 날짜 (예: "2023.04.01") */
  dateText?: string
  className?: string
}

export function AnalyzeCard({
  type = 'normal',
  resultType,
  stock,
  apAmount = 0,
  dateText,
  className,
}: AnalyzeCardProps) {
  const getBadgeConfig = () => {
    const configMap: Record<
      AnalyzeResultType,
      { type: BadgeType; text: string; apColor: string } | null
    > = {
      HASHTAG: null,
      ERROR: { type: 'error', text: '에러', apColor: 'text-Pink-30' },
      SUCCESS_UP: { type: 'rise', text: '적중', apColor: 'text-Pink-30' },
      SUCCESS_DOWN: { type: 'rise', text: '적중', apColor: 'text-Pink-30' },
      SUCCESS_HOLD: { type: 'watch', text: '관망', apColor: 'text-Gray-6' },
      FAIL_UP: { type: 'fall', text: '실패', apColor: 'text-Green-30' },
      FAIL_DOWN: { type: 'fall', text: '하락', apColor: 'text-Green-30' },
      FAIL_HOLD: { type: 'fall', text: '실패', apColor: 'text-Green-30' },
    }
    return configMap[resultType]
  }

  const getFooterConfig = () => {
    const configMap: Record<
      AnalyzeResultType,
      { bgClass?: string; label: string; labelClass?: string } | null
    > = {
      HASHTAG: null,
      ERROR: { bgClass: 'bg-Gray-1', label: '오류', labelClass: 'text-Pink-30' },
      SUCCESS_UP: { bgClass: 'bg-Gray-1', label: '상승 예측 성공', labelClass: 'text-Gray-4' },
      SUCCESS_DOWN: { bgClass: 'bg-Gray-1', label: '하락 예측 성공', labelClass: 'text-Gray-4' },
      SUCCESS_HOLD: { bgClass: 'bg-Gray-1', label: '관망 예측 성공', labelClass: 'text-Gray-4' },
      FAIL_UP: { bgClass: 'bg-Gray-1', label: '상승 예측 실패', labelClass: 'text-Gray-4' },
      FAIL_DOWN: { bgClass: 'bg-Gray-1', label: '하락 예측 실패', labelClass: 'text-Gray-4' },
      FAIL_HOLD: { bgClass: 'bg-Gray-1', label: '관망 예측 실패', labelClass: 'text-Gray-4' },
    }
    return configMap[resultType]
  }

  const badgeConfig = getBadgeConfig()
  const footerConfig = getFooterConfig()

  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White flex w-full flex-col overflow-hidden rounded-xl border',
        className,
      )}
    >
      {/* Top_Stock_Header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        {resultType === 'HASHTAG' ? (
          <>
            <StockInfo
              name={stock.name}
              code={stock.code}
              marketType={stock.marketType}
              logoUrl={stock.logoUrl}
            />
            <StockPriceChange price={stock.price} changeRate={stock.changeRate} textAlign="right" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              {stock.logoUrl ? (
                <img
                  src={stock.logoUrl}
                  alt={`${stock.name} 로고`}
                  className="bg-Gray-2 h-8 w-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="bg-Gray-2 h-8 w-8 shrink-0 rounded-full" />
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-Gray-10 pretendard-Body2-Semibold">{stock.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-Gray-5 pretendard-Caption3">
                    {stock.price.toLocaleString()}
                  </span>
                  <span
                    className={`pretendard-Caption3 ${
                      stock.changeRate > 0
                        ? 'text-Pink-30'
                        : stock.changeRate < 0
                          ? 'text-Green-30'
                          : 'text-Gray-6'
                    }`}
                  >
                    {stock.changeRate > 0 ? '+' : ''}
                    {stock.changeRate}%
                  </span>
                </div>
              </div>
            </div>
            {badgeConfig && (
              <div className="flex items-center gap-1">
                <Badge type={badgeConfig.type} size="md">
                  {badgeConfig.text}
                </Badge>
                {apAmount !== 0 && (
                  <span className={`dnf-Caption2 ${badgeConfig.apColor}`}>
                    {apAmount > 0 ? '+' : ''}
                    {apAmount}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom_Footer_Bar */}
      {type === 'normal' && (
        <>
          {resultType === 'HASHTAG'
            ? stock.tags &&
              stock.tags.length > 0 && (
                <div className="bg-Gray-1 text-Gray-6 pretendard-Caption1 flex flex-wrap gap-2 px-4 py-3">
                  {stock.tags.map((tag, idx) => (
                    <span key={idx}>#{tag}</span>
                  ))}
                </div>
              )
            : footerConfig && (
                <div
                  className={twMerge(
                    'flex items-center justify-between px-4 py-1',
                    footerConfig.bgClass,
                  )}
                >
                  <span className={twMerge('pretendard-Caption2', footerConfig.labelClass)}>
                    {footerConfig.label}
                  </span>
                  {dateText && (
                    <span
                      className={twMerge(
                        'pretendard-Caption2',
                        footerConfig.labelClass || 'text-Gray-4',
                      )}
                    >
                      {dateText}
                    </span>
                  )}
                </div>
              )}
        </>
      )}
    </div>
  )
}
