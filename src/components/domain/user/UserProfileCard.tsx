import type { HTMLAttributes } from 'react'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

import { AgentAvatar } from '@/components/domain/agent/AgentAvatar'
import type { UserProfile } from '@/types/domain/user'

export interface UserProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  profile: UserProfile
  /** 캐릭터 크기(px). 기본 60 (마이 메인) */
  avatarSize?: number
}

/** 마이 프로필 카드 (캐릭터 · 닉네임 · 회사명 · 직함) */
export function UserProfileCard({
  profile,
  avatarSize = 60,
  className = '',
  ...props
}: UserProfileCardProps) {
  const { nickname, companyName, jobTitle, characterType } = profile

  // 회사명/직함이 비어 있을 수 있으므로 값이 있는 것만 가운뎃점으로 잇는다
  const metaItems = [companyName, jobTitle].filter(Boolean)

  return (
    <div
      className={twMerge(
        'border-Gray-2 bg-White rounded-lg border px-3 py-3.5',
        'shadow-[0px_4px_40px_0px_rgba(224,224,224,0.15)]',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-[15px]">
        <AgentAvatar type={characterType} size={avatarSize} />

        <div className="flex min-w-0 flex-col justify-center gap-2">
          <span className="dnf-Subtitle2 text-Gray-10 truncate">{nickname}</span>

          {metaItems.length > 0 && (
            <div className="flex items-center gap-1">
              {metaItems.map((item, index) => (
                <Fragment key={item}>
                  {index > 0 && (
                    <span
                      className="bg-Gray-5 h-0.5 w-0.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                  <span className="pretendard-Caption3 text-Gray-6 truncate">{item}</span>
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
