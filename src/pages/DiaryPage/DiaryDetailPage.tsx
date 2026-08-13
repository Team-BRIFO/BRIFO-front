import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ApiError } from '@/api/client/ApiError'
import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { DiaryDetailShare } from '@/components/feature/diary/DiaryDetailShare'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useCreateDiaryShareImageMutation } from '@/pages/DiaryPage/hooks/useCreateDiaryShareImageMutation'
import {
  useDiaryDetailQuery,
  useDiaryStatisticsQuery,
} from '@/pages/DiaryPage/hooks/useDiaryQueries'
import { useDiaryShareActions } from '@/pages/DiaryPage/hooks/useDiaryShareActions'
import { PATH } from '@/routes/paths'

function getShareImageErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.serviceMessage ?? error.message
  return '공유 카드 생성 요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'
}

/** 피드 탭 - SCR-10: 결정 카드 상세 (서버 렌더 공유 이미지 · 공유) */
export function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const detailQuery = useDiaryDetailQuery(id ?? null)
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
  } = useCreateDiaryShareImageMutation()

  const needsShareImage = Boolean(detail && !detail.shareImageUrl)
  const isCurrentDiaryMutation = mutationDiaryId === id
  const isGeneratingCurrentShareImage = isCurrentDiaryMutation && isGeneratingShareImage
  const isCurrentShareImageFailure = isCurrentDiaryMutation && isShareImageFailed
  const shareImageState = detail?.shareImageUrl
    ? 'ready'
    : isCurrentShareImageFailure
      ? 'failed'
      : isGeneratingCurrentShareImage
        ? 'generating'
        : 'loading'
  const { actionStates, onShare, statusMessage } = useDiaryShareActions({
    diaryId: id ?? null,
    shareImageUrl: detail?.shareImageUrl ?? null,
    stockName: detail?.stockName ?? '',
    direction: detail?.direction ?? 'neutral',
    isCorrect: detail?.isCorrect ?? false,
    accuracyRate: statisticsQuery.data?.cumulativeHitRate,
    imageState: shareImageState,
  })

  // 다른 일기로 이동하면 이전 생성 요청의 상태를 비워 새 카드 생성 여부를 판단한다.
  useEffect(() => {
    resetShareImage()
  }, [id, resetShareImage])

  // 공유 이미지가 아직 없으면 한 번만 생성 요청 (성공 시 상세 캐시의 shareImageUrl을 직접 갱신한다)
  useEffect(() => {
    if (!id || !needsShareImage || !isShareImageIdle) return

    createShareImage(id)
  }, [id, needsShareImage, isShareImageIdle, createShareImage])

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
            shareImageUrl={detail.shareImageUrl}
            stockName={detail.stockName}
            isGenerating={isGeneratingCurrentShareImage}
            isFailed={isCurrentShareImageFailure}
            generationErrorMessage={
              isCurrentShareImageFailure ? getShareImageErrorMessage(shareImageError) : undefined
            }
            onRetry={() => id && createShareImage(id)}
            onShare={onShare}
            actionStates={actionStates}
            statusMessage={statusMessage}
          />
        </div>
      ) : null}
    </div>
  )
}
