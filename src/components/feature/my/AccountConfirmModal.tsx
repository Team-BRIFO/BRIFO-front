import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'

export type AccountActionType = 'logout' | 'withdraw'

interface AccountActionContent {
  title: string
  description: string
  confirmLabel: string
  /** 확인 버튼 색 — 탈퇴는 되돌릴 수 없으므로 보조 색으로 낮춘다 */
  confirmColor: 'primary' | 'assistive'
}

const ACCOUNT_ACTION_CONTENT: Record<AccountActionType, AccountActionContent> = {
  logout: {
    title: '로그아웃 하시겠어요?',
    description: '다시 로그인하면 사원과 기록은 그대로 남아 있어요.',
    confirmLabel: '로그아웃',
    confirmColor: 'primary',
  },
  withdraw: {
    title: '정말 탈퇴하시겠어요?',
    description: '탈퇴하면 사원·결정 일기·보유 AP가 모두 삭제되며 복구할 수 없어요.',
    confirmLabel: '탈퇴하기',
    confirmColor: 'assistive',
  },
}

export interface AccountConfirmModalProps {
  isOpen: boolean
  type: AccountActionType
  onConfirm: () => void
  onClose: () => void
}

/** 로그아웃 / 회원 탈퇴 확인 모달 */
export function AccountConfirmModal({
  isOpen,
  type,
  onConfirm,
  onClose,
}: AccountConfirmModalProps) {
  const { title, description, confirmLabel, confirmColor } = ACCOUNT_ACTION_CONTENT[type]

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={title}>
      <Modal.Header className="flex flex-col gap-2">
        <h2 className="pretendard-Subtitle6 text-Gray-10">{title}</h2>
        <p className="pretendard-Caption2 text-Gray-6 leading-relaxed">{description}</p>
      </Modal.Header>

      <Modal.Footer className="mt-6">
        <Button color={confirmColor} size="semilg" isFullWidth onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button variant="outline" color="assistive" size="semilg" isFullWidth onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
