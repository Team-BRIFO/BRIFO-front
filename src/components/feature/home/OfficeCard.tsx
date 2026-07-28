import Pro from '@/assets/characters/home_pro.svg?react'
import Rookie from '@/assets/characters/home_rookie.svg?react'
import Tanker from '@/assets/characters/home_tanker.svg?react'
import OfficeBackground from '@/assets/images/OfficeBackground.svg?react'

import EmployeeLevelBadge from './EmployeeLevelBadge'

export default function OfficeCard() {
  const employees = [
    // TODO: 직원 정보는 서버에서 받아오는 것으로 변경 필요
    {
      name: '루키',
      level: 5,
      Character: Rookie,
      wrapperStyle: { left: '34.1%', top: '28.1%', width: '31%', height: '41%' },
    },
    {
      name: '탱커',
      level: 5,
      Character: Tanker,
      wrapperStyle: { left: '4.5%', top: '51.3%', width: '31%', height: '41%' },
    },
    {
      name: '프로',
      level: 5,
      Character: Pro,
      wrapperStyle: { right: '4.8%', top: '50.5%', width: '31%', height: '41%' },
    },
  ]

  return (
    <div className="relative mx-auto aspect-[328/263] w-full max-w-[768px] overflow-hidden">
      <OfficeBackground className="absolute inset-0 h-full w-full rounded-xl" />

      {employees.map(({ name, level, Character, wrapperStyle }) => (
        <div key={name} className="absolute" style={wrapperStyle}>
          <EmployeeLevelBadge
            level={level}
            name={name}
            className="absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap"
          />
          <Character className="h-full w-full" />
        </div>
      ))}
    </div>
  )
}
