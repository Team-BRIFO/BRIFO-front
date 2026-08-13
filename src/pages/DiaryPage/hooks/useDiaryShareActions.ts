import { useCallback, useEffect, useMemo, useState } from 'react'

import type {
  DiaryDetailShareActionState,
  DiaryDetailShareStatus,
  DiaryShareTarget,
} from '@/components/feature/diary/DiaryDetailShare'
import { PATH } from '@/routes/paths'
import {
  createKakaoDiaryShareTemplate,
  getKakaoJavascriptKey,
  getKakaoShareWebUrl,
  loadKakaoJavascriptSdk,
  sendKakaoDefaultShare,
} from '@/services/share/kakao'
import {
  createDiaryShareImageFilename,
  downloadShareImage,
  fetchShareImageBlob,
} from '@/services/share/shareImage'
import type { DiaryDirection } from '@/types/domain/diary'

export type DiaryShareImageState = 'loading' | 'generating' | 'failed' | 'ready'
type KakaoSdkState = 'ready' | 'error'

interface UseDiaryShareActionsOptions {
  diaryId: string | null
  shareImageUrl: string | null
  stockName: string
  direction: DiaryDirection
  isCorrect: boolean
  /** 아직 통계를 불러오는 중이면 undefined */
  accuracyRate: number | undefined
  imageState: DiaryShareImageState
}

function getImageUnavailableReason(imageState: DiaryShareImageState) {
  if (imageState === 'generating') return '공유 카드를 만드는 중이에요.'
  if (imageState === 'failed') return '공유 카드 생성에 실패했어요. 다시 시도해 주세요.'
  return '공유 카드를 불러오는 중이에요.'
}

