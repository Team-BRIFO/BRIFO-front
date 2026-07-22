import { GlossaryCard } from '@/components/domain/glossary/GlossaryCard'
import type { MyGlossaryEntry } from '@/types/domain/glossary'

export interface MyGlossaryListProps {
  entries: MyGlossaryEntry[]
  onSelectEntry?: (termId: string) => void
}

/**
 * 내 용어장 화면(SCR-16) 본문 — 저장한 용어 카드 리스트
 *
 * TODO(#31): 용어 상세는 GlossaryBottomSheet(components/feature/glossary) 재사용 여부 확인 후 연결.
 */
export function MyGlossaryList({ entries, onSelectEntry }: MyGlossaryListProps) {
  if (entries.length === 0) {
    return (
      <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
        아직 저장한 용어가 없어요.
        <br />
        브리핑을 읽으면 모르는 용어가 자동으로 쌓여요.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <li key={entry.termId}>
          <GlossaryCard entry={entry} onClick={() => onSelectEntry?.(entry.termId)} />
        </li>
      ))}
    </ul>
  )
}
