import { getOfficeBriefings } from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { ApiResponseGetOfficeBriefingsResponse } from '@/api/generated/schemas/briefing-controller'
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
    map: mapOfficeBriefings,
    staleTime: 0,
  })
}
