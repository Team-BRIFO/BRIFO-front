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
  | 'BRIEFING'
  | 'PREDICTION'

export interface BriefingCardFooterBarProps {
  /** 카드뉴스 건수 (예: 2 -> "카드뉴스 2건") */
  newsCount: number
  /** 요약 헤드라인 문구 (예: "HBM3E 12단 양산 본격화… 엔비디아 공급 기대감 확대") */
  headline: string
  /** 분석 완료 여부 */
  isCompleted: boolean
  /** 분석 요청 여부 */
  isRequested?: boolean
}

export interface PredictionFooterBarProps {
  /** 분석/정산 상태 */
  status: 'ANALYZING' | 'COMPLETED' | 'WAITING' | 'SETTLED' | 'SETTLING'
  /** 현재 수익률 (예: 6.3) */
  currentRate: number
}

export interface AnalyzeCardProps {
  /** 카드 레이아웃 형태 (normal: 하단바/해시태그 포함, Analyze_small: 상단 간단형) */
  type?: AnalyzeType
  /** 정산 결과 및 배지 유형 */
  resultType: AnalyzeResultType
  /** 브리핑 카드 하단 바 전용 데이터 */
  briefingFooter?: BriefingCardFooterBarProps
  /** 예측 카드 하단 바 전용 데이터 */
  predictionFooter?: PredictionFooterBarProps
  /** 종목 기본 정보 */
  stock: {
    name: string
    code?: string
    marketType?: string
    logoUrl?: string | null
    /** 주가. 없으면 가격/등락률 줄을 렌더하지 않는다 (결정일기 목록 API 미제공) */
    price?: number
    /** 등락률(%). price 와 함께 있어야 표시된다 */
    changeRate?: number
    keywords?: string[]
    tradeDate?: string
  }
  /** 보상/차감 자금 (예: +100000, -100000) */
  apAmount?: number
  /** 종목 로고 표시 여부 (기본 true). 바깥에 이미 종목 로고를 크게 보여주는 레이아웃에서는 false로 중복을 없앤다 */
  showLogo?: boolean
  /** 종목명 타이포그래피 클래스 (Analyze_small 전용, 기본값 대체). 색상까지 포함해 통째로 지정한다 */
  nameClassName?: string
  className?: string
}

