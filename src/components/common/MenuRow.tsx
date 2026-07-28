import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react'

export type MenuRowVariant = 'default' | 'danger'

const VARIANT_TEXT_CLASS: Record<MenuRowVariant, string> = {
  default: 'text-Gray-10',
  danger: 'text-Pink-30',
}

export interface MenuRowProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 행 라벨 (예: 프로필 편집) */
  label: string
  /**
   * 좌측 아이콘 — 전달하면 원형 배경 안에 표시된다.
   * 마이 메인 메뉴는 아이콘 O, 설정 화면 행은 아이콘 X.
   */
  icon?: ReactNode
  variant?: MenuRowVariant
  /** chevron 앞에 붙는 보조 요소 (값 텍스트, Toggle 등) */
  right?: ReactNode
  /** chevron 표시 여부 (기본 true) */
  hasChevron?: boolean
}

/** 아이콘 + 라벨 + chevron 메뉴 행 (마이 메인 · 설정 공용) */
export function MenuRow({
  label,
  icon,
  variant = 'default',
  right,
  hasChevron = true,
  className = '',
  ...props
}: MenuRowProps) {
  return (
    <button
      type="button"
      className={twMerge(
        'flex w-full items-center justify-between gap-3 px-4 py-3',
        'border-Gray-2 border-t first:border-t-0',
        'hover:bg-Background1 transition-colors duration-150',
        'focus-visible:ring-Yellow-45 focus-visible:ring-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-3">
        {icon && (
          <span className="bg-Yellow-80 [&_path]:fill-Yellow-20 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full [&_svg]:size-5.5">
            {icon}
          </span>
        )}
        <span
          className={twMerge('pretendard-Body2-Semibold truncate', VARIANT_TEXT_CLASS[variant])}
        >
          {label}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-1">
        {right}
        {hasChevron && (
          <ChevronRightIcon
            width={24}
            height={24}
            aria-hidden="true"
            className="[&_path]:fill-Gray-5"
          />
        )}
      </span>
    </button>
  )
}

/** MenuRow 묶음 — 카드 테두리로 감싸고 행 사이 구분선을 그린다 */
export function MenuRowGroup({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White flex flex-col overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
