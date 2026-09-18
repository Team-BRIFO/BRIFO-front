import { useState } from 'react'

import Button from '@/components/common/Button'
import { formatWon } from '@/components/domain/ap/apTransactionMeta'
import { useReadyPaymentMutation } from '@/hooks/queries/payment/usePaymentQueries'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import { PATH } from '@/routes/paths'

const PRESET_AMOUNTS = [1_000, 3_000, 5_000, 10_000, 30_000, 50_000]
/** 결제 1원당 지급되는 게임 자금 배율 (서버 PaymentService와 동일한 값) */
const CHARGE_EXCHANGE_MULTIPLIER = 50

/** 자금 충전 — 토스페이먼츠 결제창(카드) 연동 */
export function ChargePage() {
  const [amount, setAmount] = useState(PRESET_AMOUNTS[2])
  const [customAmount, setCustomAmount] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const readyPaymentMutation = useReadyPaymentMutation()

  const selectPreset = (value: number) => {
    setAmount(value)
    setCustomAmount('')
    setErrorMessage(null)
  }

  const handleCustomAmountChange = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '')
    setCustomAmount(digitsOnly)
    setAmount(digitsOnly ? Number(digitsOnly) : 0)
    setErrorMessage(null)
  }

  const handleCharge = async () => {
    if (amount < 1_000) {
      setErrorMessage('충전 금액은 1,000원 이상이어야 해요.')
      return
    }
    setErrorMessage(null)
    setIsRedirecting(true)

    try {
      const { orderId, clientKey } = await readyPaymentMutation.mutateAsync({ amount })
      const { loadTossPayments, ANONYMOUS } = await import('@tosspayments/tosspayments-sdk')
      const tossPayments = await loadTossPayments(clientKey)
      const payment = tossPayments.payment({ customerKey: ANONYMOUS })

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: amount },
        orderId,
        orderName: '브리포 자금 충전',
        successUrl: `${window.location.origin}${PATH.MY_CHARGE_SUCCESS}`,
        failUrl: `${window.location.origin}${PATH.MY_CHARGE_FAIL}`,
        card: { useEscrow: false, flowMode: 'DEFAULT', useCardPoint: false },
      })
    } catch (error) {
      setIsRedirecting(false)
      setErrorMessage(error instanceof Error ? error.message : '결제 요청 중 오류가 발생했어요.')
    }
  }

  return (
    <MyPageLayout title="자금 충전">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => selectPreset(preset)}
              className={`dnf-Caption1 rounded-lg border px-3 py-3 text-center ${
                amount === preset && !customAmount
                  ? 'border-Pink-30 bg-Pink-60 text-Pink-30'
                  : 'border-Gray-2 bg-White text-Gray-9'
              }`}
            >
              {formatWon(preset)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="custom-amount" className="pretendard-Caption2 text-Gray-6">
            직접 입력
          </label>
          <input
            id="custom-amount"
            type="text"
            inputMode="numeric"
            placeholder="충전할 금액을 입력하세요"
            value={customAmount}
            onChange={(event) => handleCustomAmountChange(event.target.value)}
            className="border-Gray-2 dnf-Caption1 text-Gray-10 rounded-lg border px-4 py-3 outline-none"
          />
        </div>

        <div className="border-Gray-2 bg-Background1 flex flex-col gap-1.5 rounded-lg border px-4 py-3.5">
          <div className="flex items-center justify-between">
            <span className="pretendard-Caption2 text-Gray-6">결제 금액</span>
            <span className="pretendard-Caption1 text-Gray-8">{formatWon(amount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="pretendard-Caption2 text-Gray-6">지급되는 자금</span>
            <span className="dnf-Subtitle3 text-Gray-10">
              {formatWon(amount * CHARGE_EXCHANGE_MULTIPLIER)}
            </span>
          </div>
        </div>

        {errorMessage && (
          <p role="alert" className="pretendard-Caption2 text-Pink-30 text-center">
            {errorMessage}
          </p>
        )}

        <Button
          size="lg"
          color="primary"
          isFullWidth
          disabled={amount < 1_000 || isRedirecting || readyPaymentMutation.isPending}
          onClick={handleCharge}
        >
          {isRedirecting || readyPaymentMutation.isPending
            ? '결제창으로 이동 중...'
            : `${formatWon(amount)} 결제하기`}
        </Button>

        <p className="pretendard-Caption3 text-Gray-6 text-center leading-5">
          테스트 결제입니다. 실제 카드가 청구되지 않아요.
        </p>
      </div>
    </MyPageLayout>
  )
}
