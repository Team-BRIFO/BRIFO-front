import type { BadgeType } from '@/components/common/Badge'
import { Badge } from '@/components/common/Badge'
import { NewsPublishedTime } from '@/components/domain/newsCard/NewsPublishedTime'
export interface NewsCardInfoProps {
  cardId?: string
  publishedDate: string
  headline: string
  imageUrl?: string
  importanceBadge?: string
  className?: string
}

const getBadgeType = (badge: string): BadgeType => {
  switch (badge.toUpperCase()) {
    case 'HOT':
      return 'hot'
    case 'MID':
      return 'normal'
    case 'LOW':
      return 'gray'
    default:
      return 'hot'
  }
}

export function NewsCardInfo({
  // cardId,
  publishedDate,
  headline,
  imageUrl,
  importanceBadge,
  className = '',
}: NewsCardInfoProps) {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <div className="flex flex-1 flex-col gap-2">
        <div className="text-Gray-5 pretendard-Caption2 flex items-center gap-2">
          {importanceBadge && (
            <Badge type={getBadgeType(importanceBadge)} size="md">
              {importanceBadge}
            </Badge>
          )}
          <NewsPublishedTime time={publishedDate} />
        </div>
        <h2 className="text-Gray-9 pretendard-Body1-Semibold">{headline}</h2>
      </div>
      {imageUrl && (
        <div className="bg-Gray-2 aspect-2/1 w-full shrink-0 overflow-hidden rounded-lg">
          <img src={imageUrl} alt="뉴스 썸네일" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  )
}
