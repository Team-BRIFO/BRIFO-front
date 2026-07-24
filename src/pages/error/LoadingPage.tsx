import { ErrorPageTemplate } from '@/components/feature/error/ErrorPageTemplate'

/** 로딩중 페이지 */
export function LoadingPage() {
  return (
    <ErrorPageTemplate
      headerText="로딩 중..."
      agentStatusMap={{
        ROOKIE: 'ANALYZING',
        PRO: 'ANALYZING',
        TANKER: 'ANALYZING',
      }}
      title="사원들이 회의 중이에요"
      description="잠시만 기다려 주세요."
    />
  )
}
