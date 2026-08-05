import type { AgentStatusMap } from '@/components/feature/office/Office'
import { Office } from '@/components/feature/office/Office'
import { PageStatusShell } from '@/components/feedback/PageStatusShell'
import { StatusMessage } from '@/components/feedback/StatusMessage'

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
    <PageStatusShell headerText={headerText}>
      <Office agentStatusMap={agentStatusMap} />
      <StatusMessage
        title={title}
        description={<span className="block text-center whitespace-pre-line">{description}</span>}
      />
    </PageStatusShell>
  )
}
