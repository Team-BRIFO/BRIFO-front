import type { ReactNode } from 'react'

import LoaderIcon from '@/assets/icons/loader-1.svg?react'

interface PageStatusShellProps {
  headerText?: string
  children: ReactNode
}

/** 페이지 로딩·오류 상태의 공통 레이아웃입니다. */
export function PageStatusShell({ headerText, children }: PageStatusShellProps) {
  return (
    <div className="flex w-full flex-1 flex-col gap-3 overflow-y-auto px-4 pt-3 pb-10">
      {headerText && (
        <div className="flex items-center justify-center gap-2.5">
          <LoaderIcon
            className="text-Gray-5 h-4 w-4 animate-spin"
            style={{ animationDuration: '3s' }}
          />
          <span className="pretendard-Caption1 text-Gray-5">{headerText}</span>
        </div>
      )}
      {children}
    </div>
  )
}
