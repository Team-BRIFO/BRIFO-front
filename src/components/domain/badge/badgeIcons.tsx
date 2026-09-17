import type { ReactNode } from 'react'

import ArrowUpCircleIcon from '@/assets/icons/arrow-up-circle.svg?react'
import BagIcon from '@/assets/icons/bag.svg?react'
import CalendarActiveIcon from '@/assets/icons/calendar-active.svg?react'
import CalendarCheckIcon from '@/assets/icons/calendar-check.svg?react'
import CheckCircleIcon from '@/assets/icons/check-circle.svg?react'
import CompassIcon from '@/assets/icons/compass.svg?react'
import EditCircleIcon from '@/assets/icons/edit-circle.svg?react'
import FileTextIcon from '@/assets/icons/file-text.svg?react'
import FilledHeartIcon from '@/assets/icons/filled-heart.svg?react'
import ShareIcon from '@/assets/icons/share.svg?react'
import ShieldDoneIcon from '@/assets/icons/shield-done.svg?react'
import StarCircleIcon from '@/assets/icons/star-circle.svg?react'
import StarRectangleIcon from '@/assets/icons/star-rectangle.svg?react'

/**
 * 배지 코드(B01~B12) → 아이콘.
 * 서버 배지 코드와 1:1로 맞춰뒀다 (com.brifo.server.badge.code.BadgeCode 참고).
 * 새 배지가 추가되면 여기에 코드만 추가하면 된다 — 없는 코드는 기본 하트로 대체.
 */
const BADGE_ICON_BY_CODE: Record<string, ReactNode> = {
  B01: <BagIcon aria-hidden="true" />, // 첫 출근
  B02: <EditCircleIcon aria-hidden="true" />, // 첫 결정
  B03: <CheckCircleIcon aria-hidden="true" />, // 첫 적중
  B04: <ShieldDoneIcon aria-hidden="true" />, // 소신 있는 사장
  B05: <CalendarCheckIcon aria-hidden="true" />, // 3일 개근
  B06: <CalendarActiveIcon aria-hidden="true" />, // 7일 개근
  B07: <StarCircleIcon aria-hidden="true" />, // 10승 달성
  B08: <StarRectangleIcon aria-hidden="true" />, // 50승 달성
  B09: <CompassIcon aria-hidden="true" />, // 신중왕
  B10: <ArrowUpCircleIcon aria-hidden="true" />, // 사원 육성가
  B11: <FileTextIcon aria-hidden="true" />, // 공부하는 사장
  B12: <ShareIcon aria-hidden="true" />, // 소문내기
}

/** iconKey(배지 코드)에 맞는 아이콘을 반환한다. 매칭되는 게 없으면 기본 하트 아이콘. */
export function getBadgeIcon(iconKey?: string): ReactNode {
  if (!iconKey) return <FilledHeartIcon aria-hidden="true" />
  return BADGE_ICON_BY_CODE[iconKey] ?? <FilledHeartIcon aria-hidden="true" />
}
