import { useNavigate, useSearchParams } from 'react-router-dom'

import { StatusMessage } from '@/components/feedback/StatusMessage'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import { PATH } from '@/routes/paths'

/** 토스페이먼츠 결제창 실패 리다이렉트 — ?code=&message=&orderId= 로 돌아온다 */
export function ChargeFailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const message = searchParams.get('message') ?? '결제가 취소됐거나 실패했어요.'

  return (
    <MyPageLayout title="자금 충전">
      <StatusMessage
        title="결제를 완료하지 못했어요"
        description={message}
        buttonText="다시 시도하기"
        onButtonClick={() => navigate(PATH.MY_CHARGE, { replace: true })}
      />
    </MyPageLayout>
  )
}
