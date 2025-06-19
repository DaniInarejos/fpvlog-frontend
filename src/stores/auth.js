import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user
  },

  actions: {
    // Inicializar el estado de autenticación al cargar la app
    async initializeAuth() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
        this.isLoading = true
        try {
          await this.fetchUser()
        } catch (error) {
          console.error('Error al verificar token:', error)
          this.logout()
        } finally {
          this.isLoading = false
        }
      }
    },

    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        this.isAuthenticated = true
        
        localStorage.setItem('auth_token', token)
        
        return { success: true }
      } catch (error) {
        console.error('Login error:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error al iniciar sesión' 
        }
      }
    },

    async register(userData) {
      try {
        const response = await api.post('/auth/register', userData)
        const { token, user } = response.data
        
        // Después del registro exitoso, loguear automáticamente
        this.token = token
        this.user = user
        this.isAuthenticated = true
        
        localStorage.setItem('auth_token', token)
        
        return { success: true }
      } catch (error) {
        console.error('Register error:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error al registrar usuario' 
        }
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('auth_token')
    },

    async fetchUser() {
      if (!this.token) return
      
      try {
        const response = await api.get('/users/profile')
        this.user = response.data
        this.isAuthenticated = true
      } catch (error) {
        console.error('Fetch user error:', error)
        // Si el token es inválido, limpiar la sesión
        this.logout()
        throw error
      }
    },
    
    async updateProfile(profileData) {
      try {
        if (!this.user || !this.user._id) {
          throw new Error('Usuario no encontrado')
        }
        
        const response = await api.patch(`/users/${this.user._id}`, profileData)
        
        // Actualizar los datos del usuario en el store
        this.user = { ...this.user, ...response.data }
        
        return { success: true }
      } catch (error) {
        console.error('Profile update error:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error al actualizar el perfil' 
        }
      }
    }
  }
})