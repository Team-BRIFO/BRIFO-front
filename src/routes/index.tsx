import { createBrowserRouter } from 'react-router-dom'

import { PATH } from '@/constants/paths'
import { CardNewsDetailPage } from '@/pages/CardNewsDetailPage/CardNewsDetailPage'
import { DecisionPage } from '@/pages/DecisionPage/DecisionPage'
import { DiaryPage } from '@/pages/DiaryPage/DiaryPage'
import { NotFoundPage } from '@/pages/error/NotFoundPage'
import { HomePage } from '@/pages/HomePage/HomePage'

export const router = createBrowserRouter([
  {
    path: PATH.HOME,
    element: <HomePage />,
  },
  {
    path: PATH.DECISION,
    element: <DecisionPage />,
  },
  {
    path: PATH.DIARY,
    element: <DiaryPage />,
  },
  {
    // 카드뉴스 상세: 동적 파라미터 /:id
    path: '/card-news/:id',
    element: <CardNewsDetailPage />,
  },
  {
    path: PATH.NOT_FOUND,
    element: <NotFoundPage />,
  },
])
