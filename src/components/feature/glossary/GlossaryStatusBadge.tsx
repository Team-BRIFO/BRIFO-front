import { Check } from 'lucide-react'

import { Badge } from '@/components/common/Badge'

export interface GlossaryStatusBadgeProps {
  isLearned: boolean
  className?: string
}

export function GlossaryStatusBadge({ isLearned, className = '' }: GlossaryStatusBadgeProps) {
  // 저장된 용어에만 배지를 보여준다. 분기가 반대라 저장 안 된 용어에 "저장했어요"가 뜨고 있었다.
  if (!isLearned) {
    return null
  }

  return (
    <Badge type="normal" size="md" left={<Check />} className={className}>
      내 용어장에 저장했어요
    </Badge>
  )
}
