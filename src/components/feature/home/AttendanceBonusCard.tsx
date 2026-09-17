import { twMerge } from 'tailwind-merge'

import { formatWon } from '@/components/domain/ap/apTransactionMeta'

interface AttendanceBonusCardProps {
  bonus: number
  endTime: string
  /** 오늘 이미 출석했는지 — true면 "받기"가 아니라 완료 상태로 보여준다 */
  isAttended?: boolean
  onClick?: () => void
}

export default function AttendanceBonusCard({
  bonus,
  endTime,
  isAttended = false,
  onClick,
}: AttendanceBonusCardProps) {
  return (
    <div className="bg-Yellow-100 flex h-17 w-full items-center justify-between rounded-lg px-4 py-3.5">
      <div className="flex flex-col gap-1">
        <p className="pretendard-Button3 text-Yellow-5 font-bold">
          {isAttended ? '✅ 오늘 출석을 완료했어요' : `🔥 오늘의 출석 보너스 +${formatWon(bonus)}`}
        </p>

        <p className="pretendard-Caption3 text-Yellow-5 font-bold">
          {isAttended ? '이번 주 출석 현황 보기' : `${endTime} 장 마감 자동 정산`}
        </p>
      </div>

      <button
        type="button"
        onClick={onClick}
        aria-label={isAttended ? '이번 주 출석 현황 보기' : '출석 보상 받기'}
        className={twMerge(
          'pretendard-Button2 flex h-10 shrink-0 items-center justify-center rounded-[14px] px-4 py-5',
          isAttended ? 'bg-Yellow-70 text-Yellow-10' : 'bg-Yellow-80 text-Yellow-20',
        )}
      >
        {isAttended ? '완료' : '받기'}
      </button>
    </div>
  )
}
