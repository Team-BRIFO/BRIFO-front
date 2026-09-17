import { useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { Toast } from '@/components/common/Toast'
import StockSearchView from '@/components/feature/interest-stock/StockSearchView'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useGetStocksQuery } from '@/hooks/queries/stock/useStockQueries'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { mapInterestStockOption } from '@/mappers/stockMapper'
import { useUpdateMyProfileMutation } from '@/pages/MyPage/hooks/useUpdateMyProfileMutation'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import { PATH } from '@/routes/paths'
import type { UserInterestStock, UserProfileFormValues } from '@/types/domain/user'
import {
  MAX_INTEREST_STOCK_COUNT,
  validateCompanyName,
  validateInterestStockIds,
  validateNickname,
} from '@/utils/profileValidation'

/** 키워드 없이 인기 종목을 조회할 때는 코스피200 전체 순위를 한 번에 받아온다. */
const POPULAR_PAGE_SIZE = 200
/** 키워드 검색은 서버가 허용하는 최대 size(50)를 넘지 않아야 한다. */
const SEARCH_PAGE_SIZE = 20

type StockEditReturnPath = typeof PATH.MY_EDIT | typeof PATH.MY_SETTINGS
type ProfileEditReturnPath = typeof PATH.MY_PAGE | typeof PATH.MY_SETTINGS

interface MyProfileStockEditLocationState {
  profileDraft?: UserProfileFormValues
  returnTo?: StockEditReturnPath
  profileEditReturnTo?: ProfileEditReturnPath
}

