import CelebrationImage from '@/assets/characters/celebration.svg?react'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { BadgeItem } from '@/components/domain/badge/BadgeItem'
import type { Badge } from '@/types/domain/badge'

export interface BadgeUnlockModalProps {
  isOpen: boolean
  /** 새로 획득한 배지 — null이면 모달을 열지 않는다 */
  badge: Badge | null
  onClose: () => void
}

/** 새 배지 획득 모달 */
export function BadgeUnlockModal({ isOpen, badge, onClose }: BadgeUnlockModalProps) {
  if (!badge) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="새 배지 획득">
      <Modal.Header className="flex flex-col items-center gap-3">
        <CelebrationImage width={120} height={120} aria-hidden="true" />
        <h2 className="dnf-Subtitle2 text-Gray-10">새 배지 획득!</h2>
      </Modal.Header>

      <Modal.Body className="mt-5 flex flex-col items-center gap-3">
        <BadgeItem badge={{ ...badge, isUnlocked: true }} size={72} disabled />
        <p className="pretendard-Caption2 text-Gray-6 text-center leading-relaxed">
          {badge.description}
        </p>
      </Modal.Body>

      <Modal.Footer className="mt-6">
        <Button size="semilg" isFullWidth onClick={onClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
