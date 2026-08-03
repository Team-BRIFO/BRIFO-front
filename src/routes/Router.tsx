import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import AgreementDetailPage from '@/pages/AgreementPage/AgreementDetailPage'
import AgreementPage from '@/pages/AgreementPage/AgreementPage'
import { BriefingAssignPage } from '@/pages/BriefingPage/BriefingAssignPage'
import { BriefingCompletePage } from '@/pages/BriefingPage/BriefingCompletePage'
import { BriefingDetailPage } from '@/pages/BriefingPage/BriefingDetailPage'
import { BriefingPage } from '@/pages/BriefingPage/BriefingPage'
import { PredictionListPage } from '@/pages/DecisionPage/PredictionListPage'
import { DiaryDetailPage } from '@/pages/DiaryPage/DiaryDetailPage'
import { DiaryPage } from '@/pages/DiaryPage/DiaryPage'
import { NotFoundPage } from '@/pages/error/NotFoundPage'
import { HomePage } from '@/pages/HomePage/HomePage'
import { MyApPage } from '@/pages/MyPage/MyApPage'
import { MyBadgePage } from '@/pages/MyPage/MyBadgePage'
import { MyGlossaryPage } from '@/pages/MyPage/MyGlossaryPage'
import { MyPage } from '@/pages/MyPage/MyPage'
import { MyProfileEditPage } from '@/pages/MyPage/MyProfileEditPage'
import { MySettingsPage } from '@/pages/MyPage/MySettingsPage'
import { NewsCardPage } from '@/pages/NewsCardPage/NewsCardPage'
import { NotificationPage } from '@/pages/NotificationPage/NotificationPage'
import { OfficePage } from '@/pages/OfficePage/OfficePage'
import { OnboardingPage } from '@/pages/OnboardingPage/OnboardingPage'
import { OAuthCallbackPage } from '@/pages/SplashPage/OAuthCallbackPage'
import { SplashPage } from '@/pages/SplashPage/SplashPage'
import { TeamDetailPage } from '@/pages/TeamPage/TeamDetailPage'
import { TeamPage } from '@/pages/TeamPage/TeamPage'
import { TutorialIntroPage } from '@/pages/TutorialPage/TutorialIntroPage'
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
        path: PATH.AUTH_CALLBACK,
        element: <OAuthCallbackPage />,
      },
      {
        path: PATH.AGREEMENT,
        element: <AgreementPage />,
      },
      {
        path: PATH.AGREEMENT_DETAIL,
        element: <AgreementDetailPage />,
      },
      {
        path: PATH.ONBOARDING,
        element: <OnboardingPage />,
      },
      {
        path: PATH.TUTORIAL_INTRO,
        element: <TutorialIntroPage />,
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
        path: '/card-news/:stockId',
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
      {
        path: PATH.MY_AP,
        element: <MyApPage />,
      },
      {
        path: PATH.MY_BADGES,
        element: <MyBadgePage />,
      },
      {
        path: PATH.MY_GLOSSARY,
        element: <MyGlossaryPage />,
      },
      {
        path: PATH.MY_EDIT,
        element: <MyProfileEditPage />,
      },
      {
        path: PATH.MY_SETTINGS,
        element: <MySettingsPage />,
      },

      // ─── Catch-all (404) ───────────────────────────────────────────
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
