export const briefingQueryKeys = {
  all: ['briefings'] as const,
  detail: (briefingId: string) => [...briefingQueryKeys.all, 'detail', briefingId] as const,
  listByCard: (cardId: string) => [...briefingQueryKeys.all, 'list', 'card', cardId] as const,
  officeList: () => [...briefingQueryKeys.all, 'office'] as const,
}
