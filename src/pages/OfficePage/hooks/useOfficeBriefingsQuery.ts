/* eslint-disable @typescript-eslint/no-explicit-any */
import { browserTokenStore } from '@/api/client/tokenStore'
import { getOfficeBriefings } from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { ApiResponseGetOfficeBriefingsResponse } from '@/api/generated/schemas'
import { useApiQuery } from '@/hooks/api'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapOfficeBriefings } from '@/mappers/briefingMapper'
import { MOCK_OFFICE_BRIEFING_LIST } from '@/pages/BriefingPage/mockBriefing'

const mockGetOfficeBriefings = async () => {
  const MOCK_DATA: ApiResponseGetOfficeBriefingsResponse = {
    success: true,
    code: 'COMMON_200',
    message: 'Success',
    result: MOCK_OFFICE_BRIEFING_LIST as any,
  }

  if (!browserTokenStore.getAccessToken()) {
    return MOCK_DATA
  }

  try {
    return await getOfficeBriefings()
  } catch {
    return MOCK_DATA
  }
}

export function useOfficeBriefingsQuery() {
  return useApiQuery({
    queryKey: briefingQueryKeys.officeList(),
    operation: mockGetOfficeBriefings as typeof getOfficeBriefings,
    endpoint: 'getOfficeBriefings',
    args: [],
    responseSchema: ApiResponseGetOfficeBriefingsResponse,
    response: 'requiredResult',
    map: (result) => mapOfficeBriefings(result as any),
    staleTime: 0,
  })
}
