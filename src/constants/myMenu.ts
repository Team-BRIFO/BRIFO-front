import type { ElementType } from 'react'

import BarChartIcon from '@/assets/icons/bar-chart.svg?react'
import FolderIcon from '@/assets/icons/folder.svg?react'
import HeartIcon from '@/assets/icons/heart.svg?react'
import SettingIcon from '@/assets/icons/setting.svg?react'
import type { MenuRowVariant } from '@/components/common/MenuRow'

/**
 * 마이 탭에서 이동/실행할 수 있는 항목 키.
 * 실제 라우팅은 페이지 레이어가 담당하고, 여기서는 "무엇이 있는지"만 데이터로 정의한다.
 */
export type MyMenuKey =
  | 'profileEdit'
  | 'glossary'
  | 'apHistory'
  | 'badges'
  | 'interestStocks'
  | 'tutorial'
  | 'notice'
  | 'contact'
  | 'terms'
  | 'logout'
  | 'withdraw'

export interface MyMenuItem {
  key: MyMenuKey
  label: string
  /** 좌측 원형 아이콘 — 설정 화면 행은 아이콘이 없다 */
  icon?: ElementType
  variant?: MenuRowVariant
}

/** 마이 메인(SCR-13) 메뉴 리스트 */
export const MY_MAIN_MENU_ITEMS: MyMenuItem[] = [
  { key: 'profileEdit', label: '프로필 편집', icon: SettingIcon },
  { key: 'glossary', label: '내 용어장', icon: FolderIcon },
  { key: 'apHistory', label: 'AP 내역', icon: BarChartIcon },
  { key: 'badges', label: '업적 · 배지', icon: HeartIcon },
]

export interface MySettingsSection {
  /** 섹션 제목 (예: 계정) */
  title: string
  items: MyMenuItem[]
}

/** 설정 화면(SCR-13 설정) 섹션 구성 */
export const MY_SETTINGS_SECTIONS: MySettingsSection[] = [
  {
    title: '계정',
    items: [
      { key: 'profileEdit', label: '프로필 편집' },
      { key: 'interestStocks', label: '관심종목 변경' },
    ],
  },
  {
    title: '학습',
    items: [{ key: 'glossary', label: '내 용어장' }],
  },
  {
    title: '도움말',
    items: [
      { key: 'tutorial', label: '튜토리얼 다시보기' },
      { key: 'notice', label: '공지사항' },
      { key: 'contact', label: '문의하기' },
      { key: 'terms', label: '약관 및 정책' },
    ],
  },
  {
    title: '계정관리',
    items: [
      { key: 'logout', label: '로그아웃' },
      { key: 'withdraw', label: '회원 탈퇴', variant: 'danger' },
    ],
  },
]
