import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'

export interface BriefingResultModalProps {
  isOpen: boolean
  isSuccess?: boolean
  points?: number
  stockInfo?: {
    name: string
    changeRate: number
  }
  comment?: string
  resultText?: string
  confidenceLevel?: number
  onAction?: () => void
  onClose: () => void
}

export function BriefingResultModal({
  isOpen,
  isSuccess = true,
  points = 100,
  stockInfo = { name: '삼성전자', changeRate: 8.1 },
  comment = '사장님, 제가 된다고 했잖아요!',
  resultText,
  confidenceLevel = 5,
  onAction,
  onClose,
}: BriefingResultModalProps) {
  const defaultResultText = isSuccess ? '상승 적중' : '상승 예측 빗나감'
  const displayResultText = resultText || defaultResultText

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex h-full w-full flex-col gap-4">
          {/* 1. 헤더 */}
          <div className="flex flex-col items-center gap-5">
            <h2 className="dnf-Title4 text-Gray-10">
              {isSuccess ? '예측 적중!' : '아쉽게도 빗나갔어요'}
            </h2>
            <span className={`dnf-Title3 ${isSuccess ? 'text-Yellow-40' : 'text-Green-40'}`}>
              {isSuccess ? `+ ${points} AP` : `- ${points} AP`}
            </span>
          </div>

          {/* 2. 상세 정보 */}
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="pretendard-Button2 text-Gray-6 m-0">
              {stockInfo.name}
              <span className={isSuccess ? 'text-Pink-30' : 'text-Green-40'}>
                {stockInfo.changeRate}%
              </span>{' '}
              ·{' '}
              <span className={isSuccess ? 'text-Pink-30' : 'text-Green-40'}>
                {displayResultText}
              </span>
            </p>
            <p className="pretendard-Caption2 text-Gray-6 m-0">
              확신도 {confidenceLevel} × 적중 보너스
            </p>
          </div>

          {/* 3. 코멘트 박스 */}
          <div className="bg-Yellow-100 border-Yellow-80 pretendard-Button1 text-Gray-9 box-border w-full rounded-lg border p-3 text-center">
            {comment}
          </div>
        </div>
        {/* 4. 하단 버튼 영역 */}
        <div className="flex w-full flex-col items-center gap-3.5">
          <Button
            isFullWidth
            size="lg"
            color="primary"
            onClick={onAction}
            className="!rounded-full"
          >
            {isSuccess ? '결정일기에서 보기' : '복기 리포트 보기'}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-Gray-6 p-1 text-xs underline underline-offset-2"
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  )
}
