import { ErrorPageTemplate } from '@/components/feature/error/ErrorPageTemplate'

/** 네트워크 오류 페이지 */
export function NetworkErrorPage() {
  return (
    <ErrorPageTemplate
      title="인터넷이 불안정해요"
      description="연결 상태를 확인하고\n다시 시도해 주세요."
      buttonText="다시 시도"
      onButtonClick={() => window.location.reload()}
    />
  )
}
