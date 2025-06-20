import { defineStore } from 'pinia'
import userService from '../services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token'),
    isLoading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userInitials: (state) => {
      if (!state.user?.name) return ''
      
      const nameParts = state.user.name.split(' ')
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      }
      
      return nameParts[0][0].toUpperCase()
    }
  },
  
  actions: {
    async initAuth() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
        try {
          const user = await userService.getCurrentUser()
          this.user = user
          return true
        } catch (error) {
          // Si hay un error al obtener el usuario, limpiamos el token
          this.logout()
          return false
        }
      }
      return false
    },
    async login(credentials) {
      this.isLoading = true
      this.error = null
      
      try {
        const { user, token } = await userService.login(credentials)
        
        this.user = user
        this.token = token
        
        // Guardar token en localStorage
        localStorage.setItem('auth_token', token)
        
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Error al iniciar sesión'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    async register(userData) {
      this.isLoading = true
      this.error = null
      
      try {
        const { user, token } = await userService.register(userData)
        
        this.user = user
        this.token = token
        
        // Guardar token en localStorage
        localStorage.setItem('auth_token', token)
        
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Error al registrar usuario'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    async logout() {
      // En una aplicación real, aquí se llamaría al endpoint de logout
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
    },
    
    async fetchCurrentUser() {
      if (!this.token) return
      
      this.isLoading = true
      
      try {
        const user = await userService.getCurrentUser()
        this.user = user
      } catch (error) {
        this.error = error.message
        // Si hay un error de autenticación, limpiar el estado
        if (error.status === 401) {
          this.logout()
        }
      } finally {
        this.isLoading = false
      }
    },
    
    async updateProfile(profileData) {
      this.isLoading = true
      
      try {
        const updatedUser = await userService.updateProfile(profileData)
        this.user = { ...this.user, ...updatedUser }
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    }
  }
})