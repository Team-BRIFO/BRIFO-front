import { Badge } from '@/components/common/Badge'
import BottomSheet from '@/components/common/BottomSheet'
import Button from '@/components/common/Button'
import { AgentChat } from '@/components/domain/agent/AgentChat'
import { GlossaryDefinition } from '@/components/domain/glossary/GlossaryDefinition'
import { GlossaryStatusBadge } from '@/components/feature/glossary/GlossaryStatusBadge'
import type { GlossaryTerm } from '@/types/domain/glossary'

export interface GlossaryBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  term: GlossaryTerm | null
  /** 용어 설명 텍스트 (실제 API 연동 전까지 선택적으로 전달) */
  definition?: string
  /** 이미 학습된 용어 여부 */
  isLearned?: boolean
}

export function GlossaryBottomSheet({
  isOpen,
  onClose,
  term,
  definition = '산 금액이 판 금액보다 많은 상태예요. 외국인·기관의 순매수는 매수세가 우세하다는 뜻으로 읽혀요.',
  isLearned = false,
}: GlossaryBottomSheetProps) {
  if (!term) return null

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} className="items-center gap-4.5">
      <BottomSheet.Body className="flex flex-1 flex-col gap-5">
        <div className="flex flex-col items-center gap-2">
          <Badge size="md" type="normal">
            주식 용어
          </Badge>
          <p className="dnf-Title4">{term.surface}</p>
        </div>
        <div className="flex flex-col gap-2">
          <AgentChat type="rookie" message="이 단어, 제가 쉽게 알려드릴게요!" />
          <GlossaryDefinition>{definition}</GlossaryDefinition>
        </div>
        <div className="flex w-full justify-center">
          <GlossaryStatusBadge isLearned={isLearned} />
        </div>
      </BottomSheet.Body>

      <BottomSheet.Footer className="flex w-full flex-col">
        <Button size="lg" isFullWidth className="w-full" onClick={onClose}>
          이해했어요
        </Button>
      </BottomSheet.Footer>
    </BottomSheet>
  )
}
