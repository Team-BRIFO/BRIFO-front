// import { Badge, type BadgeVariant } from '@/components/common/Badge'

// TODO: 나중에 'NEW', 'EXCLUSIVE' 등 다른 뱃지가 필요하다면 아래 타입에 추가합니다.
export type ImportanceLevel = 'HOT'

export interface NewsCardInfoProps {
  publishedAt: string
  title: string
  imageUrl?: string
  importanceLevel?: ImportanceLevel
  className?: string
}

// const getBadgeVariant = (level: ImportanceLevel): BadgeVariant => {
//   switch (level) {
//     case 'HOT':
//       return 'danger'
//     // 나중에 다른 거 있다면 추가
//     default:
//       return 'neutral'
//   }
// }

export function NewsCardInfo({
  publishedAt,
  title,
  imageUrl,
  importanceLevel,
  className = '',
}: NewsCardInfoProps) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="flex flex-1 flex-col gap-2">
        <div className="text-Gray-6 pretendard-Caption1 flex items-center gap-2">
          {importanceLevel && (
            <>
              {/* 공용 Badge 확정 전 임시 UI */}
              <span className="bg-Pink-40 text-White pretendard-Caption2 inline-flex items-center justify-center rounded-sm px-1.5 py-0.5 font-bold">
                {importanceLevel}
              </span>
              {/* 공용 Badge 컴포넌트 적용 부분 (추후 공용 뱃지가 확정되면 주석 해제) */}
              {/* <Badge variant={getBadgeVariant(importanceLevel)} size="sm">
                {importanceLevel}
              </Badge> */}
            </>
          )}
          <span>{publishedAt}</span>
        </div>
        <h2 className="text-Gray-9 pretendard-Subtitle1 line-clamp-2 font-bold">{title}</h2>
      </div>
      {imageUrl && (
        <div className="bg-Gray-2 h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <img src={imageUrl} alt="뉴스 썸네일" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  )
}
