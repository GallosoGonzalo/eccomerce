import { createContext, useContext, useEffect, useState } from 'react'
import { authLogin, authMe, authSignup, clearAuthToken, getAuthToken, setAuthToken } from '@/lib/api'
import type { AuthUser } from '@/lib/types'

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(getAuthToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const me = await authMe()
        setUser(me)
      } catch (error) {
        console.error('Error restoring session', error)
        clearAuthToken()
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [token])

  const signUp = async (email: string, password: string, fullName: string) => {
    const result = await authSignup(email, password, fullName)
    setAuthToken(result.accessToken)
    setToken(result.accessToken)
    setUser(result.user)
  }

  const signIn = async (email: string, password: string) => {
    const result = await authLogin(email, password)
    setAuthToken(result.accessToken)
    setToken(result.accessToken)
    setUser(result.user)
  }

  const signOut = () => {
    clearAuthToken()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
