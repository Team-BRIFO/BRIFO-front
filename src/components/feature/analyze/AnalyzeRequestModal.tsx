import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'

export type AnalyzeModalType =
  | 'SUCCESS'
  | 'SHORTAGE'
  | 'EXHAUSTED'
  | 'LLM_FAIL'
  | 'RETRY_COUNT'
  | 'TIME_OVER'
  | 'ERROR'

export interface AnalyzeRequestModalProps {
  isOpen: boolean
  onClose: () => void
  type?: AnalyzeModalType
  errorMessage?: string
  employeeName?: string
  stockName?: string
  shortageAP?: number
  retryCount?: number
  maxRetryCount?: number
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  secondaryDisabled?: boolean
}

function ApShortageBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-Yellow-40 flex flex-col items-center gap-1">
      <span className="pretendard-Caption1 text-Gray-6">{label}</span>
      <span className="dnf-Title3">{value}</span>
    </div>
  )
}

export function AnalyzeRequestModal({
  isOpen,
  onClose,
  type = 'SUCCESS',
  errorMessage,
  employeeName = '프로',
  stockName = '삼성전자',
  shortageAP = 20,
  retryCount = 1,
  maxRetryCount = 3,
  onPrimaryClick,
  onSecondaryClick,
  secondaryDisabled = false,
}: AnalyzeRequestModalProps) {
  // 모달 내용 렌더링 헬퍼
  const renderContent = () => {
    switch (type) {
      case 'SUCCESS':
        return (
          <>
            <Modal.Header className="flex flex-col items-center gap-4 text-center">
              <h2 className="dnf-Title4 text-Gray-10 m-0">분석을 의뢰했어요!</h2>
              <p className="pretendard-Caption2 text-Gray-6 m-0 text-center leading-5 tracking-[-0.04em]">
                루키 · 프로 · 탱커가 {stockName} 보고서를 쓰고 있어요.
                <br />
                사무실에서 진행 상황을 볼 수 있어요!
              </p>
            </Modal.Header>
            <Modal.Footer className="mt-5 flex w-full flex-col items-center gap-2">
              <Button isFullWidth size="lg" color="primary" onClick={onPrimaryClick}>
                내일까지 기다리기
              </Button>
              <Button isFullWidth size="lg" color="assistive" onClick={onSecondaryClick}>
                다른 카드뉴스 더보기
              </Button>
            </Modal.Footer>
          </>
        )
      case 'SHORTAGE':
        return (
          <>
            <Modal.Header className="flex flex-col items-center gap-4 text-center">
              <h2 className="dnf-Title4 text-Gray-10 m-0">AP가 부족해요</h2>
              <ApShortageBadge label="부족한 AP" value={`${shortageAP} AP`} />
              <p className="pretendard-Button2 text-Gray-6 m-0 text-center leading-5 tracking-[-0.04em]">
                사원들에게 일급을 주려면 AP가 더 필요해요.
                <br />
                출석하거나 신용대출로 채울 수 있어요.
              </p>
            </Modal.Header>
            <Modal.Footer className="mt-5 flex w-full flex-col items-center gap-3.5">
              <div className="flex w-full flex-col gap-2">
                <Button isFullWidth size="lg" color="primary" onClick={onPrimaryClick}>
                  복기 리포트 보기
                </Button>
                <Button
                  isFullWidth
                  size="lg"
                  color="secondary"
                  onClick={onSecondaryClick}
                  disabled={secondaryDisabled}
                >
                  신용대출 +200AP (1회한정)
                </Button>
              </div>
              <button
                type="button"
                className="pretendard-Caption1 text-Gray-6 cursor-pointer border-none bg-transparent underline underline-offset-2"
                onClick={onClose}
              >
                다음에 할게요
              </button>
            </Modal.Footer>
          </>
        )
      case 'EXHAUSTED':
        return (
          <>
            <Modal.Header className="flex flex-col items-center gap-4 text-center">
              <h2 className="dnf-Title4 text-Gray-10 m-0">오늘은 여기까지</h2>
              <ApShortageBadge label="부족한 AP" value={`${shortageAP} AP`} />
              <p className="pretendard-Caption2 text-Gray-6 m-0 text-center leading-5 tracking-[-0.04em]">
                출석 보너스도 신용대출도 이미 받았어요.
                <br />
                내일 출석하면 +50 AP를 다시 드릴게요!
              </p>
            </Modal.Header>
            <Modal.Footer className="mt-5 flex w-full flex-col items-center gap-3">
              <Button isFullWidth size="lg" color="primary" onClick={onPrimaryClick}>
                내일까지 기다리기
              </Button>
            </Modal.Footer>
          </>
        )
      case 'LLM_FAIL':
        return (
          <>
            <Modal.Header className="flex flex-col items-center gap-4 text-center">
              <h2 className="dnf-Title4 text-Gray-10 m-0">
                <span className="text-Yellow-40">{employeeName}</span>의 분석이 실패했어요
              </h2>
              <ApShortageBadge label="재의뢰 비용" value={`${shortageAP} AP`} />
              <p className="pretendard-Caption2 text-Gray-6 m-0 text-center leading-5 tracking-[-0.04em] whitespace-pre-wrap">
                {`${employeeName}가 분석에 실패했어요.\n의뢰비는 환불됐어요. 다시 시도할까요?`}
              </p>
            </Modal.Header>
            <Modal.Footer className="mt-5 flex w-full flex-col items-center gap-3.5">
              <Button isFullWidth size="lg" color="primary" onClick={onPrimaryClick}>
                다시 시도하기 ({shortageAP}AP)
              </Button>
              <button
                type="button"
                className="pretendard-Caption1 text-Gray-6 cursor-pointer border-none bg-transparent font-semibold underline underline-offset-2"
                onClick={onClose}
              >
                다음에 할게요
              </button>
            </Modal.Footer>
          </>
        )
      case 'RETRY_COUNT':
        return (
          <>
            <Modal.Header className="flex flex-col items-center gap-4 text-center">
              <h2 className="dnf-Title4 text-Gray-10 m-0">잠시 후 다시 시도해주세요</h2>
              <ApShortageBadge label="오늘 재시도" value={`${retryCount}/${maxRetryCount}`} />
              <p className="pretendard-Caption2 text-Gray-6 m-0 text-center leading-5 tracking-[-0.04em]">
                {employeeName} 분석이 계속 실패하고 있어요.
                <br />
                잠시 후 다시 시도해 주세요.
              </p>
            </Modal.Header>
            <Modal.Footer className="mt-5 flex w-full flex-col items-center gap-3.5">
              <Button isFullWidth size="lg" color="primary" onClick={onPrimaryClick}>
                확인
              </Button>
            </Modal.Footer>
          </>
        )
      case 'TIME_OVER':
        return (
          <>
            <Modal.Header className="flex flex-col items-center gap-4 text-center">
              <h2 className="dnf-Title4 text-Gray-10 m-0">오늘의 의뢰 마감</h2>
              <p className="pretendard-Caption2 text-Gray-6 m-0 text-center leading-5 tracking-[-0.04em]">
                오늘의 브리핑 의뢰 시간이 마감되었어요.
                <br />
                내일 다시 찾아와 주세요!
              </p>
            </Modal.Header>
            <Modal.Footer className="mt-5 flex w-full flex-col items-center gap-3.5">
              <Button isFullWidth size="lg" color="primary" onClick={onPrimaryClick}>
                홈으로 가기
              </Button>
            </Modal.Footer>
          </>
        )
      case 'ERROR':
        return (
          <>
            <Modal.Header className="flex flex-col items-center gap-4 text-center">
              <h2 className="dnf-Title4 text-Gray-10 m-0">안내</h2>
              <p className="pretendard-Caption2 text-Gray-6 m-0 text-center leading-5 tracking-[-0.04em]">
                {errorMessage ?? '오류가 발생했습니다.'}
              </p>
            </Modal.Header>
            <Modal.Footer className="mt-5 flex w-full flex-col items-center gap-3.5">
              <Button isFullWidth size="lg" color="primary" onClick={onClose}>
                확인
              </Button>
            </Modal.Footer>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="분석 의뢰 상태 모달"
      shouldCloseOnOverlayClick={false}
    >
      <div className="flex w-full flex-col items-center">{renderContent()}</div>
    </Modal>
  )
}
