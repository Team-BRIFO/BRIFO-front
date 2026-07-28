export const agentQueryKeys = {
  all: ['agent'] as const,
  list: () => [...agentQueryKeys.all, 'list'] as const,
  detail: (agentId: string) => [...agentQueryKeys.all, 'detail', agentId] as const,
}
