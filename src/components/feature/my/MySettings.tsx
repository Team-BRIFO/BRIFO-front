import type { ReactNode } from 'react'

import { MenuRow, MenuRowGroup } from '@/components/common/MenuRow'
import type { MyMenuKey } from '@/constants/myMenu'
import { MY_SETTINGS_SECTIONS } from '@/constants/myMenu'

export interface MySettingsProps {
  onSelectMenu?: (key: MyMenuKey) => void
  accountManagement?: ReactNode
}

/** 설정 화면(SCR-13) 본문 — 계정 · 학습 · 도움말 · 계정관리 섹션 */
export function MySettings({ onSelectMenu, accountManagement }: MySettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      {MY_SETTINGS_SECTIONS.map(({ title, items }) =>
        title === '계정관리' && accountManagement ? (
          <div key={title}>{accountManagement}</div>
        ) : (
          <section key={title} className="flex flex-col gap-2">
            <h2 className="font-pretendard text-Gray-6 text-sm leading-5 font-normal tracking-[-0.56px]">
              {title}
            </h2>

            <MenuRowGroup>
              {items.map(({ key, label, variant }) => (
                <MenuRow
                  key={key}
                  label={label}
                  variant={variant}
                  onClick={() => onSelectMenu?.(key)}
                />
              ))}
            </MenuRowGroup>
          </section>
        ),
      )}
    </div>
  )
}
