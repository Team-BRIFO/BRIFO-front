import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Loading } from '@/components/common/Loading'
import {
  StatusBar,
  StatusBarBackButton,
  StatusBarNotificationButton,
} from '@/components/common/StatusBar'
import { DiaryDetailShare } from '@/components/feature/diary/DiaryDetailShare'
import { useCreateDiaryShareImage, useDiaryDetail } from '@/hooks/queries/useDiary'
import { mapDiaryDetail } from '@/utils/diaryMapper'

/** 피드 탭 - SCR-10: 결정 카드 상세 (서버 렌더 공유 이미지 · 공유) */
export function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isPending, isError } = useDiaryDetail(id ?? null)
  const {
    mutate: createShareImage,
    isIdle: isShareImageIdle,
    isPending: isGeneratingShareImage,
    isError: isShareImageFailed,
  } = useCreateDiaryShareImage()

  const detail = data ? mapDiaryDetail(data) : undefined
  const needsShareImage = Boolean(detail && !detail.shareImageUrl)

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
        right={<StatusBarNotificationButton />}
      />

      {/* StatusBar → 카드 ~25px (피그마 #564:3004), 하단 NavigationBar 여백 */}
      <div className="flex flex-1 flex-col items-center px-5 pt-6 pb-20">
        {isPending && <Loading className="py-10" />}

        {isError && (
          <p className="pretendard-Body2-Regular text-Gray-6 py-10 text-center">
            결정 카드를 찾을 수 없어요.
          </p>
        )}

        {detail && (
          <DiaryDetailShare
            shareImageUrl={detail.shareImageUrl}
            stockName={detail.stockName}
            isGenerating={isGeneratingShareImage}
            isFailed={isShareImageFailed}
            onRetry={() => id && createShareImage(id)}
          />
        )}
      </div>
    </div>
  )
}
