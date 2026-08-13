import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ApiError } from '@/api/client/ApiError'
import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { DiaryDetailShare } from '@/components/feature/diary/DiaryDetailShare'
import { DiaryShareCard } from '@/components/feature/diary/DiaryShareCard'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { useCreateDiaryShareImageMutation } from '@/pages/DiaryPage/hooks/useCreateDiaryShareImageMutation'
import {
  useDiaryDetailQuery,
  useDiaryStatisticsQuery,
} from '@/pages/DiaryPage/hooks/useDiaryQueries'
import { useDiaryShareActions } from '@/pages/DiaryPage/hooks/useDiaryShareActions'
import { useDiaryShareCardImage } from '@/pages/DiaryPage/hooks/useDiaryShareCardImage'
import { PATH } from '@/routes/paths'

function getShareImageErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.serviceMessage ?? error.message
  return '공유 카드 데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
}

function getShareCardImageErrorMessage(error: unknown) {
  const resourceError =
    error instanceof Error && /font|image|resource|fetch/i.test(error.message.toLowerCase())
  if (resourceError) return '공유 카드 리소스를 준비하지 못했어요. 다시 시도해 주세요.'

  return '공유용 PNG를 만들지 못했어요. 다시 시도해 주세요.'
}

/** 피드 탭 - SCR-10: 결정 카드 상세 (프론트 PNG 렌더 · 다운로드 · 카카오 공유) */
export function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const detailQuery = useDiaryDetailQuery(id ?? null)
  const userProfileQuery = useUserProfileQuery()
  // 카카오톡 문구에 실제 누적 적중률을 쓰기 위해 상세 진입 시 통계도 함께 가져온다.
  const statisticsQuery = useDiaryStatisticsQuery(Boolean(id))
  const detail = detailQuery.data
  const { fetchStatus, error, refetch } = detailQuery
  const {
    mutate: createShareImage,
    reset: resetShareImage,
    isIdle: isShareImageIdle,
    isPending: isGeneratingShareImage,
    isError: isShareImageFailed,
    error: shareImageError,
    mutationDiaryId,
    data: shareCardData,
  } = useCreateDiaryShareImageMutation()

  const isCurrentDiaryMutation = mutationDiaryId === id
  const isGeneratingCurrentShareImage = isCurrentDiaryMutation && isGeneratingShareImage
  const isCurrentShareImageFailure = isCurrentDiaryMutation && isShareImageFailed
  const currentShareCardData = shareCardData?.diaryId === id ? shareCardData : null
  const cardRef = useRef<HTMLDivElement>(null)
  const companyName = userProfileQuery.data?.profile.companyName ?? 'BRIFO'
  const cardKey = useMemo(() => {
    if (!detail || !currentShareCardData || currentShareCardData.apDelta === null) return null

    return [
      detail.id,
      detail.stockName,
      detail.changeRate,
      detail.agentType,
      detail.direction,
      detail.isCorrect,
      detail.confidenceLevel,
      currentShareCardData.tradeDate,
      currentShareCardData.apDelta,
      companyName,
    ].join('|')
  }, [companyName, currentShareCardData, detail])
  const {
    image: shareCardImage,
    state: shareCardImageState,
    error: shareCardImageError,
    retry: retryShareCardImage,
  } = useDiaryShareCardImage({ cardRef, cardKey })

  const shareImageState = isCurrentShareImageFailure
    ? 'failed'
    : !currentShareCardData
      ? isGeneratingCurrentShareImage
        ? 'generating'
        : 'loading'
      : shareCardImageState
  const { actionStates, onShare } = useDiaryShareActions({
    diaryId: id ?? null,
    shareImage: shareCardImage,
    stockName: detail?.stockName ?? '',
    direction: detail?.direction ?? 'neutral',
    isCorrect: detail?.isCorrect ?? false,
    accuracyRate: statisticsQuery.data?.cumulativeHitRate,
    imageState: shareImageState,
  })

  // 다른 일기로 이동하면 이전 공유 카드 데이터 요청 상태를 비운다.
  useEffect(() => {
    resetShareImage()
  }, [id, resetShareImage])

  // 공유 카드 데이터(tradeDate·apDelta)는 상세 진입 시 POST 응답에서 한 번 받는다.
  // 서버가 반환하는 PNG URL은 프론트 렌더 카드에서는 사용하지 않는다.
  useEffect(() => {
    if (!id || !detail || !isShareImageIdle) return

    createShareImage(id)
  }, [id, detail, isShareImageIdle, createShareImage])

  const card =
    detail && currentShareCardData && currentShareCardData.apDelta !== null ? (
      <DiaryShareCard
        ref={cardRef}
        stockName={detail.stockName}
        changeRate={detail.changeRate}
        agentType={detail.agentType}
        direction={detail.direction}
        isCorrect={detail.isCorrect}
        confidenceLevel={detail.confidenceLevel}
        apDelta={currentShareCardData.apDelta}
        tradeDate={currentShareCardData.tradeDate}
        companyName={companyName}
      />
    ) : null

  const isCardDataMissing = Boolean(currentShareCardData && currentShareCardData.apDelta === null)
  const isShareCardFailed =
    isCurrentShareImageFailure || shareCardImageState === 'failed' || isCardDataMissing
  const shareCardErrorMessage = isCurrentShareImageFailure
    ? getShareImageErrorMessage(shareImageError)
    : isCardDataMissing
      ? '공유 카드에 필요한 AP 변동값을 아직 받지 못했어요. 잠시 후 다시 시도해 주세요.'
      : shareCardImageState === 'failed'
        ? getShareCardImageErrorMessage(shareCardImageError)
        : undefined

  return (
    <div className="bg-Background1 flex min-h-full flex-col">
      <StatusBar
        hasStatusArea={false}
        left={<StatusBarBackButton onClick={() => navigate(-1)} />}
        title="결정카드"
        right={<StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />}
      />

      {!!error && fetchStatus === 'idle' && !detail ? (
        <PageErrorView
          title="결정 카드를 찾을 수 없어요."
          error={error}
          onRetry={() => refetch()}
        />
      ) : !detail ? (
        <PageLoadingView />
      ) : detail ? (
        <div className="flex flex-1 flex-col items-center px-5 pt-6 pb-20">
          <DiaryDetailShare
            card={card}
            isGenerating={shareImageState === 'generating' || shareImageState === 'loading'}
            isFailed={isShareCardFailed}
            generationErrorMessage={shareCardErrorMessage}
            onRetry={() => {
              if (isCurrentShareImageFailure || isCardDataMissing) {
                if (id) createShareImage(id)
                return
              }

              retryShareCardImage()
            }}
            onShare={onShare}
            actionStates={actionStates}
          />
        </div>
      ) : null}
    </div>
  )
}
