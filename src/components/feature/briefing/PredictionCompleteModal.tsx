import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { AnalyzeCard } from '@/components/feature/stock/AnalyzeCard'

export interface PredictionCompleteModalProps {
  isOpen: boolean
  onClose: () => void
  stock: {
    name: string
    code?: string
    marketType?: string
    logoUrl?: string | null
    price: number
    changeRate: number
    hashtags?: string[]
  }
  earnedPoint: number
  onConfirm?: () => void
}

export function PredictionCompleteModal({
  isOpen,
  onClose,
  stock,
  earnedPoint,
  onConfirm,
}: PredictionCompleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-full w-full flex-col items-center justify-between gap-4">
          {/* 헤더 */}
          <div className="flex flex-col items-center gap-5">
            <h2 className="dnf-Title4 text-Gray-10 m-0">예측 등록 완료!</h2>
            <span className="dnf-Title3 text-Yellow-40">+ {earnedPoint} AP</span>
          </div>

          {/* 주식 정보 카드 */}
          <AnalyzeCard
            type="normal"
            resultType="HASHTAG"
            stock={{
              ...stock,
              tags: stock.hashtags,
            }}
            className="w-full"
          />

          {/* 안내 텍스트 */}
          <p className="pretendard-Caption2 text-Gray-6 gap-0.5 text-center leading-[1.4]">
            <span className="text-Pink-30">오늘 15:30</span> 장 마감에 자동으로 정산돼요.
            <br />
            결과는 알림으로 알려드릴게요!
          </p>
        </div>
        {/* 버튼 */}
        <Button isFullWidth size="lg" color="primary" onClick={onConfirm}>
          확인
        </Button>
      </div>
    </Modal>
  )
}
