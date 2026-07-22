import { useState } from 'react'

import BriefingIcon from '@/assets/icons/bar-chart-up.svg?react'
import DiaryIcon from '@/assets/icons/calendar.svg?react'
import TeamIcon from '@/assets/icons/globe-2.svg?react'
import HomeIcon from '@/assets/icons/home-5.svg?react'
import MyIcon from '@/assets/icons/user-2.svg?react'
import NavigationItem from '@/components/common/NavigationItem'

export type NavigationValue = 'office' | 'team' | 'home' | 'diary' | 'my'

interface NavigationBarProps {
  value?: NavigationValue
  defaultValue?: NavigationValue
  onChange?: (value: NavigationValue) => void
  className?: string
  isFullWidth?: boolean
}

const NAV_ITEMS = [
  {
    value: 'team',
    label: '사원',
    icon: BriefingIcon,
  },
  {
    value: 'office',
    label: '사무실',
    icon: TeamIcon,
  },
  {
    value: 'home',
    label: '홈',
    icon: HomeIcon,
  },
  {
    value: 'diary',
    label: '일기',
    icon: DiaryIcon,
  },
  {
    value: 'my',
    label: '마이',
    icon: MyIcon,
  },
] as const

export default function NavigationBar({
  value,
  defaultValue = 'home',
  onChange,
  className = '',
  isFullWidth = false,
}: NavigationBarProps) {
  const [internalValue, setInternalValue] = useState<NavigationValue>(defaultValue)

  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : internalValue

  const handleClick = (nextValue: NavigationValue) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)
  }

  return (
    <nav
      className={`flex h-18 ${isFullWidth ? 'w-full' : 'w-90'} border-Yellow-100 bg-White items-center justify-between rounded-t-2xl border-x border-t px-4 py-1.5 shadow-[0_0_20px_rgba(242,78,2,0.1)] ${className} `}
    >
      {NAV_ITEMS.map((item) => {
        return (
          <NavigationItem
            key={item.value}
            Icon={item.icon}
            label={item.label}
            isActive={selectedValue === item.value}
            onClick={() => handleClick(item.value)}
          />
        )
      })}
    </nav>
  )
}
