import { useQuery } from '@tanstack/react-query'

import { getOfficeBriefings } from '@/api/briefing'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapOfficeBriefings } from '@/mappers/briefingMapper'

export function useOfficeBriefingsQuery() {
  return useQuery({
    queryKey: briefingQueryKeys.officeList(),
    staleTime: 0,
    queryFn: async () => mapOfficeBriefings((await getOfficeBriefings()).result),
  })
}
