import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { BriefingPage } from '@/pages/BriefingPage/BriefingPage'
import { CardNewsDetailPage } from '@/pages/CardNewsDetailPage/CardNewsDetailPage'
import { DiaryCalendarPage } from '@/pages/Diary/DiaryCalendarPage/DiaryCalendarPage'
import { DiaryDetailPage } from '@/pages/Diary/DiaryDetailPage/DiaryDetailPage'
import { DiaryListPage } from '@/pages/Diary/DiaryListPage/DiaryListPage'
import { NotFoundPage } from '@/pages/error/NotFoundPage'
import { HomePage } from '@/pages/HomePage/HomePage'
import { MyPage } from '@/pages/MyPage/MyPage'
import { OfficePage } from '@/pages/OfficePage/OfficePage'
import { OnboardingPage } from '@/pages/OnboardingPage/OnboardingPage'
import { SplashPage } from '@/pages/SplashPage/SplashPage'
import { TeamDetailPage } from '@/pages/TeamPage/TeamDetailPage'
import { TeamPage } from '@/pages/TeamPage/TeamPage'
import { TutorialPage } from '@/pages/TutorialPage/TutorialPage'
import { PATH } from '@/routes/paths'
import { NotificationPage } from '@/pages/NotificationPage/NotificationPage'

export const router = createBrowserRouter([
  // ─── AuthLayout 영역 (비로그인 전용) ─────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      {
        path: PATH.SPLASH,
        element: <SplashPage />,
      },
      {
        path: PATH.ONBOARDING,
        element: <OnboardingPage />,
      },
      {
        path: PATH.TUTORIAL,
        element: <TutorialPage />,
      },
    ],
  },

  // ─── AppLayout 영역 (하단 GNB 탭 포함) ───────────────────────────
  {
    element: <AppLayout />,
    children: [
      // 홈 탭
      {
        path: PATH.HOME,
        element: <HomePage />,
      },
      {
        path: '/card-news/:id',
        element: <CardNewsDetailPage />,
      },
      {
        path: PATH.NOTIFICATION,
        element: <NotificationPage />,
      },

      // 사무실 탭
      {
        path: PATH.OFFICE,
        element: <OfficePage />,
      },
      {
        path: PATH.BRIEFING,
        element: <BriefingPage />,
      },

      // 팀 탭
      {
        path: PATH.TEAM,
        element: <TeamPage />,
      },
      {
        path: PATH.TEAM_DETAIL_ROUTE,
        element: <TeamDetailPage />,
      },

      // 피드 탭 - 결정 일기
      {
        path: PATH.DIARY_CALENDAR,
        element: <DiaryCalendarPage />,
      },
      {
        path: PATH.DIARY_LIST,
        element: <DiaryListPage />,
      },
      {
        path: '/diary/:id',
        element: <DiaryDetailPage />,
      },

      // 마이 탭
      {
        path: PATH.MY_PAGE,
        element: <MyPage />,
      },
    ],
  },

  // ─── 404 ──────────────────────────────────────────────────────────
  {
    path: PATH.NOT_FOUND,
    element: <NotFoundPage />,
  },
])
