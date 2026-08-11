export type AgreementId = 'age' | 'service' | 'privacy' | 'investment' | 'marketing'

export interface Agreement {
  id: AgreementId
  label: string
  type: 'required' | 'optional'
}

/** API 상세 조회 전 가입 흐름에서 보여줄 기본 약관 내용 */
export interface AgreementDetail {
  title: string
  effectiveDate: string
  version: string
  sections: {
    title: string
    content: string
  }[]
}
