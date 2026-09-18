import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react'
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react'
import Logo from '@/assets/logo/brifo_logo_small.svg?react'
import { Badge } from '@/components/common/Badge'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { formatWon } from '@/components/domain/ap/apTransactionMeta'
import { type AgentStatusMap, Office } from '@/components/feature/office/Office'
import { OfficeProgressSection } from '@/components/feature/office/OfficeProgressSection'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { useOfficeBriefingsQuery } from '@/pages/OfficePage/hooks/useOfficeBriefingsQuery'
import { PATH } from '@/routes/paths'

/** 스와이프로 넘기기 위해 필요한 최소 이동 거리(px) */
const SWIPE_THRESHOLD = 40

/** 사무실 탭 - SCR-04: 메인 대시보드 (사원 도트, 자금 잔액 등) */
export function OfficePage() {
  const navigate = useNavigate()
  const briefingsQuery = useOfficeBriefingsQuery()
  const userQuery = useUserProfileQuery()
  const balanceText = userQuery.data ? formatWon(userQuery.data.apSummary.balance) : '0원'

  const items = briefingsQuery.data
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const itemCount = items?.length ?? 0
  const currentIndex = itemCount > 0 ? Math.min(selectedIndex, itemCount - 1) : 0
  const selectedItem = items?.[currentIndex]

  const moveTo = (index: number) => {
    if (itemCount === 0) return
    setSelectedIndex(((index % itemCount) + itemCount) % itemCount)
  }

  const handleTouchEnd = (endX: number) => {
    if (touchStartX === null) return
    const deltaX = endX - touchStartX
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      moveTo(currentIndex + (deltaX < 0 ? 1 : -1))
    }
    setTouchStartX(null)
  }

  return (
    <div className="bg-Background1 flex w-full flex-1 flex-col pb-6">
      {/* 상단 StatusBar */}
      <StatusBar
        hasStatusArea={false}
        left={<Logo className="h-6 w-21" aria-label="BRIFO" />}
        right={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(PATH.MY_AP)}
              className="dnf-Caption2 bg-Yellow-80 text-Yellow-20 rounded-full px-3 py-2"
            >
              {balanceText}
            </button>
            <StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />
          </div>
        }
      />

      {!!briefingsQuery.error && briefingsQuery.fetchStatus === 'idle' ? (
        <PageErrorView error={briefingsQuery.error} onRetry={() => briefingsQuery.refetch()} />
      ) : briefingsQuery.fetchStatus === 'fetching' || !items ? (
        <PageLoadingView />
      ) : (
        <div className="flex flex-col gap-5.5 px-4">
          {/* 헤더 */}
          <header className="flex items-center justify-between pt-3">
            <div className="flex flex-col gap-2">
              <h1 className="dnf-Subtitle2 text-Gray-10">사무실</h1>
              <p className="pretendard-Button2 text-Gray-6">사원들의 분석 진행 상황을 확인하세요</p>
            </div>
            {selectedItem && (
              <Badge
                type="gray"
                size="md"
                className="bg-Gray-2 text-Gray-6 pretendard-Caption1 justify-center px-3.5"
              >
                {selectedItem.stockName}
              </Badge>
            )}
          </header>

          {/* 오피스 일러스트 + 캐릭터 (여러 종목이면 좌우 스와이프로 전환) */}
          <div className="flex flex-col gap-2.5">
            <div className="relative">
              <div
                onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
                onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
              >
                <Office
                  agentStatusMap={
                    selectedItem
                      ? selectedItem.agents.reduce<AgentStatusMap>((acc, agent) => {
                          acc[agent.type] = agent.status
                          return acc
                        }, {})
                      : {}
                  }
                />
              </div>

              {itemCount > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="이전 종목"
                    onClick={() => moveTo(currentIndex - 1)}
                    className="bg-White/80 focus-visible:ring-Yellow-45 [&_path]:fill-Gray-8 absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full shadow focus-visible:ring-2 focus-visible:outline-hidden"
                  >
                    <ChevronLeftIcon width={20} height={20} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="다음 종목"
                    onClick={() => moveTo(currentIndex + 1)}
                    className="bg-White/80 focus-visible:ring-Yellow-45 [&_path]:fill-Gray-8 absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full shadow focus-visible:ring-2 focus-visible:outline-hidden"
                  >
                    <ChevronRightIcon width={20} height={20} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {itemCount > 1 && (
              <div className="flex items-center justify-center gap-1.5" role="tablist">
                {items.map((item, index) => (
                  <button
                    key={item.stockId}
                    type="button"
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={`${item.stockName} 사무실 보기`}
                    onClick={() => moveTo(index)}
                    className={
                      index === currentIndex
                        ? 'bg-Yellow-40 h-2 w-4 rounded-full'
                        : 'bg-Gray-3 h-2 w-2 rounded-full'
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* 진행사항 섹션 */}
          <OfficeProgressSection
            items={items}
            availableCount={3 - items.length}
            isEmpty={items.length === 0}
            selectedStockId={selectedItem?.stockId}
            onSelectItem={(index) => moveTo(index)}
          />
        </div>
      )}
    </div>
  )
}
