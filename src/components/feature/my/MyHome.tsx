import { MenuRow, MenuRowGroup } from '@/components/common/MenuRow'
// 대체: domain/ap — AP 잔액·증감 카드 (마이 메인)
import { ApBalanceCard } from '@/components/domain/ap/ApBalanceCard'
// 대체: domain/user — 프로필 카드 (내부에서 AgentAvatar 재사용)
import { UserProfileCard } from '@/components/domain/user/UserProfileCard'
// 대체: domain/user — 적중률·누적결정·연속출석 타일
import { UserStatTile } from '@/components/domain/user/UserStatTile'
import type { MyMenuKey } from '@/constants/myMenu'
import { MY_MAIN_MENU_ITEMS } from '@/constants/myMenu'
import type { ApSummary } from '@/types/domain/ap'
import type { UserProfile, UserStats } from '@/types/domain/user'

export interface MyHomeProps {
  profile: UserProfile
  stats: UserStats
  apSummary: ApSummary
  /** AP 카드 우측 증감의 기간 라벨 (예: 이번주) */
  apDeltaLabel?: string
  onSelectMenu?: (key: MyMenuKey) => void
}

/** 마이 메인(SCR-13) 본문 — 프로필 · AP · 요약 지표 · 메뉴 리스트 */
export function MyHome({
  profile,
  stats,
  apSummary,
  apDeltaLabel = '이번주',
  onSelectMenu,
}: MyHomeProps) {
  const statTiles = [
    { key: 'hitRate', value: stats.hitRate, unit: '%', label: '적중률' },
    { key: 'totalDecisions', value: stats.totalDecisions, unit: '건', label: '누적결정' },
    { key: 'attendanceStreak', value: stats.attendanceStreak, unit: '일', label: '연속출석' },
  ]

  return (
    <div className="flex flex-col gap-5.5">
      <header className="flex flex-col gap-1">
        <h1 className="dnf-Subtitle2 text-Gray-10">마이페이지</h1>
        <p className="font-pretendard text-Gray-6 text-sm leading-5 font-normal tracking-[-0.56px]">
          내 AI 사원들을 관리하세요
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <UserProfileCard profile={profile} />

        <ApBalanceCard summary={apSummary} deltaLabel={apDeltaLabel} />

        <div className="flex items-center gap-1.5">
          {statTiles.map(({ key, value, unit, label }) => (
            <UserStatTile key={key} value={value} unit={unit} label={label} />
          ))}
        </div>

        <MenuRowGroup>
          {MY_MAIN_MENU_ITEMS.map(({ key, label, icon: Icon }) => (
            <MenuRow
              key={key}
              label={label}
              icon={Icon ? <Icon aria-hidden="true" /> : undefined}
              onClick={() => onSelectMenu?.(key)}
            />
          ))}
        </MenuRowGroup>
      </div>
    </div>
  )
}
