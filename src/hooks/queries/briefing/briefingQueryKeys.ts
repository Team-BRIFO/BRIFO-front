export const briefingQueryKeys = {
  all: ['briefings'] as const,
  detail: (briefingId: string) => [...briefingQueryKeys.all, 'detail', briefingId] as const,
  listByStock: (stockId: string) => [...briefingQueryKeys.all, 'list', 'stock', stockId] as const,
  officeList: () => [...briefingQueryKeys.all, 'office'] as const,
}
