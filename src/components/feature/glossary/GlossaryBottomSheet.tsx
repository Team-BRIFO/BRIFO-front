import { Badge } from '@/components/common/Badge'
import BottomSheet from '@/components/common/BottomSheet'
import Button from '@/components/common/Button'
import { AgentChat } from '@/components/domain/agent/AgentChat'
import { GlossaryDefinition } from '@/components/domain/glossary/GlossaryDefinition'
import { PageErrorView } from '@/components/feature/error/PageErrorView'
import { PageLoadingView } from '@/components/feature/error/PageLoadingView'
import { GlossaryStatusBadge } from '@/components/feature/glossary/GlossaryStatusBadge'
import { useGetTermDetail, usePutMyTerm } from '@/hooks/queries/term/useTermQueries'
import type { GlossaryTerm } from '@/types/domain/glossary'

export interface GlossaryBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  term: GlossaryTerm | null
  /** 이미 학습된 용어 여부 */
  isLearned?: boolean
}

export function GlossaryBottomSheet({
  isOpen,
  onClose,
  term,
  isLearned = false,
}: GlossaryBottomSheetProps) {
  const shouldFetch = isOpen && !!term

  const {
    data: termDetailResponse,
    isLoading,
    error,
    refetch,
  } = useGetTermDetail(shouldFetch && term ? term.termId : null)
  const { mutate: markAsLearned, isPending } = usePutMyTerm()

  const displayDefinition = termDetailResponse?.definition ?? '용어 설명을 불러올 수 없습니다.'
  const displayIsLearned = termDetailResponse?.isLearned ?? isLearned
  if (!term) return null

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} className="items-center gap-4.5">
      {isLoading ? (
        <PageLoadingView
          headerText="용어를 불러오는 중..."
          title="사원들이 용어를 찾고 있어요"
          description="잠시만 기다려 주세요."
        />
      ) : error ? (
        <PageErrorView error={error} onRetry={() => refetch()} />
      ) : (
        <>
          <BottomSheet.Body className="flex flex-1 flex-col gap-5">
            <div className="flex flex-col items-center gap-2">
              <Badge size="md" type="normal">
                주식 용어
              </Badge>
              <p className="dnf-Title4">{term.surface}</p>
            </div>
            <div className="flex flex-col gap-2">
              <AgentChat type="rookie" message="이 단어, 제가 쉽게 알려드릴게요!" />
              <GlossaryDefinition>{displayDefinition}</GlossaryDefinition>
            </div>
            <div className="flex w-full justify-center">
              <GlossaryStatusBadge isLearned={displayIsLearned} />
            </div>
          </BottomSheet.Body>

          <BottomSheet.Footer>
            <Button
              size="lg"
              isFullWidth
              disabled={displayIsLearned || isPending}
              onClick={() => {
                if (term?.termId && !displayIsLearned) {
                  markAsLearned(term.termId, {
                    onSuccess: () => {
                      // After success, it will invalidate and refetch, showing "learned"
                    },
                  })
                }
              }}
            >
              {displayIsLearned ? '이미 학습한 단어예요' : '이해했어요'}
            </Button>
          </BottomSheet.Footer>
        </>
      )}
    </BottomSheet>
  )
}
