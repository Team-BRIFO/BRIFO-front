import { Badge } from '@/components/common/Badge'

export type ImportanceLevel = 'HOT'

export interface NewsCardInfoProps {
  publishedAt: string
  title: string
  imageUrl?: string
  importanceLevel?: ImportanceLevel
  source?: string
  className?: string
}

export function NewsCardInfo({
  publishedAt,
  title,
  imageUrl,
  importanceLevel,
  source,
  className = '',
}: NewsCardInfoProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-1 flex-col gap-2">
        <div className="text-Gray-5 pretendard-Caption2 flex items-center gap-2">
          {importanceLevel && (
            <Badge type={importanceLevel.toLowerCase() as any} size="sm">
              {importanceLevel}
            </Badge>
          )}
          <span>
            {source && `${source} · `}
            {publishedAt}
          </span>
        </div>
        <h2 className="text-Gray-9 pretendard-Body1-Semibold">{title}</h2>
      </div>
      {imageUrl && (
        <div className="bg-Gray-2 h-[150px] w-full shrink-0 overflow-hidden rounded-lg">
          <img src={imageUrl} alt="뉴스 썸네일" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  )
}
