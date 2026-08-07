import { useState } from 'react'

import Button from '@/components/common/Button'
import { Chip } from '@/components/common/Chip'
import { TextField } from '@/components/common/TextField'
// 대체: domain/agent — AgentCard/AgentChat/UserProfileCard와 동일 아바타
import { AgentAvatar } from '@/components/domain/agent/AgentAvatar'
import type { AgentType } from '@/types/domain/agent'
import type { UserInterestStock, UserProfileFormValues } from '@/types/domain/user'
import {
  MAX_INTEREST_STOCK_COUNT,
  MIN_INTEREST_STOCK_COUNT,
  normalizeProfileText,
  PROFILE_INPUT_PLACEHOLDER,
  validateCompanyName,
  validateInterestStockIds,
  validateNickname,
} from '@/utils/profileValidation'

export interface MyProfileEditProps {
  initialValues: UserProfileFormValues
  /** 프로필에 노출되는 캐릭터 */
  characterType: AgentType
  onSubmit: (values: UserProfileFormValues) => void
  /** 캐릭터 변경 진입 — 미전달 시 텍스트만 표시 */
  onChangeCharacter?: () => void
  isSubmitting?: boolean
  /** 클라이언트 유효성 오류와 구분해 표시하는 서버 저장 오류 */
  serverError?: string
}

/** 프로필 편집 화면(SCR-13) 본문 — 캐릭터 · 닉네임 · 회사명 · 관심종목 */
export function MyProfileEdit({
  initialValues,
  characterType,
  onSubmit,
  onChangeCharacter,
  isSubmitting = false,
  serverError,
}: MyProfileEditProps) {
  const [nickname, setNickname] = useState(initialValues.nickname)
  const [companyName, setCompanyName] = useState(initialValues.companyName)
  const [interestStocks, setInterestStocks] = useState<UserInterestStock[]>(
    initialValues.interestStocks,
  )
  const nicknameError = validateNickname(nickname)
  const companyNameError = validateCompanyName(companyName)
  const interestStocksError = validateInterestStockIds(interestStocks.map((stock) => stock.id))
  const isValid = !nicknameError && !companyNameError && !interestStocksError

  const handleRemoveStock = (stockId: string) => {
    setInterestStocks((prev) => prev.filter((stock) => stock.id !== stockId))
  }

  const handleSubmit = () => {
    if (!isValid) return

    onSubmit({
      nickname: normalizeProfileText(nickname),
      companyName: normalizeProfileText(companyName),
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
          placeholder={PROFILE_INPUT_PLACEHOLDER}
          errorMessage={nicknameError}
          required
        />

        <TextField
          label="회사명"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          placeholder={PROFILE_INPUT_PLACEHOLDER}
          errorMessage={companyNameError}
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
                  disabled={interestStocks.length === MIN_INTEREST_STOCK_COUNT}
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
            {interestStocks.length < MAX_INTEREST_STOCK_COUNT && (
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="종목 추가 플로우는 디자인 확인 후 연결 예정"
                className="pretendard-Caption1 text-Gray-5 bg-Background1 w-fit cursor-not-allowed rounded-[20px] px-3 py-1.5 leading-none"
              >
                + 종목추가
              </button>
            )}
          </div>

          {interestStocksError && (
            <span className="pretendard-Caption2 text-Pink-30">{interestStocksError}</span>
          )}
        </div>
      </div>

      {serverError && (
        <p role="alert" className="pretendard-Caption1 text-Pink-30 text-center">
          저장 오류: {serverError}
        </p>
      )}

      <Button
        size="lg"
        isFullWidth
        disabled={isSubmitting || !isValid}
        onClick={handleSubmit}
        className="mt-auto"
      >
        {isSubmitting ? '저장 중...' : '설정완료'}
      </Button>
    </div>
  )
}
