import { Check } from 'lucide-react'

import { Badge } from '@/components/common/Badge'

export interface GlossaryStatusBadgeProps {
  isLearned: boolean
  className?: string
}

export function GlossaryStatusBadge({ isLearned, className = '' }: GlossaryStatusBadgeProps) {
  if (isLearned) {
    return null
  }

  return (
    <Badge type="normal" size="md" left={<Check />} className={className}>
      내 용어장에 저장했어요
    </Badge>
  )
}
