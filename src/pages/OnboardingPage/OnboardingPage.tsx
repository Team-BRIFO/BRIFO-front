import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/common/Button'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import { TextField } from '@/components/common/TextField'
import { Toast } from '@/components/common/Toast'
import InterestStockSection from '@/components/feature/interest-stock/InterestStockSection'
import StockSearchView from '@/components/feature/interest-stock/StockSearchView'
import { useSignupCsrfBootstrap } from '@/hooks/auth/useSignupCsrfBootstrap'
import { mapInterestStockOption } from '@/mappers/stockMapper'
import { useOnboardingStocksQuery } from '@/pages/OnboardingPage/hooks/useOnboardingStocksQuery'
import { useUpdateOnboardingProfileMutation } from '@/pages/OnboardingPage/hooks/useUpdateOnboardingProfileMutation'
import { PATH } from '@/routes/paths'
import type { UserInterestStock } from '@/types/domain/user'
import {
  DEFAULT_COMPANY_NAME,
  MAX_INTEREST_STOCK_COUNT,
  normalizeProfileText,
  PROFILE_INPUT_PLACEHOLDER,
  validateCompanyName,
  validateInterestStockIds,
  validateNickname,
} from '@/utils/profileValidation'

const PROFILE_KEYWORDS = ['현명한투자', '동학개미운동', '일짱회사', 'zI존']

export function OnboardingPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [companyName, setCompanyName] = useState(DEFAULT_COMPANY_NAME)
  const [isNicknameTouched, setIsNicknameTouched] = useState(false)
  const [isCompanyNameTouched, setIsCompanyNameTouched] = useState(false)
  const [hasVisitedStockSelection, setHasVisitedStockSelection] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedStocks, setSelectedStocks] = useState<UserInterestStock[]>([])
  const [isStockSearchOpen, setIsStockSearchOpen] = useState(false)
  const stocksQuery = useOnboardingStocksQuery(searchKeyword)
  const updateProfile = useUpdateOnboardingProfileMutation()
  const { isCsrfReady, isCsrfError, retryCsrf } = useSignupCsrfBootstrap()

  const stocks = useMemo(
    () =>
      stocksQuery.data?.pages.flatMap((page) => page.page.items.map(mapInterestStockOption)) ?? [],
    [stocksQuery.data],
  )
  const selectedStockIds = useMemo(() => selectedStocks.map((stock) => stock.id), [selectedStocks])

  const nicknameError = validateNickname(nickname)
  const companyNameError = validateCompanyName(companyName)
  const interestStocksError = validateInterestStockIds(selectedStockIds)
  const isFormValid = !nicknameError && !companyNameError && !interestStocksError

  const handleToggleStock = (stockId: string) => {
    setHasVisitedStockSelection(true)
    setSelectedStocks((previous) => {
      const isSelected = previous.some((stock) => stock.id === stockId)

      if (isSelected) {
        return previous.filter((stock) => stock.id !== stockId)
      }

      if (previous.length >= MAX_INTEREST_STOCK_COUNT) {
        return previous
      }

      const stock = stocks.find((item) => item.id === stockId)
      return stock ? [...previous, { id: stock.id, name: stock.name }] : previous
    })
  }

  const handleSubmit = () => {
    if (!isFormValid) return

    const profile = {
      nickname: normalizeProfileText(nickname),
      companyName: normalizeProfileText(companyName),
      stockIds: selectedStockIds,
    }

    updateProfile.mutate(profile, {
      onSuccess: () => {
        navigate(PATH.TUTORIAL_INTRO)
      },
    })
  }
  if (isStockSearchOpen) {
    return (
      <StockSearchView
        stocks={stocks}
        selectedStocks={selectedStocks}
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
        isLoading={stocksQuery.isPending}
        hasNextPage={stocksQuery.hasNextPage}
        isFetchingNextPage={stocksQuery.isFetchingNextPage}
        onLoadMore={() => void stocksQuery.fetchNextPage()}
      />
    )
  }

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col overflow-hidden px-4 pb-5">
      <StatusBar
        hasStatusArea={false}
        className="w-full [&>div:last-child]:px-0"
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
      />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <section className="mt-8 flex flex-col">
          <div>
            <h1 className="dnf-Title3 text-Gray-10 leading-tight">
              사장님의 프로필을
              <br />
              <span className="text-[#FFBE00]">알려주세요!</span>
            </h1>

            <p className="pretendard-Caption1 text-Gray-6 mt-3">
              닉네임 · 회사명 · 관심 종목 1~3개를 골라주세요
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-5">
            <TextField
              id="onboarding-nickname"
              name="nickname"
              label="닉네임"
              value={nickname}
              placeholder={PROFILE_INPUT_PLACEHOLDER}
              errorMessage={isNicknameTouched ? nicknameError : undefined}
              required
              className="[&>span:last-child]:ml-3"
              onChange={(event) => {
                setNickname(event.target.value)
                setIsNicknameTouched(true)
              }}
            />

            <TextField
              id="onboarding-company-name"
              name="companyName"
              label="회사명"
              value={companyName}
              placeholder={PROFILE_INPUT_PLACEHOLDER}
              errorMessage={isCompanyNameTouched ? companyNameError : undefined}
              required
              className="[&>span:last-child]:ml-3"
              onChange={(event) => {
                setCompanyName(event.target.value)
                setIsCompanyNameTouched(true)
              }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-1">
            {PROFILE_KEYWORDS.map((keyword) => {
              const isSelected = companyName === keyword

              return (
                <button
                  key={keyword}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`회사명을 ${keyword}(으)로 채우기`}
                  onClick={() => {
                    setCompanyName(keyword)
                    setIsCompanyNameTouched(true)
                  }}
                  className={`pretendard-Caption2 focus-visible:ring-Yellow-45 rounded-full px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                    isSelected
                      ? 'bg-Yellow-45 text-Yellow-5'
                      : 'bg-Yellow-100 text-Yellow-10 hover:bg-Yellow-80'
                  }`}
                >
                  # {keyword}
                </button>
              )
            })}
          </div>

          <InterestStockSection
            stocks={stocks}
            searchKeyword={searchKeyword}
            selectedStockIds={selectedStockIds}
            selectedStocks={selectedStocks}
            onToggleStock={handleToggleStock}
            onOpenSearch={() => {
              setHasVisitedStockSelection(true)
              setIsStockSearchOpen(true)
            }}
            errorMessage={hasVisitedStockSelection ? interestStocksError : undefined}
          />
        </section>
      </div>

      <Button
        type="button"
        size="lg"
        color="primary"
        isFullWidth
        disabled={!isFormValid || updateProfile.isPending || stocksQuery.isLoading || !isCsrfReady}
        onClick={handleSubmit}
        className="mt-6 shrink-0 shadow-[0_4px_8px_rgba(168,79,1,0.15)]"
      >
        {updateProfile.isPending ? '저장 중...' : '다음'}
      </Button>

      {(isCsrfError || stocksQuery.isError || updateProfile.isError) && (
        <Toast
          message={
            isCsrfError
              ? '온보딩 정보를 불러오지 못했어요'
              : (updateProfile.error?.serviceMessage ??
                stocksQuery.error?.serviceMessage ??
                '프로필을 저장하지 못했어요')
          }
        />
      )}

      {isCsrfError && (
        <Button
          type="button"
          size="lg"
          color="secondary"
          isFullWidth
          className="mt-3"
          onClick={() => void retryCsrf()}
        >
          다시 시도
        </Button>
      )}
    </main>
  )
}
