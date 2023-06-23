export type Authenticated = {
  token: string | null
  user: any | null
}

export type StoreAuth = {
  authenticated: any
  isAuthenticated?: boolean
}

export type ActionAuth = {
  login: (authenticated: any) => void
  logout: () => void
}
