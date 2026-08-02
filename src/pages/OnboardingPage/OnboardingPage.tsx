import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/common/Button'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { TextField } from '@/components/common/TextField'
import { Toast } from '@/components/common/Toast'
import InterestStockSection from '@/components/feature/onboarding/InterestStockSection'
import StockSearchView from '@/components/feature/onboarding/StockSearchView'
import { useProfileNameValidation } from '@/hooks/useProfileNameValidation'
import { useOnboardingStocksQuery } from '@/pages/OnboardingPage/hooks/useOnboardingStocksQuery'
import { useUpdateOnboardingProfileMutation } from '@/pages/OnboardingPage/hooks/useUpdateOnboardingProfileMutation'
import { PATH } from '@/routes/paths'
import { useProfileStore } from '@/stores/useProfileStore'

const MIN_STOCK_COUNT = 3
const MAX_STOCK_COUNT = 3

const PROFILE_KEYWORDS = ['현명한투자', '동학개미운동', '일짱회사', 'zI존']

export function OnboardingPage() {
  const navigate = useNavigate()
  const setProfile = useProfileStore((state) => state.setProfile)
  const stocksQuery = useOnboardingStocksQuery()
  const updateProfile = useUpdateOnboardingProfileMutation()
  const stocks = stocksQuery.data ?? []

  const [nickname, setNickname] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedStockIds, setSelectedStockIds] = useState<string[]>([])
  const [isStockSearchOpen, setIsStockSearchOpen] = useState(false)

  const { isValid: hasValidNickname, errorMessage: nicknameError } =
    useProfileNameValidation(nickname)
  const { isValid: hasValidCompanyName, errorMessage: companyNameError } =
    useProfileNameValidation(companyName)

  const hasValidStockCount =
    selectedStockIds.length >= MIN_STOCK_COUNT && selectedStockIds.length <= MAX_STOCK_COUNT

  const isFormValid = hasValidNickname && hasValidCompanyName && hasValidStockCount

  const handleToggleStock = (stockId: string) => {
    setSelectedStockIds((previous) => {
      const isSelected = previous.includes(stockId)

      if (isSelected) {
        return previous.filter((id) => id !== stockId)
      }

      if (previous.length >= MAX_STOCK_COUNT) {
        return previous
      }

      return [...previous, stockId]
    })
  }

  const handleSubmit = () => {
    if (!isFormValid) return

    const profile = {
      nickname: nickname.trim(),
      companyName: companyName.trim(),
      stockIds: selectedStockIds,
    }

    updateProfile.mutate(profile, {
      onSuccess: () => {
        setProfile(profile)
        navigate(PATH.TUTORIAL_INTRO)
      },
    })
  }
  if (isStockSearchOpen) {
    return (
      <StockSearchView
        stocks={stocks}
        searchKeyword={searchKeyword}
        selectedStockIds={selectedStockIds}
        onSearchKeywordChange={setSearchKeyword}
        onToggleStock={handleToggleStock}
        onBack={() => {
          setSearchKeyword('')
          setIsStockSearchOpen(false)
        }}
        onComplete={() => {
          setSearchKeyword('')
          setIsStockSearchOpen(false)
        }}
      />
    )
  }

  return (
    <main className="flex w-full flex-1 flex-col px-4 pt-6 pb-5">
      <StatusBar
        hasStatusArea
        className="w-full [&>div:last-child]:px-0"
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
      />

      <section className="mt-8 flex flex-1 flex-col">
        <div>
          <h1 className="dnf-Title3 text-Gray-10 leading-tight">
            사장님의 프로필을
            <br />
            <span className="text-[#FFBE00]">알려주세요!</span>
          </h1>

          <p className="pretendard-Caption1 text-Gray-6 mt-3">
            닉네임 · 회사명 · 관심 종목 3개를 골라주세요
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-5">
          <TextField
            id="onboarding-nickname"
            name="nickname"
            label="닉네임"
            value={nickname}
            placeholder="4~5글자 제한, 특수문자 금지"
            errorMessage={nicknameError}
            className="[&>span:last-child]:ml-3"
            onChange={(event) => setNickname(event.target.value)}
          />

          <TextField
            id="onboarding-company-name"
            name="companyName"
            label="회사명"
            value={companyName}
            placeholder="4~5글자 제한, 특수문자 금지"
            errorMessage={companyNameError}
            className="[&>span:last-child]:ml-3"
            onChange={(event) => setCompanyName(event.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {PROFILE_KEYWORDS.map((keyword) => (
            <span
              key={keyword}
              className="pretendard-Caption2 bg-Yellow-100 text-Yellow-10 rounded-full px-3 py-1.5"
            >
              # {keyword}
            </span>
          ))}
        </div>

        <InterestStockSection
          stocks={stocks}
          searchKeyword={searchKeyword}
          selectedStockIds={selectedStockIds}
          onToggleStock={handleToggleStock}
          onOpenSearch={() => setIsStockSearchOpen(true)}
        />
      </section>

      <Button
        type="button"
        size="lg"
        color="primary"
        isFullWidth
        disabled={!isFormValid || updateProfile.isPending || stocksQuery.isLoading}
        onClick={handleSubmit}
        className="mt-6 shadow-[0_4px_8px_rgba(168,79,1,0.15)]"
      >
        {updateProfile.isPending ? '저장 중...' : '다음'}
      </Button>

      {(stocksQuery.isError || updateProfile.isError) && (
        <Toast
          message={
            updateProfile.error?.serviceMessage ??
            stocksQuery.error?.serviceMessage ??
            '프로필을 저장하지 못했어요'
          }
        />
      )}
    </main>
  )
}
