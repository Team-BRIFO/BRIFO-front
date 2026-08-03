import { useNavigate } from 'react-router-dom'

import LoaderIcon from '@/assets/icons/loader-1.svg?react'
import Logo from '@/assets/logo/brifo_logo.svg?react'
import { StatusBar, StatusBarNotificationButton } from '@/components/common/StatusBar'
import { ErrorView, type ErrorViewProps } from '@/components/feature/error/ErrorView'
import { type AgentStatusMap, Office } from '@/components/feature/office/Office'
import { PATH } from '@/routes/paths'

export interface ErrorPageTemplateProps extends ErrorViewProps {
  /** 에이전트 상태 (로딩중 등 캐릭터 애니메이션 조정용) */
  agentStatusMap?: AgentStatusMap
  /** 상단 헤더 텍스트 (예: '로딩 중...') */
  headerText?: string
  /** 상단 커스텀 아이콘 (기본: LoaderIcon) */
  headerIcon?: React.ReactNode
}

/**
 * 에러 및 로딩 페이지의 공통 템플릿
 * 상단에 사무실 배경을 보여주고 하단에 에러 문구와 버튼을 노출합니다.
 */
export function ErrorPageTemplate({
  agentStatusMap,
  headerText,
  headerIcon,
  ...errorViewProps
}: ErrorPageTemplateProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-Background1 mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden sm:max-h-[915px]">
      <StatusBar
        hasStatusArea
        className="bg-White w-full"
        left={<Logo className="h-6 w-21" />}
        right={
          <div className="flex items-center gap-3">
            <StatusBarNotificationButton onClick={() => navigate(PATH.NOTIFICATION)} />
          </div>
        }
      />

      <div className="flex flex-col gap-3 px-4 pt-3">
        {headerText && (
          <div className="flex items-center justify-center gap-2.5">
            {headerIcon || (
              <LoaderIcon
                className="text-Gray-5 h-4 w-4 animate-spin"
                style={{ animationDuration: '3s' }}
              />
            )}
            <span className="pretendard-Caption1 text-Gray-5">{headerText}</span>
          </div>
        )}
        <Office agentStatusMap={agentStatusMap} />
        <ErrorView {...errorViewProps} />
      </div>
    </div>
  )
}
