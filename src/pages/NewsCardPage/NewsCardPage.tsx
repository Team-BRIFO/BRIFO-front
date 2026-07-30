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
import { useGetNewsCardDetail } from '@/pages/NewsCardPage/hooks/useNewsQueries'
import { MOCK_NEWS_CARDS } from '@/pages/NewsCardPage/newsCard'
import { PATH } from '@/routes/paths'

/** ????- SCR-05: 카드?�스 ?�세 */
export function NewsCardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // ?�재??mock ?�이?��? ?�용?�니?? ?�제 API ?�동 ??교체가 ?�요?�니??
  const { data: newsData } = useGetNewsCardDetail(id ?? null)
  const MOCK_CARDS = newsData ?? MOCK_NEWS_CARDS
  const stockName = MOCK_CARDS[0]?.relatedStocks?.[0]?.name || '?�성?�자'

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null)

  const handleTermClick = (termId: string) => {
    setSelectedTermId(termId)
  }

  const handleCloseBottomSheet = () => {
    setSelectedTermId(null)
  }

  const selectedTerm =
    MOCK_CARDS.flatMap((c) => c.terms || []).find((t) => t.termId === selectedTermId) || null

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, clientWidth } = scrollContainerRef.current
    const newIndex = Math.round(scrollLeft / clientWidth)
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  const TERM_DEFINITIONS: Record<string, string> = {
    '1': '증권?�에??발표?�는 ?�정 주식???�정 주�?�??��??�요. 보통 ?�후 6개월~1?????�달 가?�성??바탕?�로 ?�정?�요.',
    '2': '??금액????금액보다 많�? ?�태?�요. ?�국?�·기관???�매?�는 매수?��? ?�세?�다???�으�??��???',
  }

  return (
    <div className="bg-White flex h-dvh w-full flex-col">
      <StatusBar
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        title={stockName}
        right={<StatusBarNotificationButton />}
      />

      <main className="mx-5 mt-5 flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-3 overflow-x-hidden overflow-y-auto">
          <div
            ref={scrollContainerRef}
            className="flex w-full snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden"
            onScroll={handleScroll}
          >
            {MOCK_CARDS.map((card) => (
              <div key={card.cardId} className="w-full shrink-0 snap-center">
                <NewsCard data={card} onTermClick={handleTermClick} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <NewsCardIndicator total={MOCK_CARDS.length} currentIndex={currentIndex} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-Gray-6 pretendard-Caption2 text-center">
            카드?�스 {MOCK_CARDS.length}건을 ?�원??모두 ?�고 분석?�요 · 종목??1??
          </p>
          <Button size="lg" isFullWidth onClick={() => navigate(PATH.BRIEFING_ASSIGN(id || ''))}>
            ?�원?�게 분석 ?�뢰?�기
          </Button>
        </div>
      </main>

      <GlossaryBottomSheet
        isOpen={selectedTermId !== null}
        onClose={handleCloseBottomSheet}
        term={selectedTerm}
        definition={selectedTerm ? TERM_DEFINITIONS[selectedTerm.termId] : undefined}
      />
    </div>
  )
}