/** 프로필 관심종목 변경 — 온보딩의 검색·선택 UI와 프로필 PATCH 흐름을 함께 사용한다. */
export function MyProfileStockEditPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const profileQuery = useUserProfileQuery()
  const updateProfile = useUpdateMyProfileMutation()
  const [selectedStocksOverride, setSelectedStocksOverride] = useState<UserInterestStock[] | null>(
    null,
  )
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isApplyConfirmOpen, setIsApplyConfirmOpen] = useState(false)
  const stockPageSize = searchKeyword.trim() ? SEARCH_PAGE_SIZE : POPULAR_PAGE_SIZE
  const stocksQuery = useGetStocksQuery(searchKeyword, stockPageSize, Boolean(profileQuery.data))
  const locationState = location.state as MyProfileStockEditLocationState | null

  const initialStocks = useMemo(
    () =>
      locationState?.profileDraft?.interestStocks ??
      profileQuery.data?.profileFormValues.interestStocks ??
      [],
    [locationState, profileQuery.data],
  )
  const profileDraft = locationState?.profileDraft
  const returnTo = locationState?.returnTo ?? PATH.MY_SETTINGS
  const profileEditReturnTo = locationState?.profileEditReturnTo ?? PATH.MY_PAGE
  const selectedStocks = selectedStocksOverride ?? initialStocks
  const selectedStockIds = useMemo(() => selectedStocks.map((stock) => stock.id), [selectedStocks])
  const stocks = useMemo(
    () =>
      stocksQuery.data?.pages.flatMap((page) => page.page.items.map(mapInterestStockOption)) ?? [],
    [stocksQuery.data],
  )

  const handleToggleStock = useCallback(
    (stockId: string) => {
      setSelectedStocksOverride((previous) => {
        const current = previous ?? initialStocks
        if (current.some((stock) => stock.id === stockId)) {
          return current.filter((stock) => stock.id !== stockId)
        }
        if (current.length >= MAX_INTEREST_STOCK_COUNT) return current

        const stock = stocks.find((item) => item.id === stockId)
        return stock ? [...current, { id: stock.id, name: stock.name }] : current
      })
    },
    [initialStocks, stocks],
  )

  const currentProfileValues = useMemo<UserProfileFormValues | undefined>(() => {
    if (!profileQuery.data) return undefined

    return {
      nickname: profileDraft?.nickname ?? profileQuery.data.profileFormValues.nickname,
      companyName: profileDraft?.companyName ?? profileQuery.data.profileFormValues.companyName,
      interestStocks: selectedStocks,
    }
  }, [profileDraft, profileQuery.data, selectedStocks])

  const handleBack = () => {
    navigate(returnTo, {
      replace: true,
      state:
        returnTo === PATH.MY_EDIT && currentProfileValues
          ? { profileDraft: currentProfileValues, returnTo: profileEditReturnTo }
          : undefined,
    })
  }

  const handleComplete = () => {
    if (!currentProfileValues || validateInterestStockIds(selectedStockIds)) return

    if (returnTo === PATH.MY_EDIT) {
      navigate(returnTo, {
        replace: true,
        state: { profileDraft: currentProfileValues, returnTo: profileEditReturnTo },
      })
      return
    }

    if (
      validateNickname(currentProfileValues.nickname) ||
      validateCompanyName(currentProfileValues.companyName)
    )
      return

    setIsApplyConfirmOpen(true)
  }

  const handleConfirmApply = () => {
    if (!currentProfileValues) return

    updateProfile.mutate(currentProfileValues, {
      onSuccess: () => {
        setIsApplyConfirmOpen(false)
        navigate(returnTo, {
          replace: true,
        })
      },
    })
  }

  const content =
    !!profileQuery.error && profileQuery.fetchStatus === 'idle' && !profileQuery.data ? (
      <PageErrorView
        title="정보를 불러오지 못했어요."
        error={profileQuery.error}
        onRetry={() => profileQuery.refetch()}
      />
    ) : !profileQuery.data ? (
      <PageLoadingView />
    ) : !searchKeyword.trim() &&
      !!stocksQuery.error &&
      stocksQuery.fetchStatus === 'idle' &&
      !stocksQuery.data ? (
      <PageErrorView
        title="종목을 불러오지 못했어요."
        error={stocksQuery.error}
        onRetry={() => stocksQuery.refetch()}
      />
    ) : !stocksQuery.data && !searchKeyword.trim() ? (
      <PageLoadingView />
    ) : (
      <>
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
          isLoading={stocksQuery.isPending}
          hasNextPage={stocksQuery.hasNextPage}
          isFetchingNextPage={stocksQuery.isFetchingNextPage}
          onLoadMore={() => void stocksQuery.fetchNextPage()}
        />
        {updateProfile.isError && (
          <Toast
            message={
              updateProfile.error.serviceMessage ??
              '관심종목을 저장하지 못했어요. 다시 시도해주세요.'
            }
          />
        )}
      </>
    )

  return (
    <MyPageLayout title="관심종목 변경" onBack={handleBack}>
      {content}
      <Modal
        isOpen={isApplyConfirmOpen}
        onClose={() => setIsApplyConfirmOpen(false)}
        ariaLabel="관심종목 변경 확인"
        className="w-82.5 rounded-xl"
      >
        <Modal.Header className="flex flex-col items-center gap-4 text-center">
          <h2 className="dnf-Title4 text-Gray-10">관심종목을 변경할까요?</h2>
          <p className="font-pretendard text-Gray-6 text-sm leading-5 font-normal tracking-[-0.56px] whitespace-pre-line">
            {'변경한 관심종목은 오늘 진행 중인 의뢰에는 적용되지 않고\n내일부터 적용돼요.'}
          </p>
        </Modal.Header>

        <Modal.Footer className="mt-5 flex flex-col gap-2">
          <Button
            size="lg"
            isFullWidth
            disabled={updateProfile.isPending}
            onClick={handleConfirmApply}
          >
            {updateProfile.isPending ? '처리 중...' : '변경하기'}
          </Button>
          <Button
            color="assistive"
            size="lg"
            isFullWidth
            disabled={updateProfile.isPending}
            onClick={() => setIsApplyConfirmOpen(false)}
          >
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </MyPageLayout>
  )
}
