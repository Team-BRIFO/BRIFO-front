import type {
  GetAgentDetailResponseOutput,
  GetAgentsResponseOutput,
} from '@/api/generated/schemas/agent-controller'
import type { AgentDetail, AgentSummary, AgentType } from '@/types/domain/agent'
import { AGENT_EXP_PER_LEVEL, getAgentLevelProgress } from '@/utils/agentLevel'

export const AGENT_TYPE_BY_CODE: Record<'ROOKIE' | 'PRO' | 'TANKER', AgentType> = {
  ROOKIE: 'rookie',
  PRO: 'pro',
  TANKER: 'tanker',
}

export function mapAgentType(code: string): AgentType {
  if (code === 'PRO') return 'pro'
  if (code === 'TANKER') return 'tanker'
  return 'rookie'
}

export function mapAgentListItem(item: GetAgentsResponseOutput['items'][number]): AgentSummary {
  return {
    id: item.agentId,
    type: AGENT_TYPE_BY_CODE[item.agentType],
    name: item.nickname,
    modelName: item.modelName,
    level: item.level,
    levelProgress: getAgentLevelProgress(item.exp),
    hitRate: item.accuracyRate,
    dailyAP: item.dailySalary,
  }
}

export function mapAgentDetail(res: GetAgentDetailResponseOutput): AgentDetail {
  const levelProgress = getAgentLevelProgress(res.exp)

  return {
    id: res.agentId,
    type: AGENT_TYPE_BY_CODE[res.agentType],
    name: res.nickname,
    modelName: res.modelName,
    description: res.description ?? '',
    level: res.level,
    levelProgress,
    exp: { current: levelProgress, max: AGENT_EXP_PER_LEVEL },
    stats: {
      hitRate: res.accuracyRate,
      totalAnalysis: res.totalAnalyses,
      contributedAP: res.contributedAp,
      workStreak: res.consecutiveWorkDays,
    },
  }
}
