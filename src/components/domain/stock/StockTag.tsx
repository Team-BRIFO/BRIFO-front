import { Badge } from '@/components/common/Badge'

export interface StockTagProps {
  /** 태그 내부에 들어갈 텍스트 콘텐츠 (예: "HBM", "외국인 순매수") */
  label: string
  /** 해시 기호(#) 표시 여부 */
  showHash?: boolean
  className?: string
}

export function StockTag({ label, showHash = false, className = '' }: StockTagProps) {
  return (
    <Badge type="tag" left={showHash ? '#' : undefined} className={className}>
      {label}
    </Badge>
  )
}
