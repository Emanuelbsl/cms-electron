import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useLocalStorage } from '../hooks/useLocalStorage'

interface AuthContextData {
  user: any
  loading: boolean
  authenticated: boolean
  logout: () => void
  login: (data: any) => void
}

const authContextDefaultValue: AuthContextData = {
  user: {},
  authenticated: false,
  loading: false,
  logout: () => null,
  login: () => null,
}

export const AuthContext = createContext<AuthContextData>(
  authContextDefaultValue,
)

export const AuthProvider = () => {
  const [storage, setStorage] = useLocalStorage('user')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (storage) {
      setUser(storage)
    }
    setLoading(false)
  }, [storage])

  const login = useCallback(
    async (data: any) => {
      setStorage(data)
      setUser(data)
      navigate('/workflows/create', { replace: true })
    },
    [navigate],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo(
    () => ({ authenticated: !!user, user, login, logout, loading }),
    [login, logout, user, loading],
  )

  return (
    <Suspense fallback={<p>...Carregando</p>}>
      <AuthContext.Provider value={value}>
        <Outlet />
      </AuthContext.Provider>
    </Suspense>
  )
}

export const Private = () => {
  const { authenticated, loading } = useContext(AuthContext)
  if (loading) {
    return <p>...Carregando</p>
  }

  if (!authenticated) {
    return <Navigate to="/login" />
  }
  return <Outlet />
}
