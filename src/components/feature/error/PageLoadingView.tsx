import LoaderIcon from '@/assets/icons/loader-1.svg?react'
import { ErrorView } from '@/components/feature/error/ErrorView'
import { type AgentStatusMap, Office } from '@/components/feature/office/Office'

interface PageLoadingViewProps {
  headerText?: string
  title?: string
  description?: string
  agentStatusMap?: AgentStatusMap
}

export function PageLoadingView({
  headerText = '로딩 중...',
  title = '사원들이 회의 중이에요',
  description = '잠시만 기다려 주세요.',
  agentStatusMap = {
    rookie: 'ANALYZING',
    pro: 'ANALYZING',
    tanker: 'ANALYZING',
  },
}: PageLoadingViewProps) {
  return (
    <div className="flex w-full flex-1 flex-col gap-3 overflow-y-auto px-4 pt-3 pb-10">
      {headerText && (
        <div className="flex items-center justify-center gap-2.5">
          <LoaderIcon
            className="text-Gray-5 h-4 w-4 animate-spin"
            style={{ animationDuration: '3s' }}
          />
          <span className="pretendard-Caption1 text-Gray-5">{headerText}</span>
        </div>
      )}
      <Office agentStatusMap={agentStatusMap} />
      <ErrorView
        title={title}
        description={<span className="block text-center whitespace-pre-line">{description}</span>}
      />
    </div>
  )
}
