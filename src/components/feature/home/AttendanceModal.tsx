import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import AttendanceReward from '@/components/feature/home/AttendanceReward'
import AttendanceWeekProgress from '@/components/feature/home/AttendanceWeekProgress'

interface AttendanceModalProps {
  isOpen: boolean
  attendedDays: number
  reward: number
  isAttended?: boolean
  isPending?: boolean
  onClose: () => void
  onComplete: () => void
}

export default function AttendanceModal({
  isOpen,
  attendedDays,
  reward,
  isAttended = false,
  isPending = false,
  onClose,
  onComplete,
}: AttendanceModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="출석 보상" className="rounded-xl px-5 py-6">
      <Modal.Body className="flex flex-col">
        {/* 고정 보너스 안내 */}
        <div className="border-Yellow-80 bg-Yellow-100 rounded-lg border px-4 py-3.5">
          <p className="pretendard-Caption1 text-Gray-6">7일 연속 출석 시</p>
          <p className="pretendard-Button1 text-Gray-9 mt-1">+ 200 AP 추가 보너스</p>
        </div>

        {/* 오늘 출석 보상 */}
        <div className="mt-8">
          <AttendanceReward reward={reward} />
        </div>

        {/* 주간 출석 현황 */}
        <div className="mt-8">
          <AttendanceWeekProgress attendedDays={attendedDays} attendedToday={isAttended} />
        </div>
      </Modal.Body>

      <Modal.Footer className="mt-5">
        <Button
          size="lg"
          color="primary"
          isFullWidth
          disabled={isAttended || isPending}
          onClick={onComplete}
          className="h-15"
        >
          {isPending ? '처리 중...' : '출석 완료'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
