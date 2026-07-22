import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Button from '@/components/common/Button'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import UserAgreementItem from '@/components/feature/onboarding/UserAgreementItem'
import { PATH } from '@/routes/paths'

import { type AgreementId, AGREEMENTS } from './agreement'

type AgreementCheckedState = Record<AgreementId, boolean>

interface AgreementLocationState {
  checkedAgreementId?: AgreementId
}

const INITIAL_CHECKED_STATE: AgreementCheckedState = {
  age: false,
  service: false,
  privacy: false,
  investment: false,
  marketing: false,
}

const REQUIRED_AGREEMENT_IDS: AgreementId[] = ['age', 'service', 'privacy', 'investment']

export default function AgreementPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [checked, setChecked] = useState<AgreementCheckedState>(INITIAL_CHECKED_STATE)
  const isAllChecked = Object.values(checked).every(Boolean)
  const isRequiredChecked = REQUIRED_AGREEMENT_IDS.every((id) => checked[id])

  useEffect(() => {
    const state = location.state as AgreementLocationState | null
    const checkedAgreementId = state?.checkedAgreementId

    if (!checkedAgreementId) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked((previous) => ({
      ...previous,
      [checkedAgreementId]: true,
    }))
    navigate(PATH.AGREEMENT, {
      replace: true,

      state: null,
    })
  }, [location.state, navigate])

  const handleToggle = (id: AgreementId) => {
    setChecked((previous) => ({
      ...previous,
      [id]: !previous[id],
    }))
  }

  const handleToggleAll = () => {
    const nextChecked = !isAllChecked

    setChecked({
      age: nextChecked,
      service: nextChecked,
      privacy: nextChecked,
      investment: nextChecked,
      marketing: nextChecked,
    })
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-90 flex-col bg-white px-4 pt-6 pb-5">
      <StatusBar
        hasStatusArea
        className="w-full [&>div:last-child]:px-0"
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        title="약관동의"
      />

      <div className="mt-8">
        <h1 className="dnf-Title3 text-Gray-10 leading-[1.2] whitespace-pre-line">
          시작하기 전에{'\n'}
          <span className="text-[#FFBE00]">약관에 동의해주세요</span>
        </h1>
      </div>

      <div className="mt-8">
        <UserAgreementItem
          label="약관에 전체 동의"
          checked={isAllChecked}
          showType={false}
          variant="all"
          onToggle={handleToggleAll}
          className="pretendard-Body2-Semibold text-Gray-9"
        />

        <div className="border-Gray-2 mt-2 border-t">
          {AGREEMENTS.map((agreement) => (
            <UserAgreementItem
              key={agreement.id}
              label={agreement.label}
              type={agreement.type}
              checked={checked[agreement.id]}
              onToggle={() => handleToggle(agreement.id)}
              onView={() =>
                navigate(PATH.AGREEMENT_DETAIL, {
                  state: {
                    agreementId: agreement.id,
                  },
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <Button isFullWidth disabled={!isRequiredChecked} onClick={() => navigate(PATH.ONBOARDING)}>
          다음
        </Button>
      </div>
    </main>
  )
}
