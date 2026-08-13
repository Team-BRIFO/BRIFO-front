import { useCallback, useEffect, useMemo, useState } from 'react'

import type {
  DiaryDetailShareActionState,
  DiaryShareTarget,
} from '@/components/feature/diary/DiaryDetailShare'
import { PATH } from '@/routes/paths'
import {
  createKakaoDiaryShareTemplate,
  getKakaoJavascriptKey,
  getKakaoShareWebUrl,
  loadKakaoJavascriptSdk,
  sendKakaoDefaultShare,
  uploadKakaoShareImage,
} from '@/services/share/kakao'
import { createDiaryShareImageFilename, downloadShareImage } from '@/services/share/shareImage'
import type { DiaryDirection } from '@/types/domain/diary'

export type DiaryShareImageState = 'loading' | 'generating' | 'failed' | 'ready'
type KakaoSdkState = 'ready' | 'error'
type KakaoImageState = 'uploading' | 'ready' | 'error'

interface UseDiaryShareActionsOptions {
  diaryId: string | null
  /** 프론트 카드에서 생성한 PNG. 다운로드와 카카오 업로드가 이 하나를 함께 쓴다. */
  shareImage: Blob | null
  stockName: string
  direction: DiaryDirection
  isCorrect: boolean
  /** 아직 통계를 불러오는 중이면 undefined */
  accuracyRate: number | undefined
  imageState: DiaryShareImageState
}

interface KakaoImageUploadStatus {
  diaryId: string
  image: Blob
  state: KakaoImageState
  imageUrl?: string
  errorMessage?: string
}

function getImageUnavailableReason(imageState: DiaryShareImageState) {
  if (imageState === 'generating') return '공유 카드를 만드는 중이에요.'
  if (imageState === 'failed') return '공유 카드 생성에 실패했어요. 다시 시도해 주세요.'
  return '공유 카드를 준비하는 중이에요.'
}

