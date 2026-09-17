import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { clearClientSession } from '@/api/client/sessionCleanup'
import { cancelSignupSession } from '@/api/client/signupAuth'
import SplashBackground from '@/assets/images/splash_background.svg?react'
import Logo from '@/assets/logo/brifo_logo.svg?react'
import { Toast } from '@/components/common/Toast'
import LoginSection from '@/components/feature/auth/LoginSection'
import OnboardingSlide from '@/components/feature/onboarding/OnboardingSlide'
import { SPLASH_SLIDES } from '@/constants/splashSlides'
import { PATH } from '@/routes/paths'
import { startSocialLogin } from '@/services/auth/oauth'

const SPLASH_DURATION = 3000

interface SplashLocationState {
  loginError?: string
}

export function SplashPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isLoginStartingRef = useRef(false)
  const locationState = location.state as SplashLocationState | null
  const initialLoginError = locationState?.loginError
  const [isSplashVisible, setIsSplashVisible] = useState(!initialLoginError)
  const [currentStep, setCurrentStep] = useState(initialLoginError ? SPLASH_SLIDES.length : 0)
  const [loginError, setLoginError] = useState(initialLoginError)

  useEffect(() => {
    if (!initialLoginError) return

    navigate(PATH.SPLASH, { replace: true, state: null })
  }, [initialLoginError, navigate])

  useEffect(() => {
    if (!loginError) return

    const errorTimer = window.setTimeout(() => setLoginError(undefined), 3000)
    return () => window.clearTimeout(errorTimer)
  }, [loginError])

  useEffect(() => {
    if (!isSplashVisible) return

    const timer = window.setTimeout(() => {
      setIsSplashVisible(false)
    }, SPLASH_DURATION)

    return () => window.clearTimeout(timer)
  }, [isSplashVisible])

  const isLoginStep = currentStep >= SPLASH_SLIDES.length
  const currentSlide = SPLASH_SLIDES[currentStep]

  const handleNext = () => {
    setCurrentStep((previousStep) => previousStep + 1)
  }

  const handleBack = () => {
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 0))
  }

  const handleSkip = () => {
    setCurrentStep(SPLASH_SLIDES.length)
  }

  /**
   * 로그인이 중간에 끊겼다가 재시도하는 경우를 포함해, 매 시도가 이전 세션의 흔적 없이
   * 깨끗한 상태에서 시작되도록 클라이언트·서버 가입 세션을 먼저 정리한다.
   */
  const restartSocialLogin = async (provider: 'kakao' | 'naver') => {
    // 리다이렉트가 시작되면 진행 중인 요청이 끊기므로, 중복 클릭으로 정리가 반쪽이 나지 않게 막는다.
    if (isLoginStartingRef.current) return
    isLoginStartingRef.current = true

    clearClientSession(queryClient)
    // 응답의 Set-Cookie를 받아야 쿠키가 지워진다. 리다이렉트 전에 기다린다.
    await cancelSignupSession()
    startSocialLogin(provider)
  }

  const handleKakaoLogin = () => {
    void restartSocialLogin('kakao')
  }

  const handleNaverLogin = () => {
    void restartSocialLogin('naver')
  }

  // 최초 로고 스플래시
  if (isSplashVisible) {
    return (
      <main className="flex min-h-dvh w-full flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center">
          <Logo className="w-50" />

          <p className="pretendard-Body1-Semibold mt-2 text-[#FF9500]">나는 사장, AI는 사원</p>
        </div>

        <SplashBackground
          aria-hidden="true"
          className="block h-auto w-full shrink-0"
          preserveAspectRatio="xMidYMax meet"
        />
      </main>
    )
  }

  // 튜토리얼 완료 후 로그인
  if (isLoginStep) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <LoginSection
          onKakaoLogin={handleKakaoLogin}
          onNaverLogin={handleNaverLogin}
          onBack={handleBack}
        />
        {loginError && <Toast message={loginError} />}
      </div>
    )
  }

  return (
    <OnboardingSlide
      image={currentSlide.image}
      title={currentSlide.title}
      highlightedText={currentSlide.highlightedText}
      description={currentSlide.description}
      currentStep={currentStep + 1}
      totalSteps={SPLASH_SLIDES.length}
      onNext={handleNext}
      onBack={currentStep > 0 ? handleBack : undefined}
      onSkip={handleSkip}
    />
  )
}
