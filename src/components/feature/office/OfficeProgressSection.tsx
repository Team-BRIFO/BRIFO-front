import { useNavigate } from 'react-router-dom'

import Button from '@/components/common/Button'
import { BriefingCard } from '@/components/domain/briefing/BriefingCard'
import { PATH } from '@/routes/paths'
import type { OfficeBriefingItemDTO } from '@/types/api/briefing'

export interface OfficeProgressSectionProps {
  /** 현재 진행/완료된 브리핑 아이템 목록 */
  items: OfficeBriefingItemDTO[]
  /** 남은 의뢰 가능 건수 */
  availableCount: number
}

/** 사무실 탭 하단의 진행사항(의뢰 목록) 섹션 */
export function OfficeProgressSection({ items, availableCount }: OfficeProgressSectionProps) {
  const navigate = useNavigate()

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="dnf-Subtitle2 text-Gray-10">진행사항</h2>
        <span className="pretendard-Button2 text-Gray-6">
          의뢰 {items.length === 0 ? availableCount : items.length}건{' '}
          {items.length === 0 ? '가능' : '동시진행'}
        </span>
      </div>

      {items.length === 0 ? (
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
          {items.map((item, index) => {
            const isCompleted = item.agents.every((a) => a.status === 'COMPLETED')
            const cardType = isCompleted ? '완료' : '진행중'

            const getAgentStatus = (agentType: string) => {
              const agent = item.agents.find((a) => a.agentType === agentType)
              if (!agent) return cardType
              return agent.status === 'COMPLETED' ? '완료' : '진행중'
            }

            return (
              <BriefingCard
                key={item.stockName}
                rank={index + 1}
                type={cardType}
                stock={{ name: item.stockName }}
                agentStatuses={{
                  rookie: getAgentStatus('ROOKIE'),
                  pro: getAgentStatus('PRO'),
                  tanker: getAgentStatus('TANKER'),
                }}
                onClick={isCompleted ? () => navigate(PATH.BRIEFING) : undefined}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
