import { forwardRef } from 'react'

import ProCharacter from '@/assets/characters/pro-normal.svg'
import RookieCharacter from '@/assets/characters/rookie-normal.svg'
import TankerCharacter from '@/assets/characters/tanker-normal.svg'
import StarIcon from '@/assets/icons/star.svg?react'
import BrifoLogo from '@/assets/logo/brifo_logo_small.svg'
import type { DiaryDirection } from '@/types/domain/diary'

const CHARACTER_BY_AGENT_TYPE = {
  rookie: RookieCharacter,
  pro: ProCharacter,
  tanker: TankerCharacter,
} as const

export interface DiaryShareCardProps {
  stockName: string
  changeRate: number
  agentType: keyof typeof CHARACTER_BY_AGENT_TYPE
  direction: DiaryDirection
  isCorrect: boolean
  confidenceLevel: number
  apDelta: number
  tradeDate: string
  companyName: string
}

function formatChangeRate(changeRate: number) {
  const sign = changeRate > 0 ? '+' : ''
  return `${sign}${changeRate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}%`
}

function formatApDelta(apDelta: number) {
  const sign = apDelta > 0 ? '+' : ''
  return `${sign}${apDelta.toLocaleString('ko-KR')} AP`
}

function formatTradeDate(tradeDate: string) {
  return tradeDate.replaceAll('-', '.')
}

function getDiaryQuote({
  direction,
  isCorrect,
  confidenceLevel,
}: Pick<DiaryShareCardProps, 'direction' | 'isCorrect' | 'confidenceLevel'>) {
  if (direction === 'neutral') return '관망도 훌륭한 판단! 리스크를 잘 관리했어요.'
  if (isCorrect) return `확신도 ${confidenceLevel}로 적중! 사장님 판단이 정확했어요.`
  return `확신도 ${confidenceLevel}의 도전! 다음 판단도 BRIFO가 응원할게요.`
}

/** 피그마 584:4711의 320×418 공유 카드. 이 노드를 PNG로 변환해 저장·카카오 공유에 공용한다. */
export const DiaryShareCard = forwardRef<HTMLDivElement, DiaryShareCardProps>(
  function DiaryShareCard(
    {
      stockName,
      changeRate,
      agentType,
      direction,
      isCorrect,
      confidenceLevel,
      apDelta,
      tradeDate,
      companyName,
    },
    ref,
  ) {
    const Character = CHARACTER_BY_AGENT_TYPE[agentType]
    const resultLabel = isCorrect ? '적중' : '아쉬움'
    const apColorClass = apDelta < 0 ? 'text-Green-30' : 'text-Pink-30'
    const quote = getDiaryQuote({ direction, isCorrect, confidenceLevel })

    return (
      <div
        ref={ref}
        data-share-card="true"
        className="border-Pink-50 shadow-card box-border flex h-[418px] w-[320px] shrink-0 flex-col overflow-hidden rounded-[12px] border bg-[linear-gradient(180deg,#FFE7ED_0%,#FFF9E6_100%)] px-[22px] pt-[20px] pb-[22px]"
      >
        <img src={BrifoLogo} alt="BRIFO" width={84} height={24} className="h-[24px] w-[84px]" />

        <div className="mt-[15px] flex items-center gap-[14px]">
          <div className="bg-White flex h-[96px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-full">
            <img
              src={Character}
              alt=""
              width={102}
              height={108}
              className="h-[96px] w-[96px] object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="dnf-Subtitle1 text-Gray-10 truncate text-[20px] leading-none">
              {stockName}
            </p>
            <p className="pretendard-Body2-Medium text-Gray-7 mt-[8px] text-[14px] leading-none">
              등락률 {formatChangeRate(changeRate)}
            </p>
          </div>
        </div>

        <div className="bg-Pink-60 mt-[13px] self-start rounded-full px-[12px] py-[6px]">
          <span className="pretendard-Caption1 text-Pink-30 text-[12px] leading-none">
            {resultLabel}
          </span>
        </div>

        <p className={`dnf-Title1 mt-[8px] text-[40px] leading-none ${apColorClass}`}>
          {formatApDelta(apDelta)}
        </p>

        <div
          className="text-Pink-30 mt-[8px] flex gap-[4px]"
          aria-label={`확신도 ${confidenceLevel}점`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon
              key={index}
              className="h-[20px] w-[20px]"
              style={{ opacity: index < confidenceLevel ? 1 : 0.28 }}
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="border-Yellow-80 bg-Yellow-105 mt-[10px] rounded-[14px] border px-[14px] py-[10px]">
          <p className="pretendard-Caption1 text-Gray-8 text-[12px] leading-[1.32]">{quote}</p>
        </div>

        <p className="pretendard-Caption2 text-Pink-40 mt-auto text-[12px] leading-none">
          {formatTradeDate(tradeDate)} · {companyName}
        </p>
      </div>
    )
  },
)
