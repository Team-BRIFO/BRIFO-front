import { mapAgentType } from '@/mappers/agentMapper'
import type { AgentDetailResponse } from '@/types/api/agent'
import type {
  CreateBriefingResponseOutput,
  GetBriefingDetailResponseOutput,
  GetOfficeBriefingsResponseOutput,
  GetStockBriefingsResponseOutput,
} from '@/api/generated/schemas/briefing-controller'
import type {
  BriefingDetailData,
  BriefingDirectionType,
  BriefingListData,
  BriefingRequestResult,
  BriefingStock,
  OfficeBriefingItem,
} from '@/types/domain/briefing'
import { getAgentLevelProgress } from '@/utils/agentLevel'

const DIRECTION_META: Record<
  'UP' | 'DOWN' | 'NEUTRAL',
  { type: BriefingDirectionType; label: string }
> = {
  UP: { type: 'rise', label: '상승 예측' },
  DOWN: { type: 'fall', label: '하락 예측' },
  NEUTRAL: { type: 'watch', label: '관망' },
}

function mapBriefingStock(
  stock: GetBriefingDetailResponseOutput['stock'] | GetStockBriefingsResponseOutput['stock'],
): BriefingStock {
  return {
    id: stock.stockId,
    name: stock.name,
    price: stock.price,
    changeRate: stock.changeRate,
    tradeDate: stock.tradeDate,
    hashtags: [],
  }
}

export function mapBriefingList(result: GetStockBriefingsResponseOutput): BriefingListData {
  return {
    stock: mapBriefingStock(result.stock),
    items: result.items.map((item) => ({
      id: item.briefingId,
      agentId: item.agentId,
      agentType: mapAgentType(item.agentType),
      nickname: item.nickname,
      status: item.status,
      direction: item.direction ? DIRECTION_META[item.direction].type : null,
      oneLiner: item.oneLiner,
    })),
  }
}

export function mapBriefingDetail(
  result: GetBriefingDetailResponseOutput,
  agentDetail?: AgentDetailResponse,
): BriefingDetailData {
  const direction = DIRECTION_META[result.briefing.direction]
  const agentType = mapAgentType(result.agent.agentType)

  return {
    stock: mapBriefingStock(result.stock),
    activeTab: agentType,
    agent: {
      id: result.agent.agentId,
      type: agentType,
      name: result.agent.nickname,
      modelName: result.agent.modelName,
      level: agentDetail?.level ?? 1,
      levelProgress: getAgentLevelProgress(agentDetail?.exp ?? 0),
      hitRate: agentDetail?.accuracyRate ?? 0,
      dailyAP: agentDetail?.dailySalary ?? 0,
    },
    briefing: {
      badgeType: direction.type,
      badgeText: direction.label,
      percentage: result.briefing.confidenceRate,
      headline: result.briefing.summary,
      commentTag: '사장님 맞춤',
      comment: result.briefing.personalComment ?? '',
      noteMessage: result.briefing.contentText,
      recommendText: result.briefing.oneLiner,
    },
  }
}

export function mapOfficeBriefings(result: GetOfficeBriefingsResponseOutput): OfficeBriefingItem[] {
  return result.items.map((item) => ({
    stockName: item.stockName,
    agents: item.agents.map((agent) => ({
      briefingId: agent.briefingId,
      agentId: agent.agentId,
      name: agent.nickname,
      type: mapAgentType(agent.agentType),
      status: agent.status,
    })),
  }))
}

export function mapBriefingRequestResult(result: CreateBriefingResponseOutput): BriefingRequestResult {
  return {
    requestedCount: result.requestedCount,
    totalSalaryCost: result.totalSalaryCost,
    requestedAgents: result.requestedAgents.map((agent) => ({
      briefingId: agent.briefingId,
      agentId: agent.agentId,
      type: mapAgentType(agent.agentType),
      salaryCost: agent.salaryCost,
    })),
  }
}
