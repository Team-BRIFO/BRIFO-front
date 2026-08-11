import OnboardingStep1 from '@/assets/images/image-1.svg'
import OnboardingStep2 from '@/assets/images/image-2.svg'
import OnboardingStep3 from '@/assets/images/image-3.svg'
import type { SplashSlideData } from '@/types/domain/splash'

export const SPLASH_SLIDES: SplashSlideData[] = [
  {
    id: 1,
    image: OnboardingStep1,
    title: '나는 사장\nAI는 사원',
    highlightedText: 'AI는 사원',
    description: '나만의 AI 사원을 고용하고\n주식 뉴스 분석을 지시하세요',
  },
  {
    id: 2,
    image: OnboardingStep2,
    title: '하나의 뉴스\n세가지 시각',
    highlightedText: '세가지 시각',
    description: '루키 · 프로 · 탱크 세 사원이 각자\n다른 프레임으로 분석합니다',
  },
  {
    id: 3,
    image: OnboardingStep3,
    title: '결정하고\n일기에 남겨라',
    highlightedText: '일기에 남겨라',
    description: '매일 장 마감 후 자동 정산,\n결정 일기로 투자 실력을 쌓아가세요',
  },
]
