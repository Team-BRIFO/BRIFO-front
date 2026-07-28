import type { AgentDetailResponse, AgentListItemResponse, AgentTypeCode } from '@/types/api/agent'
import type { AgentDetail, AgentSummary, AgentType } from '@/types/domain/agent'

export const AGENT_TYPE_BY_CODE: Record<AgentTypeCode, AgentType> = {
  ROOKIE: 'rookie',
  PRO: 'pro',
  TANKER: 'tanker',
}

export function mapAgentType(code: string): AgentType {
  if (code === 'PRO') return 'pro'
  if (code === 'TANKER') return 'tanker'
  return 'rookie'
}

const EXP_PER_LEVEL = 500

const getLevelProgress = (exp: number, max: number) =>
  max > 0 ? Math.min(Math.max(Math.round((exp / max) * 100), 0), 100) : 0

export function mapAgentListItem(item: AgentListItemResponse): AgentSummary {
  return {
    id: item.agentId,
    type: AGENT_TYPE_BY_CODE[item.agentType],
    name: item.nickname,
    modelName: item.modelName,
    level: item.level,
    levelProgress: getLevelProgress(item.exp, EXP_PER_LEVEL),
    hitRate: item.accuracyRate,
    dailyAP: item.dailySalary,
  }
}

export function mapAgentDetail(res: AgentDetailResponse): AgentDetail {
  const max = EXP_PER_LEVEL

  return {
    id: res.agentId,
    type: AGENT_TYPE_BY_CODE[res.agentType],
    name: res.nickname,
    modelName: res.modelName,
    description: res.description,
    level: res.level,
    levelProgress: getLevelProgress(res.exp, max),
    exp: { current: res.exp, max },
    stats: {
      hitRate: res.accuracyRate,
      totalAnalysis: res.totalAnalyses,
      contributedAP: res.contributedAp,
      workStreak: res.consecutiveWorkDays,
    },
  }
}
