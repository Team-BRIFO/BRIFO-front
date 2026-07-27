import type { ComponentType, SVGProps } from 'react'
import { twMerge } from 'tailwind-merge'

import DownloadIcon from '@/assets/icons/share/download.svg?react'
import InstagramIcon from '@/assets/icons/share/instagram.svg?react'
import KakaoIcon from '@/assets/icons/share/kakao.svg?react'
import { Image } from '@/components/common/Image'
import { Loading } from '@/components/common/Loading'

export type DiaryShareTarget = 'kakao' | 'instagram' | 'download'

interface ShareAction {
  target: DiaryShareTarget
  label: string
  className: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  iconSize: number
}

const SHARE_ACTIONS: ShareAction[] = [
  {
    target: 'kakao',
    label: '카카오톡으로 공유',
    className: 'bg-Kakao',
    icon: KakaoIcon,
    iconSize: 16,
  },
  {
    target: 'instagram',
    label: '인스타그램으로 공유',
    className: 'bg-White',
    icon: InstagramIcon,
    iconSize: 20,
  },
  {
    target: 'download',
    label: '이미지 저장',
    className: 'bg-Gray-2',
    icon: DownloadIcon,
    iconSize: 20,
  },
]

/** 공유 카드 비율 (피그마 320×418) */
const CARD_ASPECT = '320 / 418'

export interface DiaryDetailShareProps {
  /** 서버가 렌더링한 공유 카드 PNG. 생성 전이면 null */
  shareImageUrl: string | null
  /** 이미지 대체 텍스트용 종목명 */
  stockName: string
  /** 공유 이미지 생성 중 여부 */
  isGenerating?: boolean
  /** 공유 이미지 생성 실패 여부 */
  isFailed?: boolean
  onRetry?: () => void
  onShare?: (target: DiaryShareTarget) => void
}

/**
 * 결정카드 상세 (공유 이미지 + 공유 버튼).
 * 공유 카드는 서버가 PNG로 렌더링하므로 클라이언트는 URL 을 표시만 한다.
 * 비율은 시안(320×418)에 고정하지 않고 내려온 이미지에 맞춰 반응형으로 둔다.
 *
 * 백엔드 문의: 상세 진입 시 shareImageUrl 이 null 이면 프론트가 POST 로 생성한다.
 * 그래서 각 카드를 처음 여는 사용자는 렌더링 대기를 본다 — 정산 시점 사전 생성 가능한지 확인 필요.
 *
 * 디자인 문의: 관망(NEUTRAL) 결정카드 시안이 없다. 적중/실패 두 장뿐인데
 * 관망 결정도 정산되면 상세 진입이 가능하다.
 *
 * 공유 대상별 동작은 부모가 `onShare`로 제공한다. 핸들러나 이미지가 없으면 버튼을 비활성화한다.
 */
export function DiaryDetailShare({
  shareImageUrl,
  stockName,
  isGenerating = false,
  isFailed = false,
  onRetry,
  onShare,
}: DiaryDetailShareProps) {
  const hasImage = Boolean(shareImageUrl)

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {hasImage ? (
        // 서버가 렌더한 PNG 는 자체 여백·그림자를 포함하므로 테두리를 덧대지 않는다
        <Image
          src={shareImageUrl!}
          alt={`${stockName} 결정카드`}
          responsiveSize="md"
          className="mx-auto"
        />
      ) : (
        <div
          className="border-Gray-2 bg-White mx-auto flex w-full max-w-[320px] items-center justify-center rounded-xl border"
          style={{ aspectRatio: CARD_ASPECT }}
        >
          {isFailed ? (
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <p className="pretendard-Body2-Regular text-Gray-6">공유 이미지를 만들지 못했어요.</p>
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
              <Loading />
              <p className="pretendard-Caption2 text-Gray-5">
                {isGenerating ? '공유 카드를 만드는 중이에요' : '불러오는 중이에요'}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {SHARE_ACTIONS.map(({ target, label, className, icon: Icon, iconSize }) => (
          <button
            key={target}
            type="button"
            aria-label={label}
            disabled={!hasImage || !onShare}
            onClick={() => onShare?.(target)}
            className={twMerge(
              'flex h-10.5 w-10.5 items-center justify-center rounded-full',
              'shadow-[0px_4px_40px_0px_color-mix(in_srgb,var(--color-Gray-2)_15%,transparent)]',
              'focus-visible:ring-Yellow-45 focus-visible:ring-2 focus-visible:outline-hidden',
              'disabled:cursor-not-allowed disabled:opacity-40',
              className,
            )}
          >
            <Icon width={iconSize} height={iconSize} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}
