import Button from '@/components/common/Button'
// 대체: domain/glossary — 내 용어장 카드 (공용 용어 카드 나오면 교체 예정, TODO #31)
import { GlossaryCard } from '@/components/domain/glossary/GlossaryCard'
import type { MyGlossaryEntry } from '@/types/domain/glossary'

export interface MyGlossaryListProps {
  learnedTermCount: number
  entries: MyGlossaryEntry[]
  onSelectEntry?: (termId: string) => void
  hasNext?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
  loadMoreError?: boolean
  /** 빈 상태 여부는 조회 데이터를 소유한 Page가 결정한다. */
  isEmpty: boolean
}

/** 내 용어장 화면(SCR-16) 본문 — 저장한 용어 카드 리스트 */
export function MyGlossaryList({
  learnedTermCount,
  entries,
  onSelectEntry,
  hasNext = false,
  onLoadMore,
  isLoadingMore = false,
  loadMoreError = false,
  isEmpty,
}: MyGlossaryListProps) {
  return (
    <div className="flex flex-col gap-2">
      <section className="border-Gray-2 bg-White flex flex-col gap-3 rounded-lg border px-5 py-4">
        <div className="flex items-center gap-1 leading-none">
          <span className="dnf-Subtitle2 text-Yellow-30">{learnedTermCount}</span>
          <span className="dnf-Caption2 text-Gray-10">개 용어를 배웠어요</span>
        </div>
        <p className="pretendard-Caption3 text-Gray-6 leading-none">
          카드뉴스의 형광펜 단어를 탭할 때마다 하나씩 쌓여요.
        </p>
      </section>

      {isEmpty ? (
        <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
          아직 저장한 용어가 없어요.
          <br />
          카드뉴스의 형광펜 단어를 탭해보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((entry) => (
            <li key={entry.termId}>
              <GlossaryCard entry={entry} onClick={() => onSelectEntry?.(entry.termId)} />
            </li>
          ))}
        </ul>
      )}

      {hasNext && (
        <div className="flex flex-col gap-2">
          {loadMoreError && (
            <p role="alert" className="pretendard-Caption2 text-Pink-30 text-center">
              추가 용어를 불러오지 못했어요.
            </p>
          )}
          <Button
            variant="outline"
            color="assistive"
            size="md"
            isFullWidth
            disabled={isLoadingMore}
            onClick={onLoadMore}
          >
            {isLoadingMore ? '불러오는 중...' : loadMoreError ? '다시 시도' : '더 보기'}
          </Button>
        </div>
      )}
    </div>
  )
}
