export type AgreementId = 'age' | 'service' | 'privacy' | 'investment' | 'marketing'

export interface Agreement {
  id: AgreementId
  label: string
  type: 'required' | 'optional'
}

export interface AgreementDetail {
  title: string
  effectiveDate: string
  version: string
  sections: {
    title: string
    content: string
  }[]
}
export const AGREEMENTS: Agreement[] = [
  {
    id: 'age',
    label: '만 14세 이상입니다.',
    type: 'required',
  },
  {
    id: 'service',
    label: '서비스 이용약관',
    type: 'required',
  },
  {
    id: 'privacy',
    label: '개인정보 처리방침',
    type: 'required',
  },
  {
    id: 'investment',
    label: '투자 정보 유의사항',
    type: 'required',
  },
  {
    id: 'marketing',
    label: '광고성 정보 수신',
    type: 'optional',
  },
]

export const SERVICE_TERMS: AgreementDetail = {
  title: 'BRIFO 서비스 이용약관',
  effectiveDate: '2026.07.01',
  version: 'v1.0',
  sections: [
    {
      title: '제1조 (목적)',
      content:
        '본 약관은 BRIFO(이하 "서비스")가 제공하는 모든 투자 판단 관련 서비스의 이용 조건 및 절차를 규정함을 목적으로 합니다.',
    },
    {
      title: '제2조 (서비스의 성격)',
      content:
        '① 본 서비스가 제공하는 AI 시황 분석·브리핑은 정보 제공을 위한 것이며 투자 권유가 아닙니다.\n② 본 서비스의 예측은 실제 매매가 아닌 모의 판단이며, 어떠한 금전적 수익 손실도 보장하지 않습니다.',
    },
    {
      title: '제3조 (계정)',
      content:
        '① 이용자는 소셜 로그인(카카오·네이버)을 통해 가입합니다.\n② 만 14세 미만은 가입할 수 없습니다.',
    },
    {
      title: '제4조 (API)',
      content: 'API는 서비스 내 게임 재화이며 현금으로 환전되지 않습니다.',
    },
    {
      title: '제5조 (면책)',
      content:
        '서비스가 제공하는 뉴스 요약, AI 시황 분석의 정확성을 보장하지 않으며, 이를 근거로 한 실제 투자의 책임은 이용자에게 있습니다.',
    },
  ],
}
