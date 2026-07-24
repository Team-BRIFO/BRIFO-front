import { Office, type AgentStatusMap } from '@/components/feature/office/Office'

import { ErrorView, type ErrorViewProps } from './ErrorView'

export interface ErrorPageTemplateProps extends ErrorViewProps {
  /** 에이전트 상태 (로딩중 등 캐릭터 애니메이션 조정용) */
  agentStatusMap?: AgentStatusMap
}

/** 
 * 에러 및 로딩 페이지의 공통 템플릿 
 * 상단에 사무실 배경을 보여주고 하단에 에러 문구와 버튼을 노출합니다.
 */
export function ErrorPageTemplate({ agentStatusMap, ...errorViewProps }: ErrorPageTemplateProps) {
  return (
    <div className="flex min-h-[100dvh] bg-Gray-1 w-full flex-col pb-24">
      <div className="flex flex-col gap-5.5 px-4 pt-10">
        <Office agentStatusMap={agentStatusMap} />
        <ErrorView {...errorViewProps} />
      </div>
    </div>
  )
}
