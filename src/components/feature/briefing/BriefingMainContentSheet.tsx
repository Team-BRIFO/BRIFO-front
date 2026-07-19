import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface BriefingMainContentSheetProps {
  /** 시트 내부에 유기적으로 주입되어 결합될 도메인 UI 자식 노드들 (Slot 기반 설계) */
  children: ReactNode
  className?: string
}

export function BriefingMainContentSheet({ children, className }: BriefingMainContentSheetProps) {
  return (
    <div
      className={twMerge(
        'flex h-[528px] w-[328px] flex-col items-stretch overflow-hidden',
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-[22px] overflow-y-auto">{children}</div>
    </div>
  )
}
