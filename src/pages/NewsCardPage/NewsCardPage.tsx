import { useMemo, useRef, useState } from 'react'
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
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useGetNewsCardDetail } from '@/pages/NewsCardPage/hooks/useNewsQueries'
import { MOCK_NEWS_CARDS } from '@/pages/NewsCardPage/mockData'
import { PATH } from '@/routes/paths'

/** 홈 탭 - SCR-05: 카드뉴스 상세 */
export function NewsCardPage() {
  const { stockId } = useParams<{ stockId: string }>()
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { data: newsData, isLoading, error, refetch } = useGetNewsCardDetail(stockId ?? null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null)

  const fallbackCards = useMemo(() => {
    if (!stockId) return MOCK_NEWS_CARDS

    if (stockId === '1') return MOCK_NEWS_CARDS.filter((c) => c.cardId.startsWith('brifo01'))
    if (stockId === '2') return MOCK_NEWS_CARDS.filter((c) => c.cardId.startsWith('brifo02'))
    if (stockId === '3') return MOCK_NEWS_CARDS.filter((c) => c.cardId.startsWith('brifo03'))

    const prefix = stockId.split('-')[0]
    const matched = MOCK_NEWS_CARDS.filter(
      (c) => c.cardId === stockId || c.cardId.startsWith(prefix),
    )
    return matched.length > 0 ? matched : MOCK_NEWS_CARDS
  }, [stockId])

  const cards = newsData && newsData.length > 0 ? newsData : fallbackCards
  const stockName = cards[0]?.relatedStocks?.[0]?.name || ''

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
        right={<StatusBarNotificationButton />}
        hasStatusArea={false}
      />

      {isLoading ? (
        <PageLoadingView />
      ) : error && !cards.length ? (
        <PageErrorView error={error} onRetry={() => refetch()} />
      ) : (
        <main className="mx-5 mt-5 flex flex-1 flex-col gap-8">
          <div className="flex flex-col overflow-x-hidden overflow-y-auto">
            <div
              ref={scrollContainerRef}
              className="flex w-full snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden"
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
          <div className="flex flex-col items-center gap-2">
            <p className="text-Gray-6 pretendard-Caption2 text-center">
              카드뉴스 {cards.length}건을 사원이 모두 읽고 분석해요 · 종목당 1회
            </p>
            <Button
              size="lg"
              isFullWidth
              onClick={() => navigate(PATH.BRIEFING_ASSIGN(stockId || ''))}
            >
              사원에게 분석 의뢰하기
            </Button>
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
