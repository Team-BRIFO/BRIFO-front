import Logo from '@/assets/logo/brifo_logo.svg?react'
import { StatusBar, StatusBarBackButton } from '@/components/common/StatusBar'
import SocialLoginButton from '@/components/feature/auth/SocialLoginButton'

interface LoginSectionProps {
  onKakaoLogin: () => void
  onNaverLogin: () => void
  onBack: () => void
}

export default function LoginSection({ onKakaoLogin, onNaverLogin, onBack }: LoginSectionProps) {
  return (
    <main className="flex w-full flex-1 flex-col px-4 pt-6 pb-5">
      <div className="flex h-15 items-center justify-between">
        <StatusBar
          className="w-full [&>div:last-child]:px-0"
          hasStatusArea
          left={<StatusBarBackButton onClick={onBack} />}
        />
      </div>

      <div className="flex flex-1 flex-col items-center pt-44">
        <Logo className="w-50" />

        <p className="pretendard-Body1-Semibold mt-2 text-[#FF9500]">나는 사장, AI는 사원</p>

        <div className="mt-26 flex w-full flex-col gap-2 px-4">
          <SocialLoginButton provider="kakao" onClick={onKakaoLogin} />
          <SocialLoginButton provider="naver" onClick={onNaverLogin} />
        </div>
      </div>

      <p className="pretendard-Caption3 text-Gray-5 pb-8 text-center whitespace-pre-line">
        로그인 시 본 서비스 약관에 동의한 것으로
        {'\n'}
        간주합니다.
      </p>
    </main>
  )
}
