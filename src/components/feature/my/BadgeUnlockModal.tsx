import { useEffect, useRef } from 'react'

import { Badge as ApBadge } from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { formatWon } from '@/components/domain/ap/apTransactionMeta'
import { getBadgeIcon } from '@/components/domain/badge/badgeIcons'
import { BadgeItem } from '@/components/domain/badge/BadgeItem'
import type { Badge } from '@/types/domain/badge'

export interface BadgeUnlockModalProps {
  /** 표시할 배지. null이면 모달을 렌더링하지 않는다. */
  badge: Badge | null
  onClose: () => void
}

/** 배지 상세 모달 — 획득한 배지는 "획득!" 문구와 보상 지급 내역을, 미획득 배지는 획득 조건과 예정 보상을 보여준다. */
export function BadgeUnlockModal({ badge, onClose }: BadgeUnlockModalProps) {
  const actionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!badge) return

    actionRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [badge])

  if (!badge) return null

  return (
    <Modal
      isOpen={Boolean(badge)}
      onClose={onClose}
      ariaLabel={badge.isUnlocked ? '배지 획득' : '배지 정보'}
      className="w-70 rounded-xl"
    >
      <Modal.Header className="flex flex-col items-center gap-4">
        <h2 className="dnf-Title4 text-Gray-10 mt-6">
          {badge.isUnlocked ? `${badge.name} 획득!` : badge.name}
        </h2>
        <BadgeItem badge={badge} icon={getBadgeIcon(badge.iconKey)} size={60} disabled />
        <p className="font-pretendard text-Gray-6 text-center text-sm leading-5 font-normal tracking-[-0.56px]">
          {badge.description}
        </p>
        <ApBadge
          type="ap"
          className="dnf-Caption1 bg-Pink-60 text-Pink-30 h-auto gap-0.5 rounded-[20px] px-3 py-1.5"
        >
          {badge.isUnlocked
            ? `+ ${formatWon(badge.rewardAp)}`
            : `획득 시 + ${formatWon(badge.rewardAp)}`}
        </ApBadge>
      </Modal.Header>

      <Modal.Footer className="mt-5">
        <div ref={actionRef} className="w-full">
          <Button size="lg" isFullWidth onClick={onClose}>
            확인
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
