import NewscardImg from '@/assets/images/newscardImg.svg'
import type { NewsCardData } from '@/components/feature/newsCard/NewsCard'

export const MOCK_NEWS_CARDS: NewsCardData[] = [
  // 8월 10일
  {
    cardId: 'brifo01-0810',
    publishedDate: '8월 10일',
    headline: '브리포테크, 차세대 공정 모듈 연구개발 1단계 검증 착수',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '브리포테크가 내부 개발 중인 차세대 공정 모듈 1단계 성능 검증 착수',
      '반복 작동 안정성 및 처리 효율 점검 후 하반기 통합 시험 전환 계획',
      '현재 주요 시험 항목은 계획 범위 내 진행 중',
    ],
    relatedStocks: [{ name: '브리포테크' }],
  },
  {
    cardId: 'brifo02-0810',
    publishedDate: '8월 10일',
    headline: '브리포시스템, 신규 제품군 시제품 조립 절차 돌입',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '신규 제품군 출시 앞두고 시제품 조립 절차 착수',
      '기능별 부품 결합 안정성 및 사용 편의성 점검 예정',
      '매출 기여 시점 미공개로 주가 영향은 제한적 관측',
    ],
    relatedStocks: [{ name: '브리포시스템' }],
  },
  {
    cardId: 'brifo03-0810',
    publishedDate: '8월 10일',
    headline: '브리포랩, 일부 생산 공정 점검 위해 주간 일정 조정',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '설비 점검 및 작업 순서 재배치로 주간 일정 조정',
      '전체 생산 중단은 아니며 납품 영향 제한적 설명',
      '보유 재고와 대체 공정 활용해 고객 대응 추진',
    ],
    relatedStocks: [{ name: '브리포랩' }],
  },

  // 8월 11일
  {
    cardId: 'brifo01-0811',
    publishedDate: '8월 11일',
    headline: '브리포테크, 개발 장비 운용시간 확대…반복 시험 속도 높인다',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '핵심 시험 장비 운용시간 확대 조치',
      '교대 인력 재배치 및 시험 병렬화로 검증 시간 단축',
      '성능 인증 및 양산 전환까지 추가 검증 필요',
    ],
    relatedStocks: [{ name: '브리포테크' }],
  },
  {
    cardId: 'brifo03-0811',
    publishedDate: '8월 11일',
    headline: '브리포랩, 생산 일정 재산정…납기 영향 점검 지속',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '공정 일정 조정 관련 품목별 생산 순서 재산정',
      '우선순위 높은 주문은 대체 설비 배분해 납기 변동 최소화',
      '생산 효율 저하가 단기 실적에 일부 부담 관측',
    ],
    relatedStocks: [{ name: '브리포랩' }],
  },

  // 8월 12일
  {
    cardId: 'brifo02-0812',
    publishedDate: '8월 12일',
    headline: '브리포시스템, 신제품 사용자 환경 점검…출시 준비 본격화',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '신제품 사용자 환경 점검 착수',
      '조작 편의성, 유지관리 절차, 기존 연동성 확인',
      '기준 충족 시 소규모 시험 생산 착수 예정',
    ],
    relatedStocks: [{ name: '브리포시스템' }],
  },
  {
    cardId: 'brifo03-0812',
    publishedDate: '8월 12일',
    headline: '브리포랩, 대체 공정 시험가동…생산 차질 완화 추진',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '일정 조정 대상 물량 일부 처리용 대체 공정 시험가동',
      '품질 기준 충족 여부 확인 후 생산 비중 단계적 확대',
      '공정 안정화 전까지 수익성 부담 지켜볼 필요 분석',
    ],
    relatedStocks: [{ name: '브리포랩' }],
  },

  // 8월 13일
  {
    cardId: 'brifo01-0813',
    publishedDate: '8월 13일',
    headline: '브리포테크, 핵심 모듈 내구성 시험서 내부 기준 충족',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '차세대 공정 모듈 1차 내구성 시험서 내부 기준 충족',
      '연속 운전 조건에서 핵심 부품 성능 저하 허용 범위 내',
      '다양한 작동 환경 적용해 안정성 추가 확인 예정',
    ],
    relatedStocks: [{ name: '브리포테크' }],
  },

  // 8월 17일
  {
    cardId: 'brifo01-0817',
    publishedDate: '8월 17일',
    headline: '브리포테크, 정기공시 뒤 개발 투자 유지…연간 계획 재확인',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '양호한 정기공시 실적 바탕으로 R&D 투자 유지',
      '시험 설비 고도화 및 핵심 인력 확충에 예산 배분',
      '안정적 본업 실적과 개발 진척으로 실적 가시성 상승',
    ],
    relatedStocks: [{ name: '브리포테크' }],
  },
  {
    cardId: 'brifo02-0817',
    publishedDate: '8월 17일',
    headline: '브리포시스템, 신제품 시험 생산 앞두고 품질 기준 확정',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '신규 제품군 시험 생산 적용 품질 기준 확정',
      '초기 불량률, 작동 안정성, 포장 손상 여부 중점 관리',
      '신제품 준비 기존 일정 유지',
    ],
    relatedStocks: [{ name: '브리포시스템' }],
  },
  {
    cardId: 'brifo03-0817',
    publishedDate: '8월 17일',
    headline: '브리포랩, 비용 통제 강화…생산 효율 회복에 집중',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '수익성 둔화 대응해 비핵심 지출 절감 및 효율 회복 집중',
      '연구개발·안전 예산 유지 및 운영비 집행 시기 재검토',
      '생산 일정 불확실성 지속으로 수익성 반등 관망',
    ],
    relatedStocks: [{ name: '브리포랩' }],
  },

  // 8월 18일
  {
    cardId: 'brifo01-0818',
    publishedDate: '8월 18일',
    headline: '브리포테크, 통합 시험용 시제품 제작 완료',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '차세대 공정 모듈 통합 시험용 시제품 제작 완료',
      '장시간 연속 운전 및 제어 연동 여부 점검 계획',
      '시험 결과 검토 후 다음 분기 개발 일정 구체화',
    ],
    relatedStocks: [{ name: '브리포테크' }],
  },
  {
    cardId: 'brifo03-0818',
    publishedDate: '8월 18일',
    headline: '브리포랩, 대체 공정 생산량 확대 여부 이달 중 결정',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '시험가동 중인 대체 공정 생산량 확대 여부 이달 확정',
      '초기 생산품 품질 허용 범위 진입했으나 작업 속도 미흡',
      '원가 상승 최소화 방안 검토 중',
    ],
    relatedStocks: [{ name: '브리포랩' }],
  },

  // 8월 19일
  {
    cardId: 'brifo01-0819',
    publishedDate: '8월 19일',
    headline: '브리포테크, 연구개발 일정 유지…통합 검증 단계 진입',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '차세대 공정 모듈 통합 검증 단계 진입',
      '성능, 내구성, 제어 안정성 동시 점검 및 설계 보완',
      '품질 기준 충족 여부 최우선 검토',
    ],
    relatedStocks: [{ name: '브리포테크' }],
  },

  // 8월 20일
  {
    cardId: 'brifo02-0820',
    publishedDate: '8월 20일',
    headline: '브리포시스템, 신제품 소규모 시험 생산 개시',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '신규 제품군 소규모 시험 생산 시작',
      '반복성, 초기 불량률, 작업시간 측정해 정식 생산 반영',
      '시험 결과 양호 시 예정된 출시 준비 절차 진행',
    ],
    relatedStocks: [{ name: '브리포시스템' }],
  },
  {
    cardId: 'brifo03-0820',
    publishedDate: '8월 20일',
    headline: '브리포랩, 핵심 생산설비 추가 점검…가동 안정성 확인',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '핵심 설비 반복 출력 편차 확인으로 추가 점검 착수',
      '품질 기준 안정 유지를 위한 점검 범위 확대',
      '대체 공정 및 보유 재고로 일부 주문 대응',
    ],
    relatedStocks: [{ name: '브리포랩' }],
  },

  // 8월 22일
  {
    cardId: 'brifo01-0822',
    publishedDate: '8월 22일',
    headline: '브리포테크, 대형 공급계약에 18% 가까이 급등…실적 가시성 재평가',
    imageUrl: NewscardImg,
    importanceBadge: 'HOT',
    source: '브리포뉴스',
    points: [
      '대형 공급계약 소식에 전일 종가 대비 17.96% 급등 31,850원 마감',
      '계약금액 최근 사업연도 매출액의 38.6% 규모 (계약기간 18개월)',
      '중기 수주잔고 확보로 매수세 유입되나 단기 급등 차익실현 변동성 존재',
    ],
    relatedStocks: [{ name: '브리포테크', changeRate: 17.96 }],
  },
  {
    cardId: 'brifo02-0822',
    publishedDate: '8월 22일',
    headline: '브리포시스템, 시험 생산 점검 지속…주가 보합권',
    imageUrl: NewscardImg,
    importanceBadge: 'MID',
    source: '브리포뉴스',
    points: [
      '신제품 시험 생산 과정서 확보한 품질 자료 검토 지속',
      '중대한 설계 변경 요인 미발견, 예정 절차 진행',
      '뚜렷한 신규 재료 부재로 주가 보합권 흐름',
    ],
    relatedStocks: [{ name: '브리포시스템', changeRate: 0.0 }],
  },
  {
    cardId: 'brifo03-0822',
    publishedDate: '8월 22일',
    headline: '브리포랩, 핵심 제품 생산 중단에 22% 급락…손실 추정 불확실성 확대',
    imageUrl: NewscardImg,
    importanceBadge: 'HOT',
    source: '브리포뉴스',
    points: [
      '핵심 제품 생산 중단 공시 여파로 전일 종가 대비 22.01% 급락 20,900원 마감',
      '중단 대상 라인이 최근 매출액 47.5% 담당하며 매도세 확대',
      '원인 규명 결과 및 생산 재개 일정이 향후 주가 핵심 변수',
    ],
    relatedStocks: [{ name: '브리포랩', changeRate: -22.01 }],
  },
]
