import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'

import AttendanceReward from './AttendanceReward'
import AttendanceWeekProgress from './AttendanceWeekProgress'

interface AttendanceModalProps {
  isOpen: boolean
  attendedDays: number
  reward: number
  onClose: () => void
  onComplete: () => void
}

export default function AttendanceModal({
  isOpen,
  attendedDays,
  reward,
  onClose,
  onComplete,
}: AttendanceModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="출석 보상"
      className="w-82.5 rounded-xl px-5 py-6"
    >
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
          <AttendanceWeekProgress attendedDays={attendedDays} />
        </div>
      </Modal.Body>

      <Modal.Footer className="mt-5">
        <Button size="lg" color="primary" isFullWidth onClick={onComplete} className="h-15">
          출석 완료
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
