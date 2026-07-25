import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'

export type AccountActionType = 'logout' | 'withdraw'

interface AccountActionContent {
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  /** true면 취소(Primary)가 위, 확인(Secondary)이 아래 — 탈퇴 플로우 */
  isConfirmSecondary?: boolean
}

const ACCOUNT_ACTION_CONTENT: Record<AccountActionType, AccountActionContent> = {
  logout: {
    title: '로그아웃 하시겠어요?',
    description: '',
    confirmLabel: '예',
    cancelLabel: '아니요',
  },
  withdraw: {
    title: '탈퇴하시겠습니까?',
    description: '탈퇴시 구매하신 AP는 되돌아오지 않으며\n서비스 이용료는 환불 되지않습니다.',
    confirmLabel: '그래도 탈퇴하기',
    cancelLabel: '서비스로 돌아가기',
    isConfirmSecondary: true,
  },
}

export interface AccountConfirmModalProps {
  isOpen: boolean
  type: AccountActionType
  onConfirm: () => void
  onClose: () => void
  isConfirming?: boolean
  errorMessage?: string
}

/** 로그아웃 / 회원 탈퇴 확인 모달 — 피그마 탈퇴 로그아웃 모달 */
export function AccountConfirmModal({
  isOpen,
  type,
  onConfirm,
  onClose,
  isConfirming = false,
  errorMessage,
}: AccountConfirmModalProps) {
  const { title, description, confirmLabel, cancelLabel, isConfirmSecondary } =
    ACCOUNT_ACTION_CONTENT[type]

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={title} className="w-[330px] rounded-xl">
      <Modal.Header className="flex flex-col items-center gap-4 text-center">
        <h2 className="dnf-Title4 text-Gray-10">{title}</h2>
        {description && (
          <p className="font-pretendard text-Gray-6 text-[14px] leading-5 font-normal tracking-[-0.56px] whitespace-pre-line">
            {description}
          </p>
        )}
        {errorMessage && <p className="pretendard-Caption2 text-Pink-30">{errorMessage}</p>}
      </Modal.Header>

      <Modal.Footer className="mt-5 flex flex-col gap-2">
        {isConfirmSecondary ? (
          <>
            <Button size="lg" isFullWidth disabled={isConfirming} onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button
              color="assistive"
              size="lg"
              isFullWidth
              disabled={isConfirming}
              onClick={onConfirm}
            >
              {isConfirming ? '처리 중...' : confirmLabel}
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" isFullWidth disabled={isConfirming} onClick={onConfirm}>
              {isConfirming ? '처리 중...' : confirmLabel}
            </Button>
            <Button
              color="assistive"
              size="lg"
              isFullWidth
              disabled={isConfirming}
              onClick={onClose}
            >
              {cancelLabel}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  )
}
