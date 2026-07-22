import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Loading } from '@/components/common/Loading'
import { DiaryCalendar } from '@/components/feature/diary/DiaryCalendar'
import { DiaryList } from '@/components/feature/diary/DiaryList'
import { DiaryStatistics } from '@/components/feature/diary/DiaryStatistics'
import { DiaryTabScreen } from '@/components/feature/diary/DiaryTabScreen'
import type { DiaryView } from '@/components/feature/diary/DiaryViewTabs'
import { useDiaryCalendar, useDiaryList, useDiaryStats } from '@/hooks/queries/useDiary'
import { PATH } from '@/routes/paths'
import { shiftMonth } from '@/utils/diaryCalendar'
import { mapDiaryCalendar, mapDiaryEntry, mapDiaryStatistics } from '@/utils/diaryMapper'

import { MOCK_DIARY_MONTH, MOCK_DIARY_YEAR } from './mockDiary'

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

  const calendarQuery = useDiaryCalendar(year, month)
  const listQuery = useDiaryList()
  const statsQuery = useDiaryStats()

  const handleChangeView = (next: DiaryView) => {
    // 기본 탭(캘린더)은 파라미터 없이 /diary 로 유지
    setSearchParams(next === 'calendar' ? {} : { [VIEW_PARAM]: next })
  }

  const renderView = () => {
    if (view === 'calendar') {
      if (!calendarQuery.data) return <Loading className="py-10" />

      const { marks, hitRate } = mapDiaryCalendar(calendarQuery.data)

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
      if (!listQuery.data) return <Loading className="py-10" />

      const entries = listQuery.data.pages.flatMap((page) => page.page.items.map(mapDiaryEntry))

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

    if (!statsQuery.data) return <Loading className="py-10" />

    return <DiaryStatistics statistics={mapDiaryStatistics(statsQuery.data)} />
  }

  return (
    <DiaryTabScreen view={view} onChangeView={handleChangeView}>
      {renderView()}
    </DiaryTabScreen>
  )
}
