import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/routes/Router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto flex min-h-[100dvh] w-full flex-col bg-white max-md:w-full md:max-w-[768px] md:shadow-xl">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  )
}

export default App
