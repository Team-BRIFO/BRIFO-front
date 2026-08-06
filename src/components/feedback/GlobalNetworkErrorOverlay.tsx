import { useEffect, useState } from 'react'

import { ApiError } from '@/api/client/ApiError'
import { PageErrorView } from '@/components/feedback/PageErrorView'

const GLOBAL_NETWORK_ERROR = new ApiError({
  kind: 'network',
  endpoint: 'GLOBAL',
  code: 'NETWORK_ERROR',
  message: '네트워크 연결을 확인해 주세요.',
})

export function GlobalNetworkErrorOverlay() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="bg-Background1 fixed inset-0 z-9999 mx-auto flex w-full flex-col max-md:w-full md:max-w-3xl">
      <PageErrorView error={GLOBAL_NETWORK_ERROR} />
    </div>
  )
}
