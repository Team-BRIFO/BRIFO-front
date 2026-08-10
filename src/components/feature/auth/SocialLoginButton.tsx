import type { ButtonHTMLAttributes, ComponentType, SVGProps } from 'react'

import KakaoIcon from '@/assets/logo/kakao_logo.svg?react'
import NaverIcon from '@/assets/logo/naver_logo.svg?react'
import Button from '@/components/common/Button'

export type SocialProvider = 'kakao' | 'naver'

interface SocialLoginButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'color'
> {
  provider: SocialProvider
}

interface SocialLoginOption {
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  className: string
}

const SOCIAL_LOGIN_OPTIONS: Record<SocialProvider, SocialLoginOption> = {
  kakao: {
    label: '카카오로 로그인 시작하기',
    icon: KakaoIcon,
    className: 'bg-Kakao text-[#0000008A] !pretendard-Button1 hover:!bg-Kakao active:!bg-Kakao',
  },
  naver: {
    label: '네이버로 로그인 시작하기',
    icon: NaverIcon,
    className:
      'bg-[#03A94D] text-white !pretendard-Button1 hover:!bg-[#03A94D] active:!bg-[#03A94D]',
  },
}

export default function SocialLoginButton({
  provider,
  className = '',
  ...props
}: SocialLoginButtonProps) {
  const { label, icon: Icon, className: providerClassName } = SOCIAL_LOGIN_OPTIONS[provider]

  return (
    <Button
      {...props}
      size="lg"
      isFullWidth
      leftIcon={<Icon aria-hidden="true" className="h-6 w-6 shrink-0" />}
      className={`h-13.5! gap-3.75! rounded-[10px] ${providerClassName} ${className}`}
    >
      {label}
    </Button>
  )
}
