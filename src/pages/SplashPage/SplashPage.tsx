import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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

  const handleKakaoLogin = () => {
    startSocialLogin('kakao')
  }

  const handleNaverLogin = () => {
    startSocialLogin('naver')
  }

  // 최초 로고 스플래시
  if (isSplashVisible) {
    return (
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center">
          <Logo className="w-50" />

          <p className="pretendard-Body1-Semibold mt-2 text-[#FF9500]">나는 사장, AI는 사원</p>
        </div>

        <div className="w-full overflow-hidden">
          <SplashBackground className="-mt-0.5 block w-full" />
        </div>
      </main>
    )
  }

  // 튜토리얼 완료 후 로그인
  if (isLoginStep) {
    return (
      <div className="w-full">
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
