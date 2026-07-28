import type { CSSProperties } from 'react'

interface LevelBadgeProps {
  level: number
  name: string
  className?: string
  style?: CSSProperties
}

export default function EmployeeLevelBadge({ level, name, className, style }: LevelBadgeProps) {
  return (
    <div
      className={`border-Yellow-105 rounded-xl border bg-[#FFFFFA] px-2 py-1.5 text-center shadow ${className}`}
      style={style}
    >
      <div className="text-Yellow-20 pretendard-Button1">Lv.{level}</div>
      <div className="text-Yellow-5 dnf-Caption1 mt-1">{name}</div>
    </div>
  )
}