/** 결정 일기 상세에서만 쓰는 카카오·다운로드 상태와 동작. */
export function useDiaryShareActions({
  diaryId,
  shareImageUrl,
  stockName,
  direction,
  isCorrect,
  accuracyRate,
  imageState,
}: UseDiaryShareActionsOptions) {
  const [processing, setProcessing] = useState<{
    diaryId: string
    target: DiaryShareTarget
  } | null>(null)
  const [notice, setNotice] = useState<{ diaryId: string; status: DiaryDetailShareStatus } | null>(
    null,
  )
  const [kakaoSdkStatus, setKakaoSdkStatus] = useState<{
    diaryId: string
    state: KakaoSdkState
    errorMessage?: string
  } | null>(null)

  const processingTarget = processing?.diaryId === diaryId ? processing.target : null
  const statusMessage = notice?.diaryId === diaryId ? notice.status : undefined
  const currentKakaoSdkStatus = kakaoSdkStatus?.diaryId === diaryId ? kakaoSdkStatus : null
  const kakaoJavascriptKey = getKakaoJavascriptKey()
  // 공유받은 사람은 타인의 비공개 결정 카드를 볼 수 없으므로 BRIFO 랜딩으로 안내한다.
  const kakaoShareUrl = getKakaoShareWebUrl(PATH.HOME)

  useEffect(() => {
    // 공유 카드 생성 API와 Kakao SDK 로드를 동시에 시작해 버튼 대기 시간을 줄인다.
    if (!diaryId || !kakaoJavascriptKey) return

    let isCurrentDiary = true

    void loadKakaoJavascriptSdk(kakaoJavascriptKey).then(
      () => {
        if (isCurrentDiary) setKakaoSdkStatus({ diaryId, state: 'ready' })
      },
      (error: unknown) => {
        if (!isCurrentDiary) return

        setKakaoSdkStatus({
          diaryId,
          state: 'error',
          errorMessage:
            error instanceof Error
              ? error.message
              : '카카오톡 공유 도구를 준비하지 못했어요. 잠시 후 다시 시도해 주세요.',
        })
      },
    )

    return () => {
      isCurrentDiary = false
    }
  }, [diaryId, kakaoJavascriptKey])

  const setCurrentNotice = useCallback(
    (status: DiaryDetailShareStatus) => {
      if (diaryId) setNotice({ diaryId, status })
    },
    [diaryId],
  )

  const saveShareImage = useCallback(async () => {
    if (!diaryId || !shareImageUrl || processingTarget) return

    setProcessing({ diaryId, target: 'download' })
    const filename = createDiaryShareImageFilename(stockName)

    try {
      const image = await fetchShareImageBlob(shareImageUrl)
      downloadShareImage(image, filename)
      setCurrentNotice({ tone: 'success', message: '공유 이미지를 PNG 파일로 저장했어요.' })
    } catch (error) {
      setCurrentNotice({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : '공유 이미지를 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
      })
    } finally {
      setProcessing((previous) =>
        previous?.diaryId === diaryId && previous.target === 'download' ? null : previous,
      )
    }
  }, [diaryId, processingTarget, setCurrentNotice, shareImageUrl, stockName])

  const shareToKakao = useCallback(() => {
    if (
      !diaryId ||
      !shareImageUrl ||
      processingTarget ||
      !kakaoJavascriptKey ||
      !kakaoShareUrl ||
      accuracyRate === undefined
    )
      return

    setProcessing({ diaryId, target: 'kakao' })

    try {
      // `sendDefault`가 팝업을 열 수 있으므로 클릭 이벤트가 유지되는 동기 구간에서 바로 호출한다.
      const shareRequest = sendKakaoDefaultShare(
        createKakaoDiaryShareTemplate({
          stockName,
          direction,
          isCorrect,
          accuracyRate,
          shareImageUrl,
          diaryUrl: kakaoShareUrl,
        }),
        kakaoJavascriptKey,
      )
      setCurrentNotice({
        tone: 'info',
        message: '카카오톡 공유를 요청했어요. 공유 대상 선택 화면에서 전송을 완료해 주세요.',
      })

      void Promise.resolve(shareRequest).catch((error: unknown) => {
        setCurrentNotice({
          tone: 'error',
          message:
            error instanceof Error
              ? error.message
              : '카카오톡 공유를 열지 못했어요. 잠시 후 다시 시도해 주세요.',
        })
      })
    } catch (error) {
      setCurrentNotice({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : '카카오톡 공유를 열지 못했어요. 잠시 후 다시 시도해 주세요.',
      })
    }

    setProcessing((previous) =>
      previous?.diaryId === diaryId && previous.target === 'kakao' ? null : previous,
    )
  }, [
    diaryId,
    kakaoJavascriptKey,
    kakaoShareUrl,
    processingTarget,
    setCurrentNotice,
    shareImageUrl,
    stockName,
    direction,
    isCorrect,
    accuracyRate,
  ])

  const onShare = useCallback(
    (target: DiaryShareTarget) => {
      if (target === 'kakao') {
        void shareToKakao()
        return
      }

      void saveShareImage()
    },
    [saveShareImage, shareToKakao],
  )

  const actionStates = useMemo<Record<DiaryShareTarget, DiaryDetailShareActionState>>(() => {
    if (!shareImageUrl) {
      const disabledReason = getImageUnavailableReason(imageState)

      return {
        kakao: { disabled: true, disabledReason },
        download: { disabled: true, disabledReason },
      }
    }

    if (processingTarget) {
      const disabledReason = '공유 이미지를 처리하는 중이에요.'

      return {
        kakao: { disabled: true, disabledReason, isProcessing: processingTarget === 'kakao' },
        download: { disabled: true, disabledReason, isProcessing: processingTarget === 'download' },
      }
    }

    const kakaoDisabledReason = !kakaoJavascriptKey
      ? '카카오 JavaScript 키가 설정되지 않았어요. 배포 환경 설정을 확인해 주세요.'
      : !kakaoShareUrl
        ? '카카오톡 공유에는 Product Link에 등록한 공개 웹 주소가 필요해요. localhost에서는 사용할 수 없어요.'
        : accuracyRate === undefined
          ? '내 누적 적중률을 불러오는 중이에요.'
          : currentKakaoSdkStatus?.state === 'error'
            ? (currentKakaoSdkStatus.errorMessage ??
              '카카오톡 공유 도구를 준비하지 못했어요. 잠시 후 다시 시도해 주세요.')
            : '카카오톡 공유 도구를 준비하는 중이에요.'

    return {
      kakao: {
        disabled:
          !kakaoShareUrl || accuracyRate === undefined || currentKakaoSdkStatus?.state !== 'ready',
        disabledReason: kakaoDisabledReason,
      },
      download: { disabled: false },
    }
  }, [
    currentKakaoSdkStatus,
    accuracyRate,
    imageState,
    kakaoJavascriptKey,
    kakaoShareUrl,
    processingTarget,
    shareImageUrl,
  ])

  return { actionStates, onShare, statusMessage }
}
