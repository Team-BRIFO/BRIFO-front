import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '@/components/common/Button'
import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { GlossaryBottomSheet } from '@/components/feature/glossary/GlossaryBottomSheet'
import { NewsCard } from '@/components/feature/newsCard/NewsCard'
import { NewsCardIndicator } from '@/components/feature/newsCard/NewsCardIndicator'
import { Office } from '@/components/feature/office/Office'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { PageStatusShell } from '@/components/feedback/PageStatusShell'
import { StatusMessage } from '@/components/feedback/StatusMessage'
import { useStockBriefingsQuery } from '@/pages/BriefingPage/hooks/useStockBriefingsQuery'
import { useStockNewsCards } from '@/pages/NewsCardPage/hooks/useNewsQueries'
import { PATH } from '@/routes/paths'

/** 홈 탭 - SCR-05: 카드뉴스 상세 */
export function NewsCardPage() {
  const { stockId } = useParams<{ stockId: string }>()
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { cards, isLoading, error, refetch } = useStockNewsCards(stockId ?? null)
  const { data: briefingData } = useStockBriefingsQuery(stockId ?? null)
  const requestedBriefings = briefingData?.items.filter((item) => item.status !== 'FAILED') ?? []
  const requestedCount = requestedBriefings.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null)
  const stockName = cards[0]?.relatedStocks?.[0]?.name || ''
  const isEmpty = !isLoading && !error && cards.length === 0

  const handleTermClick = (termId: string) => {
    setSelectedTermId(termId)
  }

  const handleCloseBottomSheet = () => {
    setSelectedTermId(null)
  }

  const selectedTerm =
    cards.flatMap((c) => c.terms || []).find((t) => t.termId === selectedTermId) || null

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, clientWidth } = scrollContainerRef.current
    const newIndex = Math.round(scrollLeft / clientWidth)
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  return (
    <div className="bg-White flex h-dvh w-full flex-col">
      <StatusBar
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        title={stockName}
        right={<StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />}
        hasStatusArea={false}
      />

      {isLoading ? (
        <PageLoadingView />
      ) : error && !cards.length ? (
        <PageErrorView error={error} onRetry={() => refetch()} />
      ) : isEmpty ? (
        <PageStatusShell>
          <Office />
          <StatusMessage
            title="오늘의 카드뉴스가 아직 준비되지 않았어요"
            description="조금 뒤에 다시 확인해 주세요."
            buttonText="홈으로 돌아가기"
            onButtonClick={() => navigate(PATH.HOME)}
          />
        </PageStatusShell>
      ) : (
        <main className="mx-5 mt-5 flex min-h-0 flex-1 flex-col gap-8 pb-6">
          <div className="flex min-h-0 flex-col overflow-x-hidden overflow-y-auto">
            <div
              ref={scrollContainerRef}
              className="flex w-full snap-x snap-mandatory overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden"
              onScroll={handleScroll}
            >
              {cards.map((card) => (
                <div key={card.cardId} className="w-full shrink-0 snap-center">
                  <NewsCard data={card} onTermClick={handleTermClick} />
                </div>
              ))}
            </div>
            <NewsCardIndicator total={cards.length} currentIndex={currentIndex} />
          </div>
          <div className="flex shrink-0 flex-col items-center gap-2">
            <p className="text-Gray-6 pretendard-Caption2 text-center">
              카드뉴스 {cards.length}건을 사원이 모두 읽고 분석해요 · 종목당 1회
            </p>
            {requestedCount === 3 ? (
              <Button
                size="lg"
                isFullWidth
                color="secondary"
                disabled={!stockId}
                onClick={() => {
                  if (stockId) navigate(PATH.BRIEFING_FOR_STOCK(stockId))
                }}
              >
                분석 현황 보기
              </Button>
            ) : requestedCount > 0 ? (
              <div className="flex w-full flex-col gap-2">
                <Button
                  size="lg"
                  isFullWidth
                  color="primary"
                  disabled={!stockId}
                  onClick={() => {
                    if (stockId) navigate(PATH.BRIEFING_ASSIGN(stockId))
                  }}
                >
                  사원에게 추가 분석 의뢰하기
                </Button>
                <Button
                  size="lg"
                  isFullWidth
                  color="secondary"
                  disabled={!stockId}
                  onClick={() => {
                    if (stockId) navigate(PATH.BRIEFING_FOR_STOCK(stockId))
                  }}
                >
                  분석 현황 보기
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                isFullWidth
                color="primary"
                disabled={!stockId}
                onClick={() => {
                  if (stockId) navigate(PATH.BRIEFING_ASSIGN(stockId))
                }}
              >
                사원에게 분석 의뢰하기
              </Button>
            )}
          </div>
        </main>
      )}

      <GlossaryBottomSheet
        isOpen={selectedTermId !== null}
        onClose={handleCloseBottomSheet}
        term={selectedTerm}
      />
    </div>
  )
}
