import { Link } from 'react-router-dom'

import { PATH } from '@/routes/paths'

/** 404 페이지 */
export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">404 - 페이지를 찾을 수 없습니다</h1>
      <p className="text-Gray-6">요청하신 페이지가 존재하지 않습니다.</p>
      <Link to={PATH.HOME} className="text-Yellow-50 underline">
        홈으로 돌아가기
      </Link>
    </div>
  )
}
