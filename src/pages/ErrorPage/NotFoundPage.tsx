import { useNavigate } from 'react-router-dom'

import { PageStatusTemplate } from '@/components/feedback/PageStatusTemplate'
import { PATH } from '@/routes/paths'

/** 404 페이지 */
export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <PageStatusTemplate
      headerText="404 Not Found"
      title="길을 잘못 드셨어요"
      description={
        <>
          찾는 페이지가 없어요.
          <br />
          홈으로 돌아갈까요?
        </>
      }
      buttonText="홈으로 가기"
      onButtonClick={() => navigate(PATH.HOME)}
    />
  )
}
