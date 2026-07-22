import { useState } from 'react'

import Button from '@/components/common/Button'
import { Chip } from '@/components/common/Chip'
import { TextField } from '@/components/common/TextField'
import { AgentAvatar } from '@/components/domain/agent/AgentAvatar'
import type { AgentType } from '@/types/domain/agent'
import type { UserInterestStock, UserProfileFormValues } from '@/types/domain/user'

/**
 * 닉네임 정책.
 * TODO: 피그마 헬퍼 문구는 "4~5글자 제한"이지만 목업 닉네임(포롱)이 2글자라 정책이 상충한다.
 *       기획 확정되면 아래 상수만 조정할 것.
 */
const NICKNAME_MIN_LENGTH = 2
const NICKNAME_MAX_LENGTH = 5
const NICKNAME_ALLOWED_PATTERN = /^[가-힣a-zA-Z0-9]+$/

const NICKNAME_HELPER_TEXT = `${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}글자 제한, 특수문자 금지`

const COMPANY_NAME_MAX_LENGTH = 20

function validateNickname(value: string) {
  const trimmed = value.trim()

  if (trimmed.length === 0) return '닉네임을 입력해주세요.'
  if (trimmed.length < NICKNAME_MIN_LENGTH || trimmed.length > NICKNAME_MAX_LENGTH) {
    return NICKNAME_HELPER_TEXT
  }
  if (!NICKNAME_ALLOWED_PATTERN.test(trimmed)) return '특수문자는 사용할 수 없어요.'

  return undefined
}

function validateCompanyName(value: string) {
  const trimmed = value.trim()

  if (trimmed.length === 0) return '회사명을 입력해주세요.'
  if (trimmed.length > COMPANY_NAME_MAX_LENGTH) {
    return `회사명은 ${COMPANY_NAME_MAX_LENGTH}글자까지 입력할 수 있어요.`
  }

  return undefined
}

export interface MyProfileEditProps {
  initialValues: UserProfileFormValues
  /** 프로필에 노출되는 캐릭터 */
  characterType: AgentType
  onSubmit: (values: UserProfileFormValues) => void
  /** 캐릭터 변경 진입 — 미전달 시 변경 버튼을 숨긴다 */
  onChangeCharacter?: () => void
  /** 관심종목 추가 진입 (종목 선택 화면) */
  onAddInterestStock?: () => void
  isSubmitting?: boolean
}

/** 프로필 편집 화면(SCR-13) 본문 — 캐릭터 · 닉네임 · 회사명 · 관심종목 */
export function MyProfileEdit({
  initialValues,
  characterType,
  onSubmit,
  onChangeCharacter,
  onAddInterestStock,
  isSubmitting = false,
}: MyProfileEditProps) {
  const [nickname, setNickname] = useState(initialValues.nickname)
  const [companyName, setCompanyName] = useState(initialValues.companyName)
  const [interestStocks, setInterestStocks] = useState<UserInterestStock[]>(
    initialValues.interestStocks,
  )
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)

  const nicknameError = validateNickname(nickname)
  const companyNameError = validateCompanyName(companyName)
  const isValid = !nicknameError && !companyNameError

  const handleRemoveStock = (stockId: string) => {
    setInterestStocks((prev) => prev.filter((stock) => stock.id !== stockId))
  }

  const handleSubmit = () => {
    setIsSubmitAttempted(true)
    if (!isValid) return

    onSubmit({
      nickname: nickname.trim(),
      companyName: companyName.trim(),
      interestStocks,
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3">
        <AgentAvatar type={characterType} size={96} hasCircleBg />
        {onChangeCharacter && (
          <Button variant="outline" color="assistive" size="sm" onClick={onChangeCharacter}>
            캐릭터 변경
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <TextField
          label="닉네임"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="닉네임을 입력해주세요"
          helperText={NICKNAME_HELPER_TEXT}
          errorMessage={isSubmitAttempted ? nicknameError : undefined}
          required
        />

        <TextField
          label="회사명"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          placeholder="회사명을 입력해주세요"
          errorMessage={isSubmitAttempted ? companyNameError : undefined}
          required
        />

        {/*
          TODO: 종목 선택 UI는 온보딩(components/feature/onboarding)과 stock 도메인에 이미 존재한다.
                재사용 가능한 종목 선택 컴포넌트가 정리되면 아래 Chip 나열을 그것으로 교체할 것.
        */}
        <div className="flex flex-col gap-1.5">
          <span className="pretendard-Body2-Regular text-Gray-9">관심종목</span>

          <div className="flex flex-wrap items-center gap-2">
            {interestStocks.map((stock) => (
              <Chip key={stock.id} onRemove={() => handleRemoveStock(stock.id)}>
                {stock.name}
              </Chip>
            ))}

            {onAddInterestStock && (
              <Button variant="outline" color="assistive" size="sm" onClick={onAddInterestStock}>
                + 추가
              </Button>
            )}
          </div>

          {interestStocks.length === 0 && (
            <span className="pretendard-Caption2 text-Gray-5">
              관심종목을 추가하면 관련 브리핑을 먼저 받아볼 수 있어요.
            </span>
          )}
        </div>
      </div>

      <Button
        size="lg"
        isFullWidth
        disabled={isSubmitting || (isSubmitAttempted && !isValid)}
        onClick={handleSubmit}
      >
        설정완료
      </Button>
    </div>
  )
}
