import axios from 'axios'
import { useGlobalLoginModal } from '../composables/useGlobalLoginModal'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      
      // Verificar si el mensaje de error es específicamente "No autorizado"
      if (error.response?.data?.error === 'No autorizado') {
        const { openLoginModal } = useGlobalLoginModal()
        openLoginModal()
      }
    }
    return Promise.reject(error)
  }
)

export default api
export { api }
