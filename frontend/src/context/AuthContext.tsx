import{
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react'

// User type
export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MEMBER'
  createdAt?: string
}

// Context type
interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Props type
interface AuthProviderProps {
  children: ReactNode
}

// Provider
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }

    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}