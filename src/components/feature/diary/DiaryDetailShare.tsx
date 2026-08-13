import { type ComponentType, type ReactNode, type SVGProps } from 'react'
import { twMerge } from 'tailwind-merge'

import LoaderIcon from '@/assets/icons/loader-1.svg?react'
import DownloadIcon from '@/assets/icons/share/download.svg?react'
import KakaoIcon from '@/assets/icons/share/kakao.svg?react'

export type DiaryShareTarget = 'kakao' | 'download'

export interface DiaryDetailShareActionState {
  disabled: boolean
  disabledReason?: string
  isProcessing?: boolean
}

interface ShareAction {
  target: DiaryShareTarget
  label: string
  className: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  /** 버튼과 함께 rem 단위로 확대되어야 한다. */
  iconClassName: string
}

const SHARE_ACTIONS: ShareAction[] = [
  {
    target: 'kakao',
    label: '카카오톡으로 공유',
    className: 'bg-Kakao',
    icon: KakaoIcon,
    iconClassName: 'h-4 w-4',
  },
  {
    target: 'download',
    label: '이미지 저장',
    className: 'bg-Gray-2',
    icon: DownloadIcon,
    iconClassName: 'h-5 w-5',
  },
]

/** 공유 카드 비율 (피그마 320×418) */
const CARD_ASPECT = '320 / 418'

export interface DiaryDetailShareProps {
  /** 프론트에서 렌더링하는 320×418 결정 카드 */
  card: ReactNode | null
  /** PNG Blob 생성 또는 카드 데이터 로딩 중 여부 */
  isGenerating?: boolean
  /** 카드 데이터 요청 또는 PNG 변환 실패 여부 */
  isFailed?: boolean
  /** 생성 실패의 사용자용 이유 */
  generationErrorMessage?: string
  onRetry?: () => void
  onShare?: (target: DiaryShareTarget) => void
  /** 대상별 비활성·처리 상태 */
  actionStates?: Partial<Record<DiaryShareTarget, DiaryDetailShareActionState>>
}

/** 결정카드 상세 (프론트 렌더 카드 + PNG 공유 버튼). */
export function DiaryDetailShare({
  card,
  isGenerating = false,
  isFailed = false,
  generationErrorMessage,
  onRetry,
  onShare,
  actionStates,
}: DiaryDetailShareProps) {
  const hasCard = Boolean(card)
  const imageStateMessage = isFailed
    ? '공유 카드 생성에 실패했어요. 다시 시도한 뒤 공유할 수 있어요.'
    : isGenerating
      ? '공유 카드를 만드는 중이에요. 완료되면 공유 버튼을 사용할 수 있어요.'
      : hasCard
        ? '공유 카드를 준비하는 중이에요.'
        : '공유 카드를 불러오는 중이에요.'
  const shareActions = SHARE_ACTIONS.map((action) => {
    const { target } = action
    const actionState = actionStates?.[target]
    const disabled = !hasCard || !onShare || actionState?.disabled
    const disabledReason = actionState?.disabledReason ?? imageStateMessage

    return { ...action, actionState, disabled, disabledReason }
  })

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {hasCard ? (
        <>{card}</>
      ) : (
        <div
          className="border-Gray-2 bg-White mx-auto flex w-full max-w-80 items-center justify-center rounded-xl border"
          style={{ aspectRatio: CARD_ASPECT }}
        >
          {isFailed ? (
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <div className="flex flex-col gap-1">
                <p className="pretendard-Body2-Regular text-Gray-6">공유 카드를 만들지 못했어요.</p>
                <p className="pretendard-Caption2 text-Gray-5">
                  {generationErrorMessage ?? '잠시 후 다시 시도해 주세요.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onRetry}
                className="pretendard-Button2 text-Gray-8 border-Gray-3 focus-visible:ring-Yellow-45 rounded-full border px-4 py-2 focus-visible:ring-2 focus-visible:outline-hidden"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <LoaderIcon
                className="text-Gray-5 h-5 w-5 animate-spin"
                style={{ animationDuration: '3s' }}
              />
              <p className="pretendard-Caption2 text-Gray-5">
                {isGenerating ? '공유 카드를 만드는 중이에요' : '불러오는 중이에요'}
              </p>
            </div>
          )}
        </div>
      )}

      {hasCard && isFailed ? (
        <div className="flex flex-col items-center gap-2 text-center" role="alert">
          <p className="pretendard-Caption2 text-Pink-30">
            {generationErrorMessage ?? '공유용 PNG를 만들지 못했어요.'}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="pretendard-Button2 text-Gray-8 border-Gray-3 focus-visible:ring-Yellow-45 rounded-full border px-4 py-2 focus-visible:ring-2 focus-visible:outline-hidden"
          >
            다시 시도
          </button>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        {shareActions.map(
          ({
            target,
            label,
            className,
            icon: Icon,
            iconClassName,
            actionState,
            disabled,
            disabledReason,
          }) => (
            <button
              key={target}
              type="button"
              aria-label={label}
              title={disabled ? disabledReason : undefined}
              disabled={disabled}
              onClick={() => onShare?.(target)}
              className={twMerge(
                'flex h-10.5 w-10.5 items-center justify-center rounded-full',
                'shadow-[0px_4px_40px_0px_color-mix(in_srgb,var(--color-Gray-2)_15%,transparent)]',
                'focus-visible:ring-Yellow-45 focus-visible:ring-2 focus-visible:outline-hidden',
                'disabled:cursor-not-allowed disabled:opacity-40',
                className,
              )}
            >
              {actionState?.isProcessing ? (
                <LoaderIcon
                  className="text-Gray-6 h-5 w-5 animate-spin"
                  style={{ animationDuration: '1.2s' }}
                  aria-hidden="true"
                />
              ) : (
                <Icon className={iconClassName} aria-hidden="true" />
              )}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
