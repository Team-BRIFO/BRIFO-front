import { useState } from 'react'

import Button from '@/components/common/Button'
import { Chip } from '@/components/common/Chip'
import { TextField } from '@/components/common/TextField'
// 대체: domain/agent — AgentCard/AgentChat/UserProfileCard와 동일 아바타
import { AgentAvatar } from '@/components/domain/agent/AgentAvatar'
import type { AgentType } from '@/types/domain/agent'
import type { UserInterestStock, UserProfileFormValues } from '@/types/domain/user'

/**
 * 닉네임 정책.
 * TODO: 피그마 헬퍼 문구는 "4~5글자 제한"이지만 목업 닉네임(포롱)이 2글자라 정책이 상충한다.
 *       기획 확정되면 아래 상수만 조정할 것.
 */
const NICKNAME_MIN_LENGTH = 1
const NICKNAME_MAX_LENGTH = 50

const NICKNAME_HELPER_TEXT = '4~5글자 제한, 특수문자 금지'

const COMPANY_NAME_MAX_LENGTH = 100
const INTEREST_STOCK_MIN_COUNT = 1
const INTEREST_STOCK_MAX_COUNT = 3

function validateNickname(value: string) {
  const trimmed = value.trim()

  if (trimmed.length === 0) return '닉네임을 입력해주세요.'
  if (trimmed.length < NICKNAME_MIN_LENGTH || trimmed.length > NICKNAME_MAX_LENGTH) {
    return '4~5글자 제한을 넘거나 특수문자가 있어요'
  }
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

function validateInterestStocks(stocks: UserInterestStock[]) {
  if (stocks.length < INTEREST_STOCK_MIN_COUNT) return '관심종목을 최소 1개 선택해주세요.'
  if (stocks.length > INTEREST_STOCK_MAX_COUNT) return '관심종목은 최대 3개까지 선택할 수 있어요.'
  if (new Set(stocks.map((stock) => stock.id)).size !== stocks.length) {
    return '중복된 관심종목이 포함되어 있어요.'
  }
  return undefined
}

export interface MyProfileEditProps {
  initialValues: UserProfileFormValues
  /** 프로필에 노출되는 캐릭터 */
  characterType: AgentType
  onSubmit: (values: UserProfileFormValues) => void
  /** 캐릭터 변경 진입 — 미전달 시 텍스트만 표시 */
  onChangeCharacter?: () => void
  isSubmitting?: boolean
}

/** 프로필 편집 화면(SCR-13) 본문 — 캐릭터 · 닉네임 · 회사명 · 관심종목 */
export function MyProfileEdit({
  initialValues,
  characterType,
  onSubmit,
  onChangeCharacter,
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
  const interestStocksError = validateInterestStocks(interestStocks)
  const isValid = !nicknameError && !companyNameError && !interestStocksError

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
    <div className="flex flex-col gap-5 pt-10">
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar type={characterType} size={84} hasCircleBg />
        {onChangeCharacter ? (
          <button
            type="button"
            onClick={onChangeCharacter}
            className="pretendard-Caption1 text-Yellow-20 leading-none"
          >
            사진 변경
          </button>
        ) : (
          <span className="pretendard-Caption1 text-Yellow-20 leading-none">사진 변경</span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <TextField
          label="닉네임"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder={NICKNAME_HELPER_TEXT}
          errorMessage={isSubmitAttempted ? nicknameError : undefined}
          required
        />

        <TextField
          label="회사명"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          placeholder={NICKNAME_HELPER_TEXT}
          errorMessage={isSubmitAttempted ? companyNameError : undefined}
          required
        />

        {/* 피그마 845:5853 — 나의 관심종목 칩 + 종목추가 */}
        <div className="flex flex-col gap-3">
          <span className="pretendard-Body2-Semibold text-Yellow-30">나의 관심종목</span>

          {/* 피그마 845:5855 — 칩 줄 / 종목추가 줄 분리 */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {interestStocks.map((stock) => (
                <Chip
                  key={stock.id}
                  className="bg-Yellow-100 text-Yellow-10"
                  onRemove={() => handleRemoveStock(stock.id)}
                  disabled={interestStocks.length === INTEREST_STOCK_MIN_COUNT}
                >
                  {stock.name}
                </Chip>
              ))}
            </div>

            {/*
              TODO: 「+ 종목추가」 클릭 플로우는 마이 피그마에 화면 전환 명세가 없다.
                    디자인에 문의 후, 온보딩 종목 선택 UI를 그대로 가져와 연결할 것.
                    (참고 피그마: node 1054:5175 — 인기 순위 제외 여부는 디자인 확인)
            */}
            {interestStocks.length < INTEREST_STOCK_MAX_COUNT && (
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="종목 추가 플로우는 디자인 확인 후 연결 예정"
                className="pretendard-Caption1 text-Gray-5 bg-Gray-1 w-fit cursor-not-allowed rounded-[20px] px-3 py-1.5 leading-none"
              >
                + 종목추가
              </button>
            )}
          </div>

          {isSubmitAttempted && interestStocksError && (
            <span className="pretendard-Caption2 text-Pink-30">{interestStocksError}</span>
          )}
        </div>
      </div>

      <Button
        size="lg"
        isFullWidth
        disabled={isSubmitting || (isSubmitAttempted && !isValid)}
        onClick={handleSubmit}
        className="mt-auto"
      >
        설정완료
      </Button>
    </div>
  )
}
