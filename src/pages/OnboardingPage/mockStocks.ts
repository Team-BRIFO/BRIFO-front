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
  {
    id: 4,
    name: '카카오',
    price: '45,200',
    changeRate: -1.2,
    logoUrl: SkHynixLogo,
  },
  {
    id: 5,
    name: '네이버',
    price: '185,000',
    changeRate: 0.5,
    logoUrl: SkHynixLogo,
  },
]
