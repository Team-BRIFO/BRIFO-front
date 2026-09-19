import Logo from '@/assets/logo/brifo_logo.svg?react'
import Button from '@/components/common/Button'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import SocialLoginButton from '@/components/feature/auth/SocialLoginButton'

interface LoginSectionProps {
  onKakaoLogin: () => void
  onNaverLogin: () => void
  onBack: () => void
  onGuestLogin: () => void
  isGuestLoginPending?: boolean
}

export default function LoginSection({
  onKakaoLogin,
  onNaverLogin,
  onBack,
  onGuestLogin,
  isGuestLoginPending = false,
}: LoginSectionProps) {
  return (
    <main className="flex h-full w-full flex-1 flex-col overflow-hidden px-4 pb-8">
      <StatusBar
        className="w-full [&>div:last-child]:px-0"
        hasStatusArea={false}
        left={<StatusBarBackButton onClick={onBack} />}
      />

      <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto overscroll-y-contain">
        <div className="flex w-full flex-1 shrink-0 flex-col items-center justify-center">
          <Logo className="w-50 shrink-0" />

          <p className="pretendard-Body1-Semibold mt-2 shrink-0 text-[#FF9500]">
            나는 사장, AI는 사원
          </p>
        </div>

        <div className="mt-10 flex w-full shrink-0 flex-col gap-2 px-4 pb-4">
          <SocialLoginButton provider="kakao" onClick={onKakaoLogin} />
          <SocialLoginButton provider="naver" onClick={onNaverLogin} />

          <Button
            type="button"
            size="lg"
            color="assistive"
            isFullWidth
            onClick={onGuestLogin}
            disabled={isGuestLoginPending}
            className="pretendard-Button1! h-13.5! rounded-[10px]"
          >
            {isGuestLoginPending ? '로그인 중...' : '로그인 없이 테스트하기'}
          </Button>
        </div>
      </div>

      <p className="pretendard-Caption3 text-Gray-5 shrink-0 pt-6 text-center whitespace-pre-line">
        로그인 시 본 서비스 약관에 동의한 것으로
        {'\n'}
        간주합니다.
      </p>
    </main>
  )
}
