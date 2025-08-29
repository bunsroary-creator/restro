import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User } from '../types'
import { authService } from '../services/auth'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('admin_token'),
  loading: false,
  error: null
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      localStorage.setItem('admin_token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      }
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'LOGOUT':
      localStorage.removeItem('admin_token')
      return { ...state, user: null, token: null, loading: false, error: null }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initAuth = async () => {
      if (state.token) {
        try {
          const user = await authService.getCurrentUser()
          if (!['admin', 'manager', 'staff'].includes(user.role)) {
            throw new Error('Insufficient permissions')
          }
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: state.token } })
        } catch (error) {
          dispatch({ type: 'LOGOUT' })
        }
      }
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await authService.login(email, password)
      const user = response.data.user
      
      if (!['admin', 'manager', 'staff'].includes(user.role)) {
        throw new Error('Access denied. Admin privileges required.')
      }
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user, 
          token: response.data.token 
        } 
      })
    } catch (error: any) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message || 'Login failed' })
      throw error
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    isAuthenticated: !!state.user && !!state.token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}