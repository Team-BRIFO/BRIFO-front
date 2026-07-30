export const termQueryKeys = {
  all: ['terms'] as const,
  detail: (termId: string) => [...termQueryKeys.all, 'detail', termId] as const,
  myTerms: (size: number) => [...termQueryKeys.all, 'myTerms', size] as const,
}
