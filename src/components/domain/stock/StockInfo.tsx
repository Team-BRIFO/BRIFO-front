export interface StockInfoProps {
  /** 기업 로고 이미지 URL (Nullable 대응) */
  logoUrl?: string | null
  /** 종목명 (예: "SK 하이닉스") */
  name: string
  /** 종목 코드 (예: "000660") */
  code?: string
  /** 소속 시장명 (예: "코스피") */
  marketType?: 'KOSPI' | 'KOSDAQ' | string
  className?: string
}

export function StockInfo({ logoUrl, name, code, marketType, className = '' }: StockInfoProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} 로고`}
          className="bg-Gray-2 h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="bg-Gray-2 h-8 w-8 shrink-0 rounded-full" />
      )}
      <div className="flex flex-col gap-0.5">
        <span className="text-Gray-10 pretendard-Body2-Semibold">{name}</span>
        {(code || marketType) && (
          <span className="text-Gray-5 pretendard-Caption3">
            {code}
            {code && marketType && ' · '}
            {marketType}
          </span>
        )}
      </div>
    </div>
  )
}
