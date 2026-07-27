import { Badge as ApBadge } from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
// 대체: domain/badge — 갤러리 BadgeItem과 동일 (획득 모달용, unlocked 고정)
import { BadgeItem } from '@/components/domain/badge/BadgeItem'
import type { Badge } from '@/types/domain/badge'

export interface BadgeUnlockModalProps {
  isOpen: boolean
  /** 새로 획득한 배지 — null이면 모달을 열지 않는다 */
  badge: Badge | null
  rewardAp?: number
  onClose: () => void
}

/** 새 배지 획득 모달 — 피그마 새뱃지 획득 */
export function BadgeUnlockModal({ isOpen, badge, rewardAp, onClose }: BadgeUnlockModalProps) {
  if (!badge) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="새 배지 획득" className="w-70 rounded-xl">
      <Modal.Header className="flex flex-col items-center gap-4">
        <h2 className="dnf-Title4 text-Gray-10">새 뱃지 획득!</h2>
        <BadgeItem badge={{ ...badge, isUnlocked: true }} size={60} disabled />
        <p className="font-pretendard text-Gray-6 text-center text-[14px] leading-5 font-normal tracking-[-0.56px]">
          {badge.description}
        </p>
        {rewardAp !== undefined && (
          <ApBadge
            type="ap"
            className="dnf-Caption1 bg-Pink-60 text-Pink-30 h-auto gap-0.5 rounded-[20px] px-3 py-1.5"
          >
            {`+ ${rewardAp} AP`}
          </ApBadge>
        )}
      </Modal.Header>

      <Modal.Footer className="mt-5">
        <Button size="lg" isFullWidth onClick={onClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
