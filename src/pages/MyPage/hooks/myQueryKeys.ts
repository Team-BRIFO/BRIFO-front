export const myQueryKeys = {
  all: ['my'] as const,
  ap: (size: number) => [...myQueryKeys.all, 'ap', { size }] as const,
  badges: () => [...myQueryKeys.all, 'badges'] as const,
  badge: (id: string) => [...myQueryKeys.badges(), id] as const,
  terms: (size: number) => [...myQueryKeys.all, 'terms', { size }] as const,
}
