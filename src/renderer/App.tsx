import './styles/global.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
import { AppRoutes } from './Routes'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  )
}
