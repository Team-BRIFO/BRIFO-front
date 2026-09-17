import { useNavigate } from 'react-router-dom'

import Button from '@/components/common/Button'
import { BriefingCard } from '@/components/domain/briefing/BriefingCard'
import { PATH } from '@/routes/paths'
import type { OfficeBriefingItem } from '@/types/domain/briefing'

export interface OfficeProgressSectionProps {
  /** 현재 진행/완료된 브리핑 아이템 목록 */
  items: OfficeBriefingItem[]
  /** 남은 의뢰 가능 건수 */
  availableCount: number
  /** 빈 상태 여부는 조회 데이터를 소유한 Page가 결정한다. */
  isEmpty: boolean
  /** 위쪽 오피스 일러스트에 현재 표시 중인 종목 ID (카드 강조용) */
  selectedStockId?: string
  /** 진행중 카드를 눌러 오피스 일러스트를 그 종목으로 전환할 때 */
  onSelectItem?: (index: number) => void
}

/** 사무실 탭 하단의 진행사항(의뢰 목록) 섹션 */
export function OfficeProgressSection({
  items,
  availableCount,
  isEmpty,
  selectedStockId,
  onSelectItem,
}: OfficeProgressSectionProps) {
  const navigate = useNavigate()

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="dnf-Subtitle2 text-Gray-10">진행사항</h2>
        <span className="pretendard-Button2 text-Gray-6">
          의뢰 {isEmpty ? availableCount : items.length}건 {isEmpty ? '가능' : '동시진행'}
        </span>
      </div>

      {isEmpty ? (
        /* 빈 상태 */
        <div className="bg-White border-Gray-2 flex w-full flex-col items-center gap-6 rounded-lg border px-4 py-7">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="dnf-Subtitle2 text-Gray-10">아직 맡긴 분석이 없어요</p>
            <p className="pretendard-Caption1 text-Gray-6 leading-[1.32]">
              사원들이 책상에서 대기 중이에요.
              <br />
              카드뉴스를 골라 분석을 의뢰해 보세요!
            </p>
          </div>
          <Button size="lg" color="primary" isFullWidth onClick={() => navigate(PATH.HOME)}>
            카드뉴스 보러가기
          </Button>
        </div>
      ) : (
        /* 브리핑 목록 */
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <BriefingCard
              key={item.stockId}
              rank={index + 1}
              type={item.isCompleted ? '완료' : '진행중'}
              active={item.stockId === selectedStockId}
              stock={{ name: item.stockName, logoUrl: item.logoUrl }}
              agentStatuses={item.agentStatuses}
              onClick={
                item.isCompleted
                  ? () => navigate(PATH.BRIEFING_FOR_STOCK(item.stockId))
                  : onSelectItem
                    ? () => onSelectItem(index)
                    : undefined
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}
