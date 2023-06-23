import { Navigate, Outlet } from 'react-router-dom'

import Layout from '@renderer/components/Layouts'
import useAuth from '@renderer/store/useAuth'

export const RequireAuth = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  console.log('isAuthenticated', isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
