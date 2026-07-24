import { Tabs } from '@/components/common/Tabs'

/** 결정일기 뷰 종류 */
export type DiaryView = 'calendar' | 'list' | 'statistics'

const TAB_ITEMS = [
  { value: 'calendar', label: '캘린더' },
  { value: 'list', label: '리스트' },
  { value: 'statistics', label: '통계' },
]

export interface DiaryViewTabsProps {
  value: DiaryView
  onChange: (value: DiaryView) => void
}

/**
 * 캘린더 / 리스트 / 통계 세그먼트 탭 (피그마 Pagenation2).
 * common Tabs 의 segmented Type 1 이 피그마 스펙(213px · gap 4 · radius 30 · Gray-2 트랙)과 동일해 그대로 사용한다.
 * 라벨 타이포만 피그마가 Semibold12 라 덮어쓴다.
 */
export function DiaryViewTabs({ value, onChange }: DiaryViewTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={(next) => onChange(next as DiaryView)}
      items={TAB_ITEMS}
      variant="segmented"
      segmentedType={1}
      ariaLabel="결정일기 보기 방식"
      className="[&_button]:pretendard-Caption1"
    />
  )
}
