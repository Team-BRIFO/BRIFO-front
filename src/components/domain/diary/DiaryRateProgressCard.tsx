import { twMerge } from 'tailwind-merge'

import { ProgressBar } from '@/components/common/ProgressBar'
import type { DiaryRateGroup, DiaryRateRow } from '@/types/domain/diary'

// 결정일기 캘린더의 결과 색과 같은 방향 토큰을 사용한다.
const RING_COLOR_BY_DIRECTION: Record<string, string> = {
  상승: 'var(--color-Pink-40)',
  하락: 'var(--color-Green-50)',
  관망: 'var(--color-Gray-4)',
}

// 사원 타입별 색상 (루키-붉은색, 프로-노란색, 탱커-파란색 계열의 팔레트 내 토큰)
const AGENT_COLOR_BY_TYPE: Record<string, string> = {
  ROOKIE: 'bg-Pink-40',
  PRO: 'bg-Yellow-50',
  TANKER: 'bg-Green-50',
}
const DEFAULT_AGENT_COLOR = 'bg-Gray-4'

// 배분 비중 구간별 색상 (소액-파란색, 중간-노란색, 집중-빨간색 계열의 팔레트 내 토큰)
const ALLOCATION_RATE_COLOR_BY_LEVEL: Record<string, string> = {
  HIGH: 'bg-Pink-40',
  MEDIUM: 'bg-Yellow-50',
  LOW: 'bg-Green-50',
}
const DEFAULT_ALLOCATION_RATE_COLOR = 'bg-Gray-4'

const RANK_SURFACES = ['bg-Yellow-100', 'bg-Background1', 'bg-Bronze-100']
const RANK_COLORS = [
  'bg-Yellow-50 text-Yellow-10',
  'bg-Gray-3 text-Gray-8',
  'bg-Bronze-50 text-Bronze-10',
]

function clampRate(value: number) {
  return Math.min(Math.max(value, 0), 100)
}

function RateRing({ row, color }: { row: DiaryRateRow; color: string }) {
  const value = clampRate(row.value)

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <div
        className="flex h-15 w-15 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${value * 3.6}deg, var(--color-Gray-2) 0deg)`,
        }}
        role="img"
        aria-label={`${row.label} 적중률 ${value}%`}
      >
        <div className="bg-White flex h-11 w-11 items-center justify-center rounded-full">
          <span className="pretendard-Button2 text-Gray-10">{value}%</span>
        </div>
      </div>
      <span className="pretendard-Caption3 text-Gray-6 truncate">{row.label}</span>
    </div>
  )
}

function DirectionRateChart({ rows }: { rows: DiaryRateRow[] }) {
  return (
    <div className="flex items-start justify-around gap-3">
      {rows.map((row) => (
        <RateRing
          key={row.label}
          row={row}
          color={RING_COLOR_BY_DIRECTION[row.label] ?? 'var(--color-Yellow-50)'}
        />
      ))}
    </div>
  )
}

function AgentRateChart({ rows }: { rows: DiaryRateRow[] }) {
  return (
    <div className="flex h-26 items-end justify-around gap-5 px-5">
      {rows.map((row) => {
        const value = clampRate(row.value)
        const color = (row.key && AGENT_COLOR_BY_TYPE[row.key]) ?? DEFAULT_AGENT_COLOR
        return (
          <div
            key={row.label}
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5 text-center"
          >
            <span className="pretendard-Caption2 text-Gray-10">{value}%</span>
            <div className="bg-Gray-2 flex h-15 w-[clamp(2.5rem,16vw,4rem)] items-end overflow-hidden rounded-t-sm">
              <div
                className={`w-full rounded-t-sm transition-[height] duration-300 ${color}`}
                style={{ height: `${value}%` }}
                aria-hidden="true"
              />
            </div>
            <span className="pretendard-Caption3 text-Gray-6 truncate">{row.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function AllocationRateChart({ rows }: { rows: DiaryRateRow[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((row) => {
        const value = clampRate(row.value)
        const color =
          (row.key && ALLOCATION_RATE_COLOR_BY_LEVEL[row.key]) ?? DEFAULT_ALLOCATION_RATE_COLOR
        return (
          <div key={row.label} className="flex items-center gap-2.25">
            <span className="pretendard-Caption3 text-Gray-6 w-10 shrink-0 truncate">
              {row.label}
            </span>
            <ProgressBar progress={value} barColor={color} heightClassName="h-2.5" />
            <span className="pretendard-Caption3 text-Gray-6 w-8 shrink-0 text-right">
              {value}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

function StockRateRanking({ rows }: { rows: DiaryRateRow[] }) {
  const rankedRows = [...rows].sort((first, second) => second.value - first.value)

  return (
    <ol className="flex flex-col gap-2">
      {rankedRows.map((row, index) => {
        const value = clampRate(row.value)
        const rankColor = RANK_COLORS[index % RANK_COLORS.length]
        const rankSurface = RANK_SURFACES[index % RANK_SURFACES.length]
        return (
          <li
            key={row.label}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${rankSurface}`}
          >
            <span
              className={`dnf-Subtitle3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${rankColor}`}
            >
              {index + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="pretendard-Caption3 text-Gray-6">{index + 1}위</span>
              <span className="pretendard-Button2 text-Gray-10 truncate">{row.label}</span>
            </div>
            <span className="dnf-Subtitle3 text-Gray-10 shrink-0">{value}%</span>
          </li>
        )
      })}
    </ol>
  )
}

function RateVisualization({ group }: { group: DiaryRateGroup }) {
  switch (group.id) {
    case 'direction':
      return <DirectionRateChart rows={group.rows} />
    case 'stock':
      return <StockRateRanking rows={group.rows} />
    case 'agent':
      return <AgentRateChart rows={group.rows} />
    case 'allocation-rate':
      return <AllocationRateChart rows={group.rows} />
    default:
      return <DirectionRateChart rows={group.rows} />
  }
}

export interface DiaryRateProgressCardProps {
  group: DiaryRateGroup
  className?: string
}

/** 통계 범주별로 가장 읽기 쉬운 시각화를 선택해 보여준다. */
export function DiaryRateProgressCard({ group, className = '' }: DiaryRateProgressCardProps) {
  const { title, subtitle } = group

  return (
    <section
      className={twMerge(
        'bg-White border-Gray-2 flex flex-col gap-4 rounded-lg border px-5 py-4.5',
        className,
      )}
    >
      <header className="flex flex-col gap-1.5">
        <h3 className="dnf-Caption2 text-Gray-10">{title}</h3>
        <p className="pretendard-Caption3 text-Gray-6">{subtitle}</p>
      </header>
      <RateVisualization group={group} />
    </section>
  )
}
