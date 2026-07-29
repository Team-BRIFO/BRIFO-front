export const AGENT_EXP_PER_LEVEL = 100

/** 누적 경험치를 현재 레벨의 진행률(0~99%)로 변환한다. */
export function getAgentLevelProgress(exp: number): number {
  return exp % AGENT_EXP_PER_LEVEL
}