/** 결정 일기 상세에서만 쓰는 카카오·다운로드 상태와 동작. */
export function useDiaryShareActions({
  diaryId,
  shareImage,
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
  const [kakaoSdkStatus, setKakaoSdkStatus] = useState<{
    diaryId: string
    state: KakaoSdkState
    errorMessage?: string
  } | null>(null)
  const [kakaoImageStatus, setKakaoImageStatus] = useState<KakaoImageUploadStatus | null>(null)

  const processingTarget = processing?.diaryId === diaryId ? processing.target : null
  const currentKakaoSdkStatus = kakaoSdkStatus?.diaryId === diaryId ? kakaoSdkStatus : null
  const currentKakaoImageStatus =
    kakaoImageStatus?.diaryId === diaryId && kakaoImageStatus.image === shareImage
      ? kakaoImageStatus
      : null
  const kakaoJavascriptKey = getKakaoJavascriptKey()
  // 공유받은 사람은 타인의 비공개 결정 카드를 볼 수 없으므로 BRIFO 랜딩으로 안내한다.
  const kakaoShareUrl = getKakaoShareWebUrl(PATH.HOME)

  useEffect(() => {
    // PNG 생성과 Kakao SDK 로드를 동시에 시작해 버튼 대기 시간을 줄인다.
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

  useEffect(() => {
    if (
      !diaryId ||
      !shareImage ||
      !kakaoJavascriptKey ||
      currentKakaoSdkStatus?.state !== 'ready' ||
      currentKakaoImageStatus?.state === 'uploading' ||
      currentKakaoImageStatus?.state === 'ready' ||
      currentKakaoImageStatus?.state === 'error'
    )
      return

    let isCurrentUpload = true
    const imageFile = new File([shareImage], createDiaryShareImageFilename(stockName), {
      type: 'image/png',
    })
    queueMicrotask(() => {
      if (isCurrentUpload) setKakaoImageStatus({ diaryId, image: shareImage, state: 'uploading' })
    })

    void uploadKakaoShareImage(imageFile, kakaoJavascriptKey).then(
      (imageUrl) => {
        if (isCurrentUpload) {
          setKakaoImageStatus({ diaryId, image: shareImage, state: 'ready', imageUrl })
        }
      },
      (error: unknown) => {
        if (!isCurrentUpload) return

        setKakaoImageStatus({
          diaryId,
          image: shareImage,
          state: 'error',
          errorMessage:
            error instanceof Error
              ? error.message
              : '카카오톡에 공유 이미지를 올리지 못했어요. 잠시 후 다시 시도해 주세요.',
        })
      },
    )

    return () => {
      isCurrentUpload = false
    }
  }, [
    currentKakaoImageStatus?.state,
    currentKakaoSdkStatus?.state,
    diaryId,
    kakaoJavascriptKey,
    shareImage,
    stockName,
  ])

  const saveShareImage = useCallback(() => {
    if (!diaryId || !shareImage || processingTarget) return

    setProcessing({ diaryId, target: 'download' })
    try {
      downloadShareImage(shareImage, createDiaryShareImageFilename(stockName))
    } catch {
      // 저장 실패 안내는 이 화면에서 노출하지 않는다.
    } finally {
      setProcessing((previous) =>
        previous?.diaryId === diaryId && previous.target === 'download' ? null : previous,
      )
    }
  }, [diaryId, processingTarget, shareImage, stockName])

  const shareToKakao = useCallback(() => {
    const kakaoImageUrl = currentKakaoImageStatus?.imageUrl
    if (
      !diaryId ||
      !kakaoImageUrl ||
      processingTarget ||
      !kakaoJavascriptKey ||
      !kakaoShareUrl ||
      accuracyRate === undefined
    )
      return

    setProcessing({ diaryId, target: 'kakao' })

    try {
      // 업로드는 상세 진입 시 끝낸다. 클릭 이벤트 안에서는 팝업이 막히지 않게 동기 전송만 한다.
      const shareRequest = sendKakaoDefaultShare(
        createKakaoDiaryShareTemplate({
          stockName,
          direction,
          isCorrect,
          accuracyRate,
          shareImageUrl: kakaoImageUrl,
          diaryUrl: kakaoShareUrl,
        }),
        kakaoJavascriptKey,
      )
      void Promise.resolve(shareRequest).catch(() => undefined)
    } catch {
      // 카카오 SDK 오류 안내는 이 화면에서 노출하지 않는다.
    }

    setProcessing((previous) =>
      previous?.diaryId === diaryId && previous.target === 'kakao' ? null : previous,
    )
  }, [
    accuracyRate,
    currentKakaoImageStatus?.imageUrl,
    diaryId,
    direction,
    isCorrect,
    kakaoJavascriptKey,
    kakaoShareUrl,
    processingTarget,
    stockName,
  ])

  const onShare = useCallback(
    (target: DiaryShareTarget) => {
      if (target === 'kakao') {
        shareToKakao()
        return
      }

      saveShareImage()
    },
    [saveShareImage, shareToKakao],
  )

  const actionStates = useMemo<Record<DiaryShareTarget, DiaryDetailShareActionState>>(() => {
    if (!shareImage) {
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
            : currentKakaoSdkStatus?.state !== 'ready'
              ? '카카오톡 공유 도구를 준비하는 중이에요.'
              : currentKakaoImageStatus?.state === 'error'
                ? (currentKakaoImageStatus.errorMessage ??
                  '카카오톡에 공유 이미지를 올리지 못했어요. 잠시 후 다시 시도해 주세요.')
                : currentKakaoImageStatus?.state !== 'ready'
                  ? '카카오톡용 공유 이미지를 준비하는 중이에요.'
                  : undefined

    return {
      kakao: {
        disabled:
          !kakaoJavascriptKey ||
          !kakaoShareUrl ||
          accuracyRate === undefined ||
          currentKakaoSdkStatus?.state !== 'ready' ||
          currentKakaoImageStatus?.state !== 'ready',
        disabledReason: kakaoDisabledReason,
      },
      download: { disabled: false },
    }
  }, [
    accuracyRate,
    currentKakaoImageStatus,
    currentKakaoSdkStatus,
    imageState,
    kakaoJavascriptKey,
    kakaoShareUrl,
    processingTarget,
    shareImage,
  ])

  return { actionStates, onShare }
}
