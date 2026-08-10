import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import StockLogoPlaceholder from '@/assets/images/diary/stock-logo-placeholder.png'
import { Toast } from '@/components/common/Toast'
import StockSearchView from '@/components/feature/onboarding/StockSearchView'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useGetStocksQuery } from '@/hooks/queries/stock/useStockQueries'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { useUpdateMyProfileMutation } from '@/pages/MyPage/hooks/useUpdateMyProfileMutation'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import type { OnboardingStock } from '@/pages/OnboardingPage/mockStocks'
import { PATH } from '@/routes/paths'
import type { UserProfileFormValues } from '@/types/domain/user'
import { MAX_INTEREST_STOCK_COUNT, validateInterestStockIds } from '@/utils/profileValidation'

const STOCK_PAGE_SIZE = 20

type StockEditReturnPath = typeof PATH.MY_EDIT | typeof PATH.MY_SETTINGS

interface MyProfileStockEditLocationState {
  profileDraft?: UserProfileFormValues
  returnTo?: StockEditReturnPath
}

/** 프로필 관심종목 변경 — 온보딩의 검색·선택 UI와 프로필 PATCH 흐름을 함께 사용한다. */
export function MyProfileStockEditPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const profileQuery = useUserProfileQuery()
  const stocksQuery = useGetStocksQuery(
    { request: { size: STOCK_PAGE_SIZE } },
    Boolean(profileQuery.data),
  )
  const updateProfile = useUpdateMyProfileMutation()
  const [selectedStockIdsOverride, setSelectedStockIdsOverride] = useState<string[] | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  const initialStocks = useMemo(
    () =>
      (location.state as MyProfileStockEditLocationState | null)?.profileDraft?.interestStocks ??
      profileQuery.data?.profileFormValues.interestStocks ??
      [],
    [location.state, profileQuery.data],
  )
  const profileDraft = (location.state as MyProfileStockEditLocationState | null)?.profileDraft
  const returnTo =
    (location.state as MyProfileStockEditLocationState | null)?.returnTo ?? PATH.MY_SETTINGS
  const selectedStockIds = selectedStockIdsOverride ?? initialStocks.map((stock) => stock.id)
  const stocks = useMemo<OnboardingStock[]>(
    () =>
      (stocksQuery.data?.page.items ?? []).map((stock) => ({
        id: stock.stockId,
        name: stock.name,
        price: stock.price.toLocaleString('ko-KR'),
        changeRate: stock.changeRate,
        logoUrl: stock.logoUrl ?? StockLogoPlaceholder,
      })),
    [stocksQuery.data],
  )
  const selectedStocks = useMemo(() => {
    const stocksById = new Map(stocks.map((stock) => [stock.id, stock]))
    const initialStocksById = new Map(initialStocks.map((stock) => [stock.id, stock]))

    return selectedStockIds.flatMap((stockId) => {
      const stock = stocksById.get(stockId)
      if (stock) return [{ id: stock.id, name: stock.name }]

      const initialStock = initialStocksById.get(stockId)
      return initialStock ? [{ id: initialStock.id, name: initialStock.name }] : []
    })
  }, [initialStocks, selectedStockIds, stocks])

  const handleToggleStock = (stockId: string) => {
    setSelectedStockIdsOverride((previous) => {
      const current = previous ?? selectedStockIds
      if (current.includes(stockId)) return current.filter((id) => id !== stockId)
      if (current.length >= MAX_INTEREST_STOCK_COUNT) return current
      return [...current, stockId]
    })
  }

  const currentProfileValues = useMemo<UserProfileFormValues | undefined>(() => {
    if (!profileQuery.data) return undefined

    const nameById = new Map(selectedStocks.map((stock) => [stock.id, stock.name]))
    return {
      nickname: profileDraft?.nickname ?? profileQuery.data.profileFormValues.nickname,
      companyName: profileDraft?.companyName ?? profileQuery.data.profileFormValues.companyName,
      interestStocks: selectedStockIds.flatMap((id) => {
        const name = nameById.get(id)
        return name ? [{ id, name }] : []
      }),
    }
  }, [profileDraft, profileQuery.data, selectedStockIds, selectedStocks])

  const handleBack = () => {
    navigate(returnTo, {
      state:
        returnTo === PATH.MY_EDIT && currentProfileValues
          ? { profileDraft: currentProfileValues }
          : undefined,
    })
  }

  const handleComplete = () => {
    if (!currentProfileValues || validateInterestStockIds(selectedStockIds)) return

    updateProfile.mutate(currentProfileValues, {
      onSuccess: () =>
        navigate(returnTo, {
          replace: true,
          state: returnTo === PATH.MY_EDIT ? { profileDraft: currentProfileValues } : undefined,
        }),
    })
  }

  if (!!profileQuery.error && profileQuery.fetchStatus === 'idle' && !profileQuery.data) {
    return (
      <MyPageLayout title="관심종목 변경" onBack={handleBack}>
        <PageErrorView
          title="정보를 불러오지 못했어요."
          error={profileQuery.error}
          onRetry={() => profileQuery.refetch()}
        />
      </MyPageLayout>
    )
  }

  if (!profileQuery.data) {
    return (
      <MyPageLayout title="관심종목 변경" onBack={handleBack}>
        <PageLoadingView />
      </MyPageLayout>
    )
  }

  if (!!stocksQuery.error && stocksQuery.fetchStatus === 'idle' && !stocksQuery.data) {
    return (
      <MyPageLayout title="관심종목 변경" onBack={handleBack}>
        <PageErrorView
          title="종목을 불러오지 못했어요."
          error={stocksQuery.error}
          onRetry={() => stocksQuery.refetch()}
        />
      </MyPageLayout>
    )
  }

  if (!stocksQuery.data) {
    return (
      <MyPageLayout title="관심종목 변경" onBack={handleBack}>
        <PageLoadingView />
      </MyPageLayout>
    )
  }

  return (
    <MyPageLayout title="관심종목 변경" onBack={handleBack}>
      <StockSearchView
        embedded
        stocks={stocks}
        selectedStocks={selectedStocks}
        searchKeyword={searchKeyword}
        selectedStockIds={selectedStockIds}
        onSearchKeywordChange={setSearchKeyword}
        onToggleStock={handleToggleStock}
        onBack={handleBack}
        onComplete={handleComplete}
      />
      {updateProfile.isError && (
        <Toast
          message={
            updateProfile.error.serviceMessage ?? '관심종목을 저장하지 못했어요. 다시 시도해주세요.'
          }
        />
      )}
    </MyPageLayout>
  )
}