export function AnalyzeCard({
  type = 'normal',
  resultType,
  stock,
  apAmount = 0,
  showLogo = true,
  nameClassName,
  briefingFooter,
  predictionFooter,
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
      FAIL_DOWN: { type: 'fall', text: '실패', apColor: 'text-Green-30' },
      FAIL_HOLD: { type: 'fall', text: '실패', apColor: 'text-Green-30' },
      BRIEFING:
        briefingFooter?.isRequested === false
          ? null
          : briefingFooter?.isCompleted
            ? { type: 'complete', text: '분석 완료', apColor: '' }
            : { type: 'progress', text: '분석 중', apColor: '' },
      PREDICTION: (() => {
        switch (predictionFooter?.status) {
          case 'ANALYZING':
            return { type: 'progress', text: '분석 중', apColor: '' }
          case 'COMPLETED':
            return { type: 'complete', text: '분석 완료', apColor: '' }
          case 'WAITING':
            return { type: 'gray', text: '정산대기', apColor: 'text-Gray-7' }
          case 'SETTLED':
            return { type: 'gray', text: '정산완료', apColor: 'text-Gray-7' }
          case 'SETTLING':
            return { type: 'progress', text: '정산 중', apColor: '' }
          default:
            return { type: 'gray', text: '정산대기', apColor: 'text-Gray-7' }
        }
      })(),
    }
    return configMap[resultType]
  }

  const getFooterConfig = () => {
    const configMap: Record<
      AnalyzeResultType,
      { bgClass?: string; label: string; labelClass?: string } | null
    > = {
      HASHTAG: null,
      ERROR: null,
      SUCCESS_UP: { bgClass: 'bg-Background1', label: '상승 예측 성공', labelClass: 'text-Gray-4' },
      SUCCESS_DOWN: {
        bgClass: 'bg-Background1',
        label: '하락 예측 성공',
        labelClass: 'text-Gray-4',
      },
      SUCCESS_HOLD: {
        bgClass: 'bg-Background1',
        label: '관망 예측 성공',
        labelClass: 'text-Gray-4',
      },
      FAIL_UP: { bgClass: 'bg-Background1', label: '상승 예측 실패', labelClass: 'text-Gray-4' },
      FAIL_DOWN: { bgClass: 'bg-Background1', label: '하락 예측 실패', labelClass: 'text-Gray-4' },
      FAIL_HOLD: { bgClass: 'bg-Background1', label: '관망 예측 실패', labelClass: 'text-Gray-4' },
      BRIEFING: null,
      PREDICTION: null,
    }
    return configMap[resultType]
  }

  const badgeConfig = getBadgeConfig()
  const footerConfig = getFooterConfig()
  /** Analyze_small 은 아바타 옆 좁은 폭에서도 쓰이므로 로고·종목명을 1행, 배지·금액을 2행으로 쌓는다 */
  const isCompact = type === 'Analyze_small'

  const logo = stock.logoUrl ? (
    <img
      src={stock.logoUrl}
      alt={`${stock.name} 로고`}
      className={twMerge(
        'bg-Gray-2 shrink-0 rounded-full object-cover',
        isCompact ? 'h-6 w-6' : 'h-8 w-8',
      )}
    />
  ) : (
    <div
      className={twMerge('bg-Gray-2 shrink-0 rounded-full', isCompact ? 'h-6 w-6' : 'h-8 w-8')}
    />
  )

  const priceRow = stock.price !== undefined && (
    <div className="flex items-center gap-1">
      <span className="text-Gray-5 pretendard-Caption3">{stock.price.toLocaleString()}</span>
      {stock.changeRate !== undefined && (
        <span
          className={`pretendard-Caption1 ${
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
      )}
    </div>
  )

  const badgeRow = badgeConfig && (
    <div
      className={twMerge('flex shrink-0 items-center justify-end', isCompact ? 'gap-0.5' : 'gap-1')}
    >
      <Badge
        type={badgeConfig.type}
        size={isCompact ? 'sm' : 'md'}
        className={twMerge(
          resultType === 'BRIEFING' && !briefingFooter?.isCompleted
            ? 'bg-Pink-60 text-Pink-30'
            : '',
          isCompact ? 'px-1.5' : 'px-3',
        )}
      >
        {badgeConfig.text}
      </Badge>
      {apAmount !== 0 && (
        <span
          className={twMerge(
            isCompact ? 'pretendard-Caption1' : 'dnf-Caption2',
            badgeConfig.apColor,
          )}
        >
          {apAmount > 0 ? '+' : ''}
          {apAmount}
        </span>
      )}
    </div>
  )

  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White flex w-full flex-col overflow-hidden rounded-xl border',
        className,
      )}
    >
      {/* Top_Stock_Header */}
      <div
        className={twMerge(
          'flex items-center justify-between px-4 py-3.5',
          isCompact && 'gap-1.5 px-2.5 py-2',
        )}
      >
        {resultType === 'HASHTAG' ? (
          <>
            <StockInfo
              name={stock.name}
              code={stock.code}
              marketType={stock.marketType}
              logoUrl={stock.logoUrl}
            />
            {stock.price !== undefined && stock.changeRate !== undefined && (
              <StockPriceChange
                price={stock.price}
                changeRate={stock.changeRate}
                textAlign="right"
              />
            )}
          </>
        ) : isCompact ? (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-1">
              {showLogo && logo}
              <span
                className={twMerge(
                  nameClassName ?? 'text-Gray-10 pretendard-Caption1',
                  'min-w-0 flex-1 truncate',
                )}
              >
                {stock.name}
              </span>
              {priceRow}
            </div>
            {badgeRow}
          </>
        ) : (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-4">
              {logo}
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-Gray-10 pretendard-Body2-Semibold truncate">
                    {stock.name}
                  </span>
                </div>
                {priceRow}
              </div>
            </div>
            {badgeRow}
          </>
        )}
      </div>

      {/* Bottom_Footer_Bar */}
      {type === 'normal' && (
        <>
          {resultType === 'HASHTAG' ? (
            stock.keywords &&
            stock.keywords.length > 0 && (
              <div className="bg-Background1 text-Gray-6 pretendard-Caption1 flex flex-wrap gap-2 px-4 py-2">
                {stock.keywords.map((keyword, idx) => (
                  <Badge key={idx} type="tag">
                    {`# ${keyword}`}
                  </Badge>
                ))}
              </div>
            )
          ) : resultType === 'BRIEFING' ? (
            briefingFooter && (
              <div className="bg-Background1 flex items-center justify-between px-4 py-2">
                <div className="flex flex-1 items-center gap-3 overflow-hidden">
                  <span className="text-Gray-8 pretendard-Caption2 shrink-0">
                    카드뉴스 {briefingFooter.newsCount}건
                  </span>
                  <span className="pretendard-Caption2 text-Gray-6 max-w-42.75 truncate">
                    {briefingFooter.headline}
                  </span>
                </div>
              </div>
            )
          ) : resultType === 'PREDICTION' ? (
            predictionFooter && (
              <div className="bg-Background1 flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                  <span className="pretendard-Caption1 text-Gray-8">
                    현재{' '}
                    <span
                      className={
                        predictionFooter.currentRate > 0
                          ? 'text-Pink-30'
                          : predictionFooter.currentRate < 0
                            ? 'text-Green-30'
                            : 'text-Gray-8'
                      }
                    >
                      {predictionFooter.currentRate > 0 ? '+' : ''}
                      {predictionFooter.currentRate}%
                    </span>
                  </span>
                </div>
              </div>
            )
          ) : resultType === 'ERROR' ? (
            <div className="bg-Background1 flex items-center justify-between px-4 py-1">
              <span className={twMerge('pretendard-Caption2 text-Pink-30')}>오류</span>
              {stock.tradeDate && (
                <span className={twMerge('pretendard-Caption2 text-Pink-30')}>
                  {stock.tradeDate.replace(/-/g, '.')}
                </span>
              )}
            </div>
          ) : (
            footerConfig && (
              <div
                className={twMerge(
                  'flex items-center justify-between px-4 py-1',
                  footerConfig.bgClass,
                )}
              >
                {/* 피그마 Analyze_Card 푸터는 Main/Caption/SemiBold12 */}
                <span className={twMerge('pretendard-Caption1', footerConfig.labelClass)}>
                  {footerConfig.label}
                </span>
                {stock.tradeDate && (
                  <span className={twMerge('pretendard-Caption1 text-Gray-4')}>
                    {stock.tradeDate.replace(/-/g, '.')}
                  </span>
                )}
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}
