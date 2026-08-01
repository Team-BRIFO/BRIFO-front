import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { DiaryCalendar } from '@/components/feature/diary/DiaryCalendar'
import { DiaryList } from '@/components/feature/diary/DiaryList'
import { DiaryStatistics } from '@/components/feature/diary/DiaryStatistics'
import { DiaryTabScreen } from '@/components/feature/diary/DiaryTabScreen'
import type { DiaryView } from '@/components/feature/diary/DiaryViewTabs'
import { PageErrorView } from '@/components/feature/error/PageErrorView'
import { PageLoadingView } from '@/components/feature/error/PageLoadingView'
import Logo from '@/components/logos/logo-small.svg?react'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import {
  useDiaryCalendarQuery,
  useDiaryListQuery,
  useDiaryStatisticsQuery,
} from '@/pages/DiaryPage/hooks/useDiaryQueries'
import { MOCK_DIARY_MONTH, MOCK_DIARY_YEAR } from '@/pages/DiaryPage/mockDiary'
import { PATH } from '@/routes/paths'
import { shiftMonth } from '@/utils/diaryCalendar'

/** 탭 상태를 담는 쿼리 파라미터 키 (/diary?view=statistics) */
const VIEW_PARAM = 'view'

const DIARY_VIEWS: DiaryView[] = ['calendar', 'list', 'statistics']

/** 쿼리 파라미터 문자열이 유효한 탭 값인지 확인 (아니면 기본 탭으로 폴백) */
function isDiaryView(value: string | null): value is DiaryView {
  return value !== null && DIARY_VIEWS.includes(value as DiaryView)
}

/**
 * 피드 탭 - SCR-08~10: 결정 일기 (캘린더 · 리스트 · 통계)
 * 세 뷰를 한 라우트에서 탭으로 전환하고, 선택된 탭은 쿼리 파라미터에 남겨 딥링크·뒤로가기를 지원한다.
 */
export function DiaryPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const viewParam = searchParams.get(VIEW_PARAM)
  const view: DiaryView = isDiaryView(viewParam) ? viewParam : 'calendar'

  // TODO: mock 의 기준 월 대신 오늘 날짜로 초기화 (실 API 연동 시)
  const [{ year, month }, setViewMonth] = useState({
    year: MOCK_DIARY_YEAR,
    month: MOCK_DIARY_MONTH,
  })

  const calendarQuery = useDiaryCalendarQuery(year, month, view === 'calendar')
  const listQuery = useDiaryListQuery(undefined, view === 'list')
  const statsQuery = useDiaryStatisticsQuery(view === 'statistics')
  const userQuery = useUserProfileQuery()
  const balanceText = userQuery.data
    ? `${userQuery.data.apSummary.balance.toLocaleString()} AP`
    : userQuery.error
      ? 'AP 조회 실패'
      : 'AP 불러오는 중'

  const handleChangeView = (next: DiaryView) => {
    // 기본 탭(캘린더)은 파라미터 없이 /diary 로 유지
    setSearchParams(next === 'calendar' ? {} : { [VIEW_PARAM]: next })
  }

  const currentFetchStatus =
    view === 'calendar'
      ? calendarQuery.fetchStatus
      : view === 'list'
        ? listQuery.fetchStatus
        : statsQuery.fetchStatus

  const isError =
    currentFetchStatus === 'idle' &&
    ((view === 'calendar' && !!calendarQuery.error && !calendarQuery.data) ||
      (view === 'list' && !!listQuery.error && !listQuery.data) ||
      (view === 'statistics' && !!statsQuery.error && !statsQuery.data))

  const isLoading =
    (view === 'calendar' && !calendarQuery.data) ||
    (view === 'list' && !listQuery.data) ||
    (view === 'statistics' && !statsQuery.data)

  if (isError) {
    const handleRetry = () => {
      if (view === 'calendar') calendarQuery.refetch()
      if (view === 'list') listQuery.refetch()
      if (view === 'statistics') statsQuery.refetch()
    }
    const title =
      view === 'calendar'
        ? '결정 일기를 불러오지 못했어요'
        : view === 'list'
          ? '결정 기록을 불러오지 못했어요'
          : '결정 통계를 불러오지 못했어요'

    const currentError =
      view === 'calendar'
        ? calendarQuery.error
        : view === 'list'
          ? listQuery.error
          : statsQuery.error

    return (
      <div className="bg-Background1 flex flex-1 flex-col">
        <StatusBar
          hasStatusArea={false}
          left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
          right={
            <div className="flex items-center gap-3">
              <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
                {balanceText}
              </div>
              <StatusBarNotificationButton />
            </div>
          }
        />
        <PageErrorView title={title} error={currentError} onRetry={handleRetry} />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-Background1 flex flex-1 flex-col">
        <StatusBar
          hasStatusArea={false}
          left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
          right={
            <div className="flex items-center gap-3">
              <div className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2">
                {balanceText}
              </div>
              <StatusBarNotificationButton />
            </div>
          }
        />
        <PageLoadingView />
      </div>
    )
  }

  const renderView = () => {
    if (view === 'calendar') {
      const { marks, hitRate } = calendarQuery.data!

      return (
        <DiaryCalendar
          year={year}
          month={month}
          marks={marks}
          hitRate={hitRate}
          onChangeMonth={(delta) =>
            setViewMonth((prev) => shiftMonth(prev.year, prev.month, delta))
          }
        />
      )
    }

    if (view === 'list') {
      const entries = listQuery.data!.pages.flatMap((page) => page.entries)
      if (entries.length === 0) {
        return (
          <PageErrorView
            title="아직 결정 기록이 없어요"
            description="첫 번째 결정을 기록해보세요."
          />
        )
      }

      return (
        <DiaryList
          entries={entries}
          onSelectEntry={(id) => navigate(PATH.DIARY_DETAIL(id))}
          onLoadMore={() => listQuery.fetchNextPage()}
          hasNext={listQuery.hasNextPage}
          isLoadingMore={listQuery.isFetchingNextPage}
        />
      )
    }

    if (
      statsQuery.data!.hitRate.totalCount === 0 &&
      statsQuery.data!.items.length === 0 &&
      statsQuery.data!.groups.length === 0
    ) {
      return (
        <PageErrorView
          title="아직 집계된 통계가 없어요"
          description="결정을 기록하면 통계가 쌓여요."
        />
      )
    }

    return <DiaryStatistics statistics={statsQuery.data!} />
  }

  return (
    <DiaryTabScreen view={view} onChangeView={handleChangeView} balanceText={balanceText}>
      {renderView()}
    </DiaryTabScreen>
  )
}
