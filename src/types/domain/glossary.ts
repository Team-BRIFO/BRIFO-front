export interface GlossaryTerm {
  termId: string
  surface: string
  displayOrder: number
}

export interface TermDetail {
  termId: string
  term: string
  definition: string
  category: string
  isLearned: boolean
}

/**
 * 내 용어장(SCR-16) 카드 한 장.
 */
export interface MyGlossaryEntry {
  termId: string
  /** 용어 (예: 순매수) */
  term: string
  /** 뜻풀이 */
  definition: string
  /** 분류 (예: 수급) */
  category: string
  /** 이 용어를 알게 된 맥락 (예: 삼성전자 +1.8% 적중 · AP +100) */
  caption?: string
  /** 학습(저장) 시각 ISO 8601 */
  learnedAt: string
}

export interface MyGlossaryPage {
  learnedTermCount: number
  entries: MyGlossaryEntry[]
  nextCursor: string | null
  hasNext: boolean
}
