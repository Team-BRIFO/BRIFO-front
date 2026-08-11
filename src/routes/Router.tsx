import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import GlobalErrorFallback from '@/pages/ErrorPage/GlobalErrorFallback'
import { lazyNamed, withRouteLoadingFallback } from '@/routes/lazyRoute'
import { PATH } from '@/routes/paths'

const LazySplashPage = lazyNamed(() => import('@/pages/SplashPage/SplashPage'), 'SplashPage')
const LazyOAuthCallbackPage = lazyNamed(
  () => import('@/pages/SplashPage/OAuthCallbackPage'),
  'OAuthCallbackPage',
)
const LazyAgreementPage = lazyNamed(() => import('@/pages/AgreementPage/AgreementPage'), 'default')
const LazyAgreementDetailPage = lazyNamed(
  () => import('@/pages/AgreementPage/AgreementDetailPage'),
  'default',
)
const LazyOnboardingPage = lazyNamed(
  () => import('@/pages/OnboardingPage/OnboardingPage'),
  'OnboardingPage',
)
const LazyTutorialIntroPage = lazyNamed(
  () => import('@/pages/TutorialPage/TutorialIntroPage'),
  'TutorialIntroPage',
)
const LazyTutorialPage = lazyNamed(
  () => import('@/pages/TutorialPage/TutorialPage'),
  'TutorialPage',
)
const LazyHomePage = lazyNamed(() => import('@/pages/HomePage/HomePage'), 'HomePage')
const LazyNewsCardPage = lazyNamed(
  () => import('@/pages/NewsCardPage/NewsCardPage'),
  'NewsCardPage',
)
const LazyNotificationPage = lazyNamed(
  () => import('@/pages/NotificationPage/NotificationPage'),
  'NotificationPage',
)
const LazyOfficePage = lazyNamed(() => import('@/pages/OfficePage/OfficePage'), 'OfficePage')
const LazyPredictionListPage = lazyNamed(
  () => import('@/pages/DecisionPage/PredictionListPage'),
  'PredictionListPage',
)
const LazyBriefingPage = lazyNamed(
  () => import('@/pages/BriefingPage/BriefingPage'),
  'BriefingPage',
)
const LazyBriefingAssignPage = lazyNamed(
  () => import('@/pages/BriefingPage/BriefingAssignPage'),
  'BriefingAssignPage',
)
const LazyBriefingCompletePage = lazyNamed(
  () => import('@/pages/BriefingPage/BriefingCompletePage'),
  'BriefingCompletePage',
)
const LazyBriefingDetailPage = lazyNamed(
  () => import('@/pages/BriefingPage/BriefingDetailPage'),
  'BriefingDetailPage',
)
const LazyTeamPage = lazyNamed(() => import('@/pages/TeamPage/TeamPage'), 'TeamPage')
const LazyTeamDetailPage = lazyNamed(
  () => import('@/pages/TeamPage/TeamDetailPage'),
  'TeamDetailPage',
)
const LazyDiaryPage = lazyNamed(() => import('@/pages/DiaryPage/DiaryPage'), 'DiaryPage')
const LazyDiaryDetailPage = lazyNamed(
  () => import('@/pages/DiaryPage/DiaryDetailPage'),
  'DiaryDetailPage',
)
const LazyMyPage = lazyNamed(() => import('@/pages/MyPage/MyPage'), 'MyPage')
const LazyMyApPage = lazyNamed(() => import('@/pages/MyPage/MyApPage'), 'MyApPage')
const LazyMyBadgePage = lazyNamed(() => import('@/pages/MyPage/MyBadgePage'), 'MyBadgePage')
const LazyMyGlossaryPage = lazyNamed(
  () => import('@/pages/MyPage/MyGlossaryPage'),
  'MyGlossaryPage',
)
const LazyMyProfileEditPage = lazyNamed(
  () => import('@/pages/MyPage/MyProfileEditPage'),
  'MyProfileEditPage',
)
const LazyMySettingsPage = lazyNamed(
  () => import('@/pages/MyPage/MySettingsPage'),
  'MySettingsPage',
)
const LazyNotFoundPage = lazyNamed(() => import('@/pages/ErrorPage/NotFoundPage'), 'NotFoundPage')

