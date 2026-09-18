import type { ReactNode } from 'react'

import ArrowUpCircleIcon from '@/assets/icons/arrow-up-circle.svg?react'
import ArrowUpRectangleIcon from '@/assets/icons/arrow-up-rectangle.svg?react'
import BagIcon from '@/assets/icons/bag.svg?react'
import Bag2Icon from '@/assets/icons/bag2.svg?react'
import Bag2CheckIcon from '@/assets/icons/bag2-check.svg?react'
import Bag2PlusIcon from '@/assets/icons/bag2-plus.svg?react'
import BarChartIcon from '@/assets/icons/bar-chart.svg?react'
import BookmarkIcon from '@/assets/icons/bookmark.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'
import CalendarActiveIcon from '@/assets/icons/calendar-active.svg?react'
import CalendarCheckIcon from '@/assets/icons/calendar-check.svg?react'
import CalendarMinusIcon from '@/assets/icons/calendar-minus.svg?react'
import CalendarPlusIcon from '@/assets/icons/calendar-plus.svg?react'
import CheckIcon from '@/assets/icons/check.svg?react'
import CheckCircleIcon from '@/assets/icons/check-circle.svg?react'
import CheckRectangleIcon from '@/assets/icons/check-rectangle.svg?react'
import ClockCircleIcon from '@/assets/icons/clock-circle.svg?react'
import CompassIcon from '@/assets/icons/compass.svg?react'
import EditIcon from '@/assets/icons/edit.svg?react'
import EditCircleIcon from '@/assets/icons/edit-circle.svg?react'
import ExternalLinkIcon from '@/assets/icons/external-link.svg?react'
import FileTextIcon from '@/assets/icons/file-text.svg?react'
import FilledHeartIcon from '@/assets/icons/filled-heart.svg?react'
import FolderIcon from '@/assets/icons/folder.svg?react'
import FolderCheckIcon from '@/assets/icons/folder-check.svg?react'
import FolderPlusIcon from '@/assets/icons/folder-plus.svg?react'
import FolderUpIcon from '@/assets/icons/folder-up.svg?react'
import MailIcon from '@/assets/icons/mail.svg?react'
import MailNewIcon from '@/assets/icons/mail-new.svg?react'
import MessageCheckIcon from '@/assets/icons/message-check.svg?react'
import MessageSendIcon from '@/assets/icons/message-send.svg?react'
import MessageWriteIcon from '@/assets/icons/message-write.svg?react'
import Navigation1Icon from '@/assets/icons/navigation-1.svg?react'
import Navigation2Icon from '@/assets/icons/navigation-2.svg?react'
import PayIcon from '@/assets/icons/pay.svg?react'
import PercentCircleIcon from '@/assets/icons/percent-circle.svg?react'
import PieChart1Icon from '@/assets/icons/pie-chart-1.svg?react'
import PieChart2Icon from '@/assets/icons/pie-chart-2.svg?react'
import PieChart3Icon from '@/assets/icons/pie-chart-3.svg?react'
import ShareIcon from '@/assets/icons/share.svg?react'
import ShieldIcon from '@/assets/icons/shield.svg?react'
import ShieldDoneIcon from '@/assets/icons/shield-done.svg?react'
import ShieldNewIcon from '@/assets/icons/shield-new.svg?react'
import StarIcon from '@/assets/icons/star.svg?react'
import StarCircleIcon from '@/assets/icons/star-circle.svg?react'
import StarRectangleIcon from '@/assets/icons/star-rectangle.svg?react'
import UnlockCircleIcon from '@/assets/icons/unlock-circle.svg?react'
import User1Icon from '@/assets/icons/user-1.svg?react'
import User2Icon from '@/assets/icons/user-2.svg?react'
import User3Icon from '@/assets/icons/user-3.svg?react'
import WalletIcon from '@/assets/icons/wallet.svg?react'

/**
 * 배지 코드(B01~B50) → 아이콘.
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
  B13: <CalendarPlusIcon aria-hidden="true" />, // 개근왕 새싹
  B14: <CalendarIcon aria-hidden="true" />, // 개근왕
  B15: <CalendarMinusIcon aria-hidden="true" />, // 개근왕 베테랑
  B16: <ClockCircleIcon aria-hidden="true" />, // 개근왕 레전드
  B17: <EditIcon aria-hidden="true" />, // 예측 입문
  B18: <MessageWriteIcon aria-hidden="true" />, // 예측 애호가
  B19: <BarChartIcon aria-hidden="true" />, // 예측 중독
  B20: <StarIcon aria-hidden="true" />, // 예측왕
  B21: <PieChart1Icon aria-hidden="true" />, // 예측 마스터
  B22: <PercentCircleIcon aria-hidden="true" />, // 예측의 신
  B23: <ShieldIcon aria-hidden="true" />, // 백전백승
  B24: <PieChart2Icon aria-hidden="true" />, // 적중의 달인
  B25: <PieChart3Icon aria-hidden="true" />, // 적중의 신
  B26: <Navigation1Icon aria-hidden="true" />, // 신중왕 II
  B27: <Navigation2Icon aria-hidden="true" />, // 신중왕 III
  B28: <ShieldNewIcon aria-hidden="true" />, // 소신파 사장
  B29: <UnlockCircleIcon aria-hidden="true" />, // 배짱 두둑한 사장
  B30: <User1Icon aria-hidden="true" />, // 에이스 사원
  B31: <User2Icon aria-hidden="true" />, // 인재 경영
  B32: <User3Icon aria-hidden="true" />, // 드림팀
  B33: <FolderPlusIcon aria-hidden="true" />, // 용어 수집가
  B34: <FolderCheckIcon aria-hidden="true" />, // 용어 박사
  B35: <FolderIcon aria-hidden="true" />, // 용어 마스터
  B36: <WalletIcon aria-hidden="true" />, // 자산가의 꿈
  B37: <PayIcon aria-hidden="true" />, // 신흥 부자
  B38: <Bag2Icon aria-hidden="true" />, // 자본가
  B39: <Bag2CheckIcon aria-hidden="true" />, // 재벌 사장
  B40: <Bag2PlusIcon aria-hidden="true" />, // 통 큰 사장
  B41: <MailIcon aria-hidden="true" />, // 첫 의뢰
  B42: <MailNewIcon aria-hidden="true" />, // 열정 사장
  B43: <MessageSendIcon aria-hidden="true" />, // 워커홀릭
  B44: <MessageCheckIcon aria-hidden="true" />, // 의뢰의 신
  B45: <BookmarkIcon aria-hidden="true" />, // 수집가
  B46: <FolderUpIcon aria-hidden="true" />, // 콜렉터
  B47: <CheckRectangleIcon aria-hidden="true" />, // 배지 마스터
  B48: <ExternalLinkIcon aria-hidden="true" />, // 공유왕
  B49: <ArrowUpRectangleIcon aria-hidden="true" />, // 3연승
  B50: <CheckIcon aria-hidden="true" />, // 5연승
}

/** iconKey(배지 코드)에 맞는 아이콘을 반환한다. 매칭되는 게 없으면 기본 하트 아이콘. */
export function getBadgeIcon(iconKey?: string): ReactNode {
  if (!iconKey) return <FilledHeartIcon aria-hidden="true" />
  return BADGE_ICON_BY_CODE[iconKey] ?? <FilledHeartIcon aria-hidden="true" />
}
