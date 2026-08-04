export const userQueryKeys = {
  all: ['user'] as const,
  profile: () => [...userQueryKeys.all, 'profile'] as const,
  home: () => [...userQueryKeys.all, 'home'] as const,
}
