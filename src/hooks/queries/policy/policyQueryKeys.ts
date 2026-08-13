export const policyQueryKeys = {
  all: ['onboarding', 'policies'] as const,
  list: () => policyQueryKeys.all,
  detail: (policyId: string) => [...policyQueryKeys.all, policyId] as const,
  pending: () => ['policies', 'pending'] as const,
}
