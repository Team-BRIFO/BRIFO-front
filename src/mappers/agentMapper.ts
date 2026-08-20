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

/** 에이전트별로 제품에서 고정해 보여주는 모델명. API 응답 모델명은 표시하지 않는다. */
export const AGENT_MODEL_NAME: Record<AgentType, string> = {
  rookie: 'Gemini 3.5 Flash',
  tanker: 'GPT-5.3',
  pro: 'Claude Sonnet 4.6',
}

export function mapAgentType(code: string): AgentType {
  if (code === 'PRO') return 'pro'
  if (code === 'TANKER') return 'tanker'
  return 'rookie'
}

export function mapAgentListItem(item: GetAgentsResponseOutput['items'][number]): AgentSummary {
  const type = AGENT_TYPE_BY_CODE[item.agentType]

  return {
    id: item.agentId,
    type,
    name: item.nickname,
    modelName: AGENT_MODEL_NAME[type],
    level: item.level,
    levelProgress: getAgentLevelProgress(item.exp),
    hitRate: item.accuracyRate,
    dailyAP: item.dailySalary,
  }
}

export function mapAgentDetail(res: GetAgentDetailResponseOutput): AgentDetail {
  const levelProgress = getAgentLevelProgress(res.exp)
  const type = AGENT_TYPE_BY_CODE[res.agentType]

  return {
    id: res.agentId,
    type,
    name: res.nickname,
    modelName: AGENT_MODEL_NAME[type],
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
