import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { formatWon } from '@/components/domain/ap/apTransactionMeta'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { StatusMessage } from '@/components/feedback/StatusMessage'
import { useConfirmPaymentMutation } from '@/hooks/queries/payment/usePaymentQueries'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import { PATH } from '@/routes/paths'

/** 토스페이먼츠 결제창 성공 리다이렉트 — ?paymentKey=&orderId=&amount= 로 돌아온다 */
export function ChargeSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const confirmPaymentMutation = useConfirmPaymentMutation()
  const hasRequested = useRef(false)

  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')
  const hasValidParams = !!paymentKey && !!orderId && !!amount

  useEffect(() => {
    if (hasRequested.current || !hasValidParams) return
    hasRequested.current = true

    confirmPaymentMutation.mutate({ paymentKey, orderId, amount: Number(amount) })
    // 최초 진입 시 한 번만 승인 요청을 보낸다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasValidParams])

  if (!hasValidParams || confirmPaymentMutation.isError) {
    return (
      <MyPageLayout title="자금 충전">
        <PageErrorView
          error={confirmPaymentMutation.error}
          title="충전에 실패했어요"
          description="결제가 완료되지 않았어요. 다시 시도해 주세요."
          onRetry={() => navigate(PATH.MY_CHARGE, { replace: true })}
        />
      </MyPageLayout>
    )
  }

  if (!confirmPaymentMutation.isSuccess) {
    return (
      <MyPageLayout title="자금 충전">
        <PageLoadingView headerText="충전 확인 중..." title="결제를 확인하고 있어요" />
      </MyPageLayout>
    )
  }

  return (
    <MyPageLayout title="자금 충전">
      <StatusMessage
        title="충전이 완료됐어요!"
        description={`${formatWon(Number(amount))}이 자금에 반영됐어요.\n현재 잔액 ${formatWon(confirmPaymentMutation.data.balanceAp)}`}
        buttonText="마이페이지로"
        onButtonClick={() => navigate(PATH.MY_PAGE, { replace: true })}
      />
    </MyPageLayout>
  )
}
