import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { createAppQueryClient } from '@/api/client/queryPolicy'
import { router } from '@/routes/Router'

const queryClient = createAppQueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto flex min-h-dvh w-full flex-col bg-white max-md:w-full md:max-w-3xl md:shadow-xl">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  )
}

export default App
