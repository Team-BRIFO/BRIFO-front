export const diaryQueryKeys = {
  all: ['diaries'] as const,
  calendars: () => [...diaryQueryKeys.all, 'calendar'] as const,
  calendar: (year: number, month: number) => [...diaryQueryKeys.calendars(), year, month] as const,
  list: (size: number) => [...diaryQueryKeys.all, 'list', { size }] as const,
  detail: (diaryId: string) => [...diaryQueryKeys.all, 'detail', diaryId] as const,
  stats: () => [...diaryQueryKeys.all, 'stats'] as const,
}
