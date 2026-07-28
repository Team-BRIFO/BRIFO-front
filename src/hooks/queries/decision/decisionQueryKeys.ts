export const decisionQueryKeys = {
  all: ['decisions'] as const,
  list: () => [...decisionQueryKeys.all, 'list'] as const,
  detail: (decisionId: string) => [...decisionQueryKeys.all, 'detail', decisionId] as const,
}
