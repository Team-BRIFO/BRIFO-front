import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { createAppQueryClient } from '@/api/client/queryPolicy'
import { GlobalNetworkErrorOverlay } from '@/components/feedback/GlobalNetworkErrorOverlay'
import { router } from '@/routes/Router'

const queryClient = createAppQueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-white max-md:w-full md:max-w-3xl md:shadow-xl">
        <div className="min-h-0 flex-1 overflow-hidden">
          <RouterProvider router={router} />
        </div>
        <GlobalNetworkErrorOverlay />
      </div>
    </QueryClientProvider>
  )
}

export default App
