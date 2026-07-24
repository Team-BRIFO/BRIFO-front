import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { BriefingAssignPage } from '@/pages/BriefingPage/BriefingAssignPage'
import { BriefingCompletePage } from '@/pages/BriefingPage/BriefingCompletePage'
import { BriefingDetailPage } from '@/pages/BriefingPage/BriefingDetailPage'
import { BriefingPage } from '@/pages/BriefingPage/BriefingPage'
import { PredictionListPage } from '@/pages/DecisionPage/PredictionListPage'
import { DiaryDetailPage } from '@/pages/DiaryPage/DiaryDetailPage'
import { DiaryPage } from '@/pages/DiaryPage/DiaryPage'
import { NotFoundPage } from '@/pages/error/NotFoundPage'
import { HomePage } from '@/pages/HomePage/HomePage'
import { MyPage } from '@/pages/MyPage/MyPage'
import { NewsCardPage } from '@/pages/NewsCardPage/NewsCardPage'
import { NotificationPage } from '@/pages/NotificationPage/NotificationPage'
import { OfficePage } from '@/pages/OfficePage/OfficePage'
import { OnboardingPage } from '@/pages/OnboardingPage/OnboardingPage'
import { SplashPage } from '@/pages/SplashPage/SplashPage'
import { TeamDetailPage } from '@/pages/TeamPage/TeamDetailPage'
import { TeamPage } from '@/pages/TeamPage/TeamPage'
import { TutorialPage } from '@/pages/TutorialPage/TutorialPage'
import { PATH } from '@/routes/paths'

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
        element: <NewsCardPage />,
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
        path: PATH.OFFICE_PREDICTION,
        element: <PredictionListPage />,
      },
      {
        path: PATH.BRIEFING,
        element: <BriefingPage />,
      },
      {
        path: PATH.BRIEFING_ASSIGN_ROUTE,
        element: <BriefingAssignPage />,
      },
      {
        path: PATH.BRIEFING_COMPLETE_ROUTE,
        element: <BriefingCompletePage />,
      },
      {
        path: PATH.BRIEFING_DETAIL_ROUTE,
        element: <BriefingDetailPage />,
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

      // 피드 탭 - 결정 일기 (캘린더/리스트/통계는 ?view= 로 전환)
      {
        path: PATH.DIARY,
        element: <DiaryPage />,
      },
      {
        path: PATH.DIARY_DETAIL_ROUTE,
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
