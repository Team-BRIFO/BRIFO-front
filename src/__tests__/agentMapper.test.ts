import { describe, expect, it } from 'vitest'

import { AGENT_MODEL_NAME, mapAgentListItem } from '@/mappers/agentMapper'

describe('agentMapper', () => {
  it('uses the product model name for each agent instead of the API value', () => {
    const items = [
      { agentType: 'ROOKIE', expectedModelName: 'Gemini 3.5 Flash' },
      { agentType: 'TANKER', expectedModelName: 'GPT-5.3' },
      { agentType: 'PRO', expectedModelName: 'Claude Sonnet 4.6' },
    ] as const

    for (const { agentType, expectedModelName } of items) {
      const agent = mapAgentListItem({
        agentId: '11111111-1111-1111-1111-111111111111',
        nickname: 'API 사원명',
        agentType,
        modelName: 'API-provided-model-name',
        level: 1,
        exp: 0,
        dailySalary: 100,
        accuracyRate: 50,
      })

      expect(agent.modelName).toBe(expectedModelName)
    }

    expect(AGENT_MODEL_NAME).toEqual({
      rookie: 'Gemini 3.5 Flash',
      tanker: 'GPT-5.3',
      pro: 'Claude Sonnet 4.6',
    })
  })
})
