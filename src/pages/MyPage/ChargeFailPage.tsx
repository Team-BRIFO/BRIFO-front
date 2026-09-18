import { useNavigate, useSearchParams } from 'react-router-dom'

import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import { PATH } from '@/routes/paths'

/** 토스페이먼츠 결제창 실패 리다이렉트 — ?code=&message=&orderId= 로 돌아온다 */
export function ChargeFailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const message = searchParams.get('message') ?? '결제가 취소됐거나 실패했어요.'

  const handleRetry = () => navigate(PATH.MY_CHARGE, { replace: true })

  return (
    <MyPageLayout title="자금 충전">
      <Modal isOpen onClose={handleRetry} ariaLabel="충전 실패" shouldCloseOnOverlayClick={false}>
        <Modal.Header className="flex flex-col items-center gap-2 text-center">
          <h2 className="dnf-Subtitle2 text-Gray-10 m-0">결제를 완료하지 못했어요</h2>
          <p className="pretendard-Caption1 text-Gray-6 m-0 text-center leading-[132%]">
            {message}
          </p>
        </Modal.Header>
        <Modal.Footer className="mt-5">
          <Button isFullWidth size="lg" color="primary" onClick={handleRetry}>
            다시 시도하기
          </Button>
        </Modal.Footer>
      </Modal>
    </MyPageLayout>
  )
}
