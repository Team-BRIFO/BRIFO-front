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
      imageClassName: 'absolute',
      imageStyle: { left: '34.1%', top: '28.1%', width: '31%', height: '41%' },
      badgeClassName: 'absolute',
      badgeStyle: { left: '41.7%', top: '9.1%' },
    },
    {
      name: '탱커',
      level: 5,
      Character: Tanker,
      imageClassName: 'absolute',
      imageStyle: { left: '4.5%', top: '51.3%', width: '31%', height: '41%' },
      badgeClassName: 'absolute',
      badgeStyle: { left: '12.1%', top: '32.3%' },
    },
    {
      name: '프로',
      level: 5,
      Character: Pro,
      imageClassName: 'absolute',
      imageStyle: { right: '4.8%', top: '50.5%', width: '31%', height: '41%' },
      badgeClassName: 'absolute',
      badgeStyle: { right: '12.5%', top: '31.5%' },
    },
  ]

  return (
    <div className="relative mx-auto w-full max-w-[768px] aspect-[328/263] overflow-hidden">
      <OfficeBackground className="absolute inset-0 h-full w-full rounded-xl" />

      {employees.map(({ name, level, Character, imageClassName, imageStyle, badgeClassName, badgeStyle }) => (
        <div key={name}>
          <Character className={imageClassName} style={imageStyle} />

          <EmployeeLevelBadge level={level} name={name} className={badgeClassName} style={badgeStyle} />
        </div>
      ))}
    </div>
  )
}
