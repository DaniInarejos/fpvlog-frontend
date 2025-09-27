import axios from 'axios'

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
      
      // No mostrar modal automáticamente - dejar que cada vista maneje la autenticación según su contexto
      // Las vistas pueden decidir si mostrar el modal o simplemente mostrar contenido público
    }
    return Promise.reject(error)
  }
)

export default api
export { api }
