import { type PointerEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Modal from '@/components/common/Modal'
import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { Tabs } from '@/components/common/Tabs'
import { BriefingMainContentSheet } from '@/components/feature/briefing/BriefingMainContentSheet'
import { DecisionBottomSheet } from '@/components/feature/decision/DecisionBottomSheet'
import { DecisionResultModalContent } from '@/components/feature/decision/DecisionResultModal'
import { PredictionCompleteModal } from '@/components/feature/decision/PredictionCompleteModal'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useAgentListQuery } from '@/hooks/queries/agent/useAgentListQuery'
import { useBriefingDetailQuery } from '@/pages/BriefingPage/hooks/useBriefingDetailQuery'
import { usePostDecisionMutation } from '@/pages/BriefingPage/hooks/usePostDecisionMutation'
import { useStockBriefingsQuery } from '@/pages/BriefingPage/hooks/useStockBriefingsQuery'
import { PATH } from '@/routes/paths'

/** 스와이프로 넘기기 위해 필요한 최소 이동 거리(px) */
const SWIPE_THRESHOLD = 40
/** 캐러셀에서 한 칸(사원 하나) 넘어갈 때의 이동폭 — 뷰포트 기준 100% */
const SLOT_SHIFT_PERCENT = 100

export function BriefingDetailPage() {
  const { briefingId } = useParams<{ briefingId: string }>()
  const navigate = useNavigate()

  const { data, error, refetch } = useBriefingDetailQuery(briefingId ?? null)
  const { mutate: submitDecision, isPending: isSubmitting } = usePostDecisionMutation(
    briefingId ?? '',
  )

  const stockId = data?.stock.id ?? null
  const { data: stockBriefings } = useStockBriefingsQuery(stockId)
  const { data: agentsList } = useAgentListQuery()

  const isReady = !!data && !error
  const activeTab = briefingId ?? ''

  const [isDecisionSheetOpen, setIsDecisionSheetOpen] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null)
  // 드래그 중인지 여부만 React state로 관리한다 (커서·텍스트 선택 스타일용, 저빈도 갱신).
  const [isDragging, setIsDragging] = useState(false)

  // 실제 드래그 위치(transform)는 매 프레임 리렌더를 피하기 위해 DOM에 직접 반영한다.
  const stripRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const dragXRef = useRef(0)
  const settleDirectionRef = useRef<1 | -1 | null>(null)

  const setStripTransform = (extraPercent: number, px: number, withTransition: boolean) => {
    const el = stripRef.current
    if (!el) return
    el.style.transition = withTransition ? 'transform 250ms ease-out' : 'none'
    el.style.transform = `translateX(calc(${extraPercent}% + ${px}px))`
  }

  const handleTabChange = (val: string) => {
    navigate(PATH.BRIEFING_DETAIL(val), { replace: true })
  }

  const tabItems = stockBriefings?.items.filter((item) => item.status === 'COMPLETED') ?? []
  const currentTabIndex = tabItems.findIndex((item) => item.id === activeTab)

  // 드래그 중 옆 탭이 함께 보이도록 이전/다음 사원의 브리핑을 미리 불러온다.
  const prevTabItem = currentTabIndex > 0 ? tabItems[currentTabIndex - 1] : null
  const nextTabItem =
    currentTabIndex !== -1 && currentTabIndex < tabItems.length - 1
      ? tabItems[currentTabIndex + 1]
      : null
  const { data: prevData } = useBriefingDetailQuery(prevTabItem?.id ?? null)
  const { data: nextData } = useBriefingDetailQuery(nextTabItem?.id ?? null)

  const moveToTab = (index: number) => {
    const itemCount = tabItems.length
    if (itemCount === 0 || currentTabIndex === -1) return
    // 첫/마지막 탭을 넘어가는 스와이프는 반대쪽 끝으로 순환하지 않고 그 자리에 머무른다.
    const clampedIndex = Math.max(0, Math.min(itemCount - 1, index))
    const nextItem = tabItems[clampedIndex]
    if (nextItem && nextItem.id !== activeTab) {
      handleTabChange(nextItem.id)
    }
  }

  // 탭이 바뀌면(스와이프 확정이든 탭 클릭이든) 트랜지션 없이 기준 위치로 스트립을 되돌린다.
  // 브라우저가 그리기 전에(useLayoutEffect) 동기적으로 되돌려야 내용은 바뀌었는데
  // 위치는 그대로인 한 프레임짜리 "깜빡임"이 생기지 않는다.
  useLayoutEffect(() => {
    settleDirectionRef.current = null
    setStripTransform(0, 0, false)
  }, [activeTab])

  // 스와이프를 확정해 한 칸 슬라이드하는 애니메이션이 끝나면 실제 탭을 전환한다.
  useEffect(() => {
    const el = stripRef.current
    if (!el) return

    const handleTransitionEnd = (event: globalThis.TransitionEvent) => {
      if (event.target !== el || event.propertyName !== 'transform') return
      const direction = settleDirectionRef.current
      if (direction === null) return
      moveToTab(currentTabIndex + direction)
    }

    el.addEventListener('transitionend', handleTransitionEnd)
    return () => el.removeEventListener('transitionend', handleTransitionEnd)
  })

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // 마우스는 좌클릭 드래그만 스와이프로 인식한다 (터치·펜은 button이 항상 0).
    if (event.pointerType === 'mouse' && event.button !== 0) return
    // 이전 스와이프가 다음 칸으로 넘어가는 애니메이션 중이면 새 드래그를 시작하지 않는다.
    if (settleDirectionRef.current !== null) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStartRef.current = { x: event.clientX, y: event.clientY }
    dragXRef.current = 0
    setIsDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current
    if (!start) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    // 세로 스크롤 의도로 보이면 드래그를 적용하지 않는다.
    if (Math.abs(deltaY) > Math.abs(deltaX)) return

    // 첫/마지막 탭에는 이동할 옆 탭 자체가 없으므로 그 방향으로는 전혀 움직이지 않는다.
    const isAtStart = currentTabIndex <= 0 && deltaX > 0
    const isAtEnd = currentTabIndex >= tabItems.length - 1 && deltaX < 0
    if (isAtStart || isAtEnd) return

    dragXRef.current = deltaX
    // React 리렌더 없이 DOM에 직접 반영해 드래그 중 프레임 드랍을 막는다.
    setStripTransform(0, deltaX, false)
  }

  const handlePointerUp = () => {
    if (!dragStartRef.current) return
    dragStartRef.current = null
    setIsDragging(false)

    if (Math.abs(dragXRef.current) >= SWIPE_THRESHOLD) {
      // 놓았을 때 그 자리에서 멈추지 않고, 드래그하던 방향으로 한 칸 마저 슬라이드한 뒤(트랜지션 종료 시점에)
      // 실제 탭을 전환한다 — 화면이 이어서 자연스럽게 넘어가는 것처럼 보이게 하기 위함.
      const direction = dragXRef.current < 0 ? 1 : -1
      settleDirectionRef.current = direction
      setStripTransform(direction * -SLOT_SHIFT_PERCENT, 0, true)
    } else {
      setStripTransform(0, 0, true)
    }
  }

  const cancelDrag = () => {
    dragStartRef.current = null
    setIsDragging(false)
    setStripTransform(0, 0, true)
  }

  // 백엔드 API에서 제공되지 않는 agent 디테일 스펙(레벨, 승률, 의뢰비 등)을 AgentList API 결과를 통해 병합합니다.
  const mergeAgent = (briefingData: typeof data) => {
    if (!briefingData) return undefined
    const realAgent = agentsList?.find((a) => a.id === briefingData.agent.id)
    return { ...briefingData.agent, ...(realAgent ?? {}) }
  }
  const displayAgent = mergeAgent(data)
  const prevDisplayAgent = mergeAgent(prevData)
  const nextDisplayAgent = mergeAgent(nextData)

  return (
    <div className="bg-Background1 flex min-h-full w-full flex-col gap-3 pb-8">
      {/* 1. 글로벌 상태바 헤더 (배경 흰색) */}
      <StatusBar
        hasStatusArea={false}
        className="bg-White"
        left={
          <StatusBarBackButton
            onClick={() => navigate(`${PATH.BRIEFING}${data ? `?stockId=${data.stock.id}` : ''}`)}
          />
        }
        title="브리핑"
        right={<StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />}
      />

      {error ? (
        <PageErrorView
          title="브리핑 데이터를 불러오지 못했습니다."
          error={error}
          onRetry={() => refetch()}
        />
      ) : !data ? (
        <PageLoadingView />
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col gap-3 px-4">
            {/* 타이틀 */}
            <div className="flex items-center justify-between">
              <h1 className="dnf-Subtitle1 text-Gray-10">브리핑</h1>
            </div>

            {/* 에이전트 선택 탭 (피그마 스펙 Type 1) */}
            <Tabs
              variant="segmented"
              segmentedType={1}
              sizeToContent
              value={activeTab}
              onChange={handleTabChange}
              items={
                stockBriefings?.items
                  .filter((item) => item.status === 'COMPLETED')
                  .map((item) => ({
                    label: item.nickname,
                    value: item.id,
                  })) ?? []
              }
            />

            {/* 메인 브리핑 시트 캐러셀 (좌우 스와이프/드래그 시 옆 사원 탭이 함께 보임) */}
            <div
              className="mt-2 overflow-hidden"
              style={{ touchAction: 'pan-y' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={cancelDrag}
            >
              <div
                ref={stripRef}
                className="relative w-full"
                style={{
                  transform: 'translateX(0px)',
                  userSelect: isDragging ? 'none' : undefined,
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
              >
                {/* 이전/다음 칸은 absolute로 띄워 현재 칸의 높이에 영향을 주지 않는다 (높이는 현재 칸 기준). */}
                <div
                  className="absolute top-0 flex w-full justify-center px-1"
                  style={{ left: '-100%' }}
                >
                  {prevData && prevDisplayAgent && (
                    <BriefingMainContentSheet
                      agent={prevDisplayAgent}
                      briefing={prevData.briefing}
                      onConfirm={() => setIsDecisionSheetOpen(true)}
                    />
                  )}
                </div>
                <div className="flex w-full justify-center px-1">
                  {data && displayAgent && (
                    <BriefingMainContentSheet
                      agent={displayAgent}
                      briefing={data.briefing}
                      onConfirm={() => setIsDecisionSheetOpen(true)}
                    />
                  )}
                </div>
                <div
                  className="absolute top-0 flex w-full justify-center px-1"
                  style={{ left: '100%' }}
                >
                  {nextData && nextDisplayAgent && (
                    <BriefingMainContentSheet
                      agent={nextDisplayAgent}
                      briefing={nextData.briefing}
                      onConfirm={() => setIsDecisionSheetOpen(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isReady && (
        <DecisionBottomSheet
          isOpen={isDecisionSheetOpen}
          onClose={() => setIsDecisionSheetOpen(false)}
          stock={data.stock}
          agent={{ name: data.agent.name }}
          briefing={{
            badgeText: data.briefing.badgeText,
            badgeType: data.briefing.badgeType,
            oneLiner: data.briefing.comment,
          }}
          isSubmitting={isSubmitting}
          onConfirm={(direction, allocatedAp) => {
            submitDecision(
              { direction, allocatedAp },
              {
                onSuccess: () => {
                  setIsDecisionSheetOpen(false)
                  setIsCompleteModalOpen(true)
                },
                onError: (submitError) => {
                  setErrorModalMsg(
                    submitError.serviceMessage ??
                      '예측 등록에 실패했습니다. 잠시 후 다시 시도해주세요.',
                  )
                },
              },
            )
          }}
        />
      )}
      {isReady && (
        <PredictionCompleteModal
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          stock={data.stock}
          onConfirm={() => {
            setIsCompleteModalOpen(false)
            navigate(PATH.DIARY)
          }}
        />
      )}
      {errorModalMsg && (
        <Modal isOpen={!!errorModalMsg} onClose={() => setErrorModalMsg(null)}>
          <DecisionResultModalContent
            isSuccess={false}
            points={0}
            stockInfo={{ name: data?.stock.name ?? '', changeRate: data?.stock.changeRate ?? 0 }}
            comment={errorModalMsg}
            resultText="등록 실패"
            onAction={() => setErrorModalMsg(null)}
            onClose={() => setErrorModalMsg(null)}
          />
        </Modal>
      )}
    </div>
  )
}
