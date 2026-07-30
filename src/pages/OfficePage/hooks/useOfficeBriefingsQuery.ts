import { z } from 'zod'

import { getOfficeBriefings } from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { useApiQuery } from '@/hooks/api'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapOfficeBriefings } from '@/mappers/briefingMapper'

export function useOfficeBriefingsQuery() {
  return useApiQuery({
    queryKey: briefingQueryKeys.officeList(),
    operation: getOfficeBriefings,
    endpoint: 'getOfficeBriefings',
    args: [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    responseSchema: z.any() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: 'requiredResult' as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: (result: any) => mapOfficeBriefings(result),
    staleTime: 0,
  })
}