export const router = createBrowserRouter([
  // ─── AuthLayout 영역 (비로그인 전용) ─────────────────────────────
  {
    element: <AuthLayout />,
    errorElement: <GlobalErrorFallback />,
    children: [
      {
        path: PATH.SPLASH,
        element: withRouteLoadingFallback(<LazySplashPage />),
      },
      {
        path: PATH.AUTH_CALLBACK,
        element: withRouteLoadingFallback(<LazyOAuthCallbackPage />),
      },
      {
        path: PATH.AGREEMENT,
        element: withRouteLoadingFallback(<LazyAgreementPage />),
      },
      {
        path: PATH.AGREEMENT_DETAIL,
        element: withRouteLoadingFallback(<LazyAgreementDetailPage />),
      },
      {
        path: PATH.ONBOARDING,
        element: withRouteLoadingFallback(<LazyOnboardingPage />),
      },
      {
        path: PATH.TUTORIAL_INTRO,
        element: withRouteLoadingFallback(<LazyTutorialIntroPage />),
      },
      {
        path: PATH.TUTORIAL,
        element: withRouteLoadingFallback(<LazyTutorialPage />),
      },
    ],
  },

  // ─── AppLayout 영역 (하단 GNB 탭 포함) ───────────────────────────
  {
    element: <AppLayout />,
    errorElement: <GlobalErrorFallback />,
    children: [
      // 홈 탭
      {
        path: PATH.HOME,
        element: withRouteLoadingFallback(<LazyHomePage />),
      },
      {
        path: PATH.CARD_NEWS_DETAIL_ROUTE,
        element: withRouteLoadingFallback(<LazyNewsCardPage />),
      },
      {
        path: PATH.NOTIFICATION,
        element: withRouteLoadingFallback(<LazyNotificationPage />),
      },

      // 사무실 탭
      {
        path: PATH.OFFICE,
        element: withRouteLoadingFallback(<LazyOfficePage />),
      },
      {
        path: PATH.OFFICE_PREDICTION,
        element: withRouteLoadingFallback(<LazyPredictionListPage />),
      },
      {
        path: PATH.BRIEFING,
        element: withRouteLoadingFallback(<LazyBriefingPage />),
      },
      {
        path: PATH.BRIEFING_ASSIGN_ROUTE,
        element: withRouteLoadingFallback(<LazyBriefingAssignPage />),
      },
      {
        path: PATH.BRIEFING_COMPLETE_ROUTE,
        element: withRouteLoadingFallback(<LazyBriefingCompletePage />),
      },
      {
        path: PATH.BRIEFING_DETAIL_ROUTE,
        element: withRouteLoadingFallback(<LazyBriefingDetailPage />),
      },

      // 팀 탭
      {
        path: PATH.TEAM,
        element: withRouteLoadingFallback(<LazyTeamPage />),
      },
      {
        path: PATH.TEAM_DETAIL_ROUTE,
        element: withRouteLoadingFallback(<LazyTeamDetailPage />),
      },

      // 피드 탭 - 결정 일기 (캘린더/리스트/통계는 ?view= 로 전환)
      {
        path: PATH.DIARY,
        element: withRouteLoadingFallback(<LazyDiaryPage />),
      },
      {
        path: PATH.DIARY_DETAIL_ROUTE,
        element: withRouteLoadingFallback(<LazyDiaryDetailPage />),
      },

      // 마이 탭
      {
        path: PATH.MY_PAGE,
        element: withRouteLoadingFallback(<LazyMyPage />),
      },
      {
        path: PATH.MY_AP,
        element: withRouteLoadingFallback(<LazyMyApPage />),
      },
      {
        path: PATH.MY_BADGES,
        element: withRouteLoadingFallback(<LazyMyBadgePage />),
      },
      {
        path: PATH.MY_GLOSSARY,
        element: withRouteLoadingFallback(<LazyMyGlossaryPage />),
      },
      {
        path: PATH.MY_EDIT,
        element: withRouteLoadingFallback(<LazyMyProfileEditPage />),
      },
      {
        path: PATH.MY_SETTINGS,
        element: withRouteLoadingFallback(<LazyMySettingsPage />),
      },

      // ─── Catch-all (404) ───────────────────────────────────────────
      {
        path: '*',
        element: withRouteLoadingFallback(<LazyNotFoundPage />),
      },
    ],
  },
])
