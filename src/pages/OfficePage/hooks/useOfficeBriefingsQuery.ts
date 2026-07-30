/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOfficeBriefings } from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { ApiResponseGetOfficeBriefingsResponse } from '@/api/generated/schemas'
import { useApiQuery } from '@/hooks/api'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapOfficeBriefings } from '@/mappers/briefingMapper'

export function useOfficeBriefingsQuery() {
  return useApiQuery({
    queryKey: briefingQueryKeys.officeList(),
    operation: getOfficeBriefings,
    endpoint: 'getOfficeBriefings',
    args: [],
    responseSchema: ApiResponseGetOfficeBriefingsResponse,
    response: 'requiredResult',
    map: (result) => mapOfficeBriefings(result as any),
    staleTime: 0,
  })
}
