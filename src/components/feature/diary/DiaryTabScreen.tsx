import type { ReactNode } from 'react'

import { type DiaryView, DiaryViewTabs } from '@/components/feature/diary/DiaryViewTabs'
export interface DiaryTabScreenProps {
  /** 현재 활성 탭 */
  view: DiaryView
  /** 탭 전환 시 */
  onChangeView: (view: DiaryView) => void
  children: ReactNode
}

/**
 * 캘린더 / 리스트 / 통계 3개 뷰가 공유하는 본문 틀.
 * 페이지 헤더 · 세그먼트 탭을 담당하고, 상태바·탭 상태 관리는 페이지가 맡는다.
 * 하단 NavigationBar 는 루트 레이아웃에서 배치되므로 여기서는 여백만 확보한다.
 */
export function DiaryTabScreen({ view, onChangeView, children }: DiaryTabScreenProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* StatusBar → 헤더 12px, 헤더 블록 → 본문 22px (피그마 #564:2629) */}
      <div className="flex flex-1 flex-col items-center gap-5.5 pt-3">
        {/* 제목 그룹 → 세그먼트 탭 12px */}
        <div className="flex w-full flex-col gap-3 px-4">
          <header className="flex w-full flex-col gap-1">
            <h1 className="dnf-Subtitle2 text-Gray-10">결정일기</h1>
            <p className="pretendard-Body2-Regular text-Gray-6">
              그동안의 예측과 결정을 기록으로 확인하세요
            </p>
          </header>

          <DiaryViewTabs value={view} onChange={onChangeView} />
        </div>

        {/* 하단 NavigationBar(약 72px) 에 가리지 않도록 여백 확보 */}
        <div className="w-full flex-1 px-4 pb-20">{children}</div>
      </div>
    </div>
  )
}
