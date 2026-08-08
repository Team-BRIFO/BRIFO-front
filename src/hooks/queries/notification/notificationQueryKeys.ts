export const notificationQueryKeys = {
  all: ['notifications'] as const,
  list: (size: number) => [...notificationQueryKeys.all, 'list', { size }] as const,
}
