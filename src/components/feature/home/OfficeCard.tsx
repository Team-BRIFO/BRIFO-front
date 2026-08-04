import Pro from '@/assets/characters/home_pro.svg?react'
import Rookie from '@/assets/characters/home_rookie.svg?react'
import Tanker from '@/assets/characters/home_tanker.svg?react'
import OfficeBackground from '@/assets/images/OfficeBackground.svg?react'
import EmployeeLevelBadge from '@/components/feature/home/EmployeeLevelBadge'

interface OfficeCardProps {
  levels?: Partial<Record<'ROOKIE' | 'PRO' | 'TANKER', number>>
}

export default function OfficeCard({ levels = {} }: OfficeCardProps) {
  const employees = [
    {
      name: '루키',
      level: levels.ROOKIE ?? 0,
      Character: Rookie,
      wrapperStyle: { left: '34.1%', top: '28.1%', width: '31%', height: '41%' },
    },
    {
      name: '탱커',
      level: levels.TANKER ?? 0,
      Character: Tanker,
      wrapperStyle: { left: '4.5%', top: '51.3%', width: '31%', height: '41%' },
    },
    {
      name: '프로',
      level: levels.PRO ?? 0,
      Character: Pro,
      wrapperStyle: { right: '4.8%', top: '50.5%', width: '31%', height: '41%' },
    },
  ]

  return (
    <div className="relative mx-auto aspect-328/263 w-full max-w-3xl overflow-hidden">
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
