export const myQueryKeys = {
  all: ['my'] as const,
  ap: (size: number) => [...myQueryKeys.all, 'ap', { size }] as const,
  badges: () => [...myQueryKeys.all, 'badges'] as const,
  terms: (size: number) => [...myQueryKeys.all, 'terms', { size }] as const,
}
