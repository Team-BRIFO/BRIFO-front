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
import { MOCK_NEWS_CARDS } from '@/pages/NewsCardPage/newsCard'
import { PATH } from '@/routes/paths'

/** 홈 탭 - SCR-05: 카드뉴스 상세 */
export function NewsCardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 현재는 mock 데이터를 사용합니다. 실제 API 연동 시 교체가 필요합니다.
  const MOCK_CARDS = MOCK_NEWS_CARDS
  const stockName = MOCK_CARDS[0]?.relatedStocks?.[0]?.name || '삼성전자'

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
    '1': '증권사에서 발표하는 특정 주식의 적정 주가를 의미해요. 보통 향후 6개월~1년 내 도달 가능성을 바탕으로 산정돼요.',
    '2': '산 금액이 판 금액보다 많은 상태예요. 외국인·기관의 순매수는 매수세가 우세하다는 뜻으로 읽혀요.',
  }

  return (
    <div className="bg-White flex h-[100dvh] w-full flex-col">
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
            카드뉴스 {MOCK_CARDS.length}건을 사원이 모두 읽고 분석해요 · 종목당 1회
          </p>
          <Button size="lg" isFullWidth onClick={() => navigate(PATH.BRIEFING_ASSIGN(id || ''))}>
            사원에게 분석 의뢰하기
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
