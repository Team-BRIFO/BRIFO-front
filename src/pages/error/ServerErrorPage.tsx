import { ErrorPageTemplate } from '@/components/feature/error/ErrorPageTemplate'

/** 500 서버 오류 페이지 */
export function ServerErrorPage() {
  return (
    <ErrorPageTemplate
      headerText="서버 오류"
      title="사원이 잠깐 쉬고 있어요"
      description={
        <>
          서버에 문제가 생겼어요.
          <br />
          잠시 후 다시 시도해 주세요.
        </>
      }
      buttonText="다시 시도"
      onButtonClick={() => window.location.reload()}
    />
  )
}
