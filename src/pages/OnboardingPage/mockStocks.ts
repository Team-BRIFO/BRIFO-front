import SamsungElectroMechanicsLogo from '@/assets/logo/sk-hynix.png'
import SkHynixLogo from '@/assets/logo/sk-hynix.png'
import SkSquareLogo from '@/assets/logo/sk-hynix.png'

export interface OnboardingStock {
  id: number
  name: string
  price: string
  changeRate: number
  logoUrl: string
}

export const ONBOARDING_STOCKS: OnboardingStock[] = [
  {
    id: 1,
    name: 'SK하이닉스',
    price: '267,900',
    changeRate: 6.3,
    logoUrl: SkHynixLogo,
  },
  {
    id: 2,
    name: 'SK스퀘어',
    price: '156,400',
    changeRate: 3.1,
    logoUrl: SkSquareLogo,
  },
  {
    id: 3,
    name: '삼성전기',
    price: '143,800',
    changeRate: -6.3,
    logoUrl: SamsungElectroMechanicsLogo,
  },
]
