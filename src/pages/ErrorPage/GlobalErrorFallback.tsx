import { useRouteError } from 'react-router-dom'

import { PageErrorView } from '@/components/feedback/PageErrorView'

export default function GlobalErrorFallback() {
  const error = useRouteError()

  return (
    <div className="mx-auto flex min-h-dvh w-full flex-col bg-white max-md:w-full md:max-w-3xl md:shadow-xl">
      <PageErrorView
        error={error}
        buttonText="새로고침"
        onButtonClick={() => window.location.reload()}
      />
    </div>
  )
}
