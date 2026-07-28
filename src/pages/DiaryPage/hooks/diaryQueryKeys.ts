export const diaryQueryKeys = {
  all: ['diaries'] as const,
  calendar: (year: number, month: number) =>
    [...diaryQueryKeys.all, 'calendar', year, month] as const,
  list: (size: number) => [...diaryQueryKeys.all, 'list', { size }] as const,
  detail: (diaryId: string) => [...diaryQueryKeys.all, 'detail', diaryId] as const,
  stats: () => [...diaryQueryKeys.all, 'stats'] as const,
}
