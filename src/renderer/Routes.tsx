// import { Route, Router } from 'electron-router-dom'

import { Navigate, Route, Routes } from 'react-router-dom'

import { Blank } from '@renderer/pages/blank'
import { GFCreate } from '@renderer/pages/gamification/create'
import { GFCreate2 } from '@renderer/pages/gamification/create2'
import { Login } from '@renderer/pages/login'
import { RequireAuth } from '@renderer/Auth'
import { WFCreate } from '@renderer/pages/workflows/create2'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route index path="/" element={<Blank />} />
        <Route path="/workflows/create" element={<WFCreate />} />
        <Route path="/gamification/create" element={<GFCreate />} />
        <Route path="/gamification/create2" element={<GFCreate2 />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
