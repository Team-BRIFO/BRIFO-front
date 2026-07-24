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
      imageClassName: 'absolute left-[112px] top-[74px]  w-[102px] h-[108px]',
      badgeClassName: 'absolute left-[137px] top-[24px]',
    },
    {
      name: '탱커',
      level: 5,
      Character: Tanker,
      imageClassName: 'absolute left-[15px] top-[135px]  w-[102px] h-[108px]',
      badgeClassName: 'absolute left-[40px] top-[85px]',
    },
    {
      name: '프로',
      level: 5,
      Character: Pro,
      imageClassName: 'absolute right-[16px] top-[133px] h-[108px] w-[102px]',
      badgeClassName: 'absolute right-[41px] top-[83px]',
    },
  ]

  return (
    <div className="relative h-65.75 w-82">
      <OfficeBackground className="absolute inset-0 h-full w-full rounded-xl" />

      {employees.map(({ name, level, Character, imageClassName, badgeClassName }) => (
        <div key={name}>
          <Character className={imageClassName} />

          <EmployeeLevelBadge level={level} name={name} className={badgeClassName} />
        </div>
      ))}
    </div>
  )
}
