import { useState } from 'react'

import { Badge } from '@/components/common/Badge'
import BottomSheet from '@/components/common/BottomSheet'
import Button from '@/components/common/Button'
import { AgentChat } from '@/components/domain/agent/AgentChat'
import { GlossaryDefinition } from '@/components/domain/glossary/GlossaryDefinition'
import { GlossaryStatusBadge } from '@/components/feature/glossary/GlossaryStatusBadge'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
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
  // 바텀시트가 닫힐 때(term이 null이 될 때) 애니메이션이 끝날 때까지 이전 데이터를 유지하기 위한 캐시
  const [cachedTerm, setCachedTerm] = useState(term)
  if (term && term !== cachedTerm) {
    setCachedTerm(term)
  }

  const currentTerm = term || cachedTerm
  const shouldFetch = isOpen && !!currentTerm

  const {
    data: termDetailResponse,
    isLoading,
    error,
    refetch,
  } = useGetTermDetail(shouldFetch && currentTerm ? currentTerm.termId : null)
  const { mutate: markAsLearned, isPending, error: putError } = usePutMyTerm()

  const displayTermTitle = termDetailResponse?.term
  const displayDefinition = termDetailResponse?.definition ?? '용어 설명을 불러오고 있습니다.'
  const displayIsLearned = termDetailResponse?.isLearned ?? isLearned
  if (!currentTerm) return null

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
              <p className="dnf-Title4">{displayTermTitle}</p>
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
            {putError && (
              <p role="alert" className="text-Pink-70 pretendard-Caption4 mb-2 text-center">
                학습 상태 저장에 실패했습니다. 다시 시도해 주세요.
              </p>
            )}
            <Button
              size="lg"
              isFullWidth
              disabled={displayIsLearned || isPending}
              onClick={() => {
                if (currentTerm?.termId && !displayIsLearned) {
                  markAsLearned(currentTerm.termId, {
                    onSuccess: () => {
                      // After success, it will invalidate and refetch, showing "learned"
                    },
                  })
                }
              }}
            >
              {displayIsLearned ? '이미 학습한 용어예요' : '이해했어요'}
            </Button>
          </BottomSheet.Footer>
        </>
      )}
    </BottomSheet>
  )
}
