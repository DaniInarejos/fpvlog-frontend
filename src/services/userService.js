import api from './api'

const userService = {
  /**
   * Iniciar sesión
   * @param {Object} credentials - Credenciales de usuario
   * @returns {Promise<Object>} - Usuario y token
   */
  async login(credentials) {
    return api.post('/auth/login', credentials)
  },
  
  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} - Usuario creado y token
   */
  async register(userData) {
    return api.post('/auth/register', userData)
  },
  
  /**
   * Obtener usuario actual
   * @returns {Promise<Object>} - Datos del usuario
   */
  async getCurrentUser() {
    const user  = await api.get('/users/profile')
    return  user
  },
  
  /**
   * Actualizar perfil de usuario
   * @param {Object} profileData - Datos a actualizar
   * @returns {Promise<Object>} - Usuario actualizado
   */
  async updateProfile(profileData) {
    return api.patch(`/users/${profileData._id}`, profileData)
  },
  
  /**
   * Obtener usuario por ID
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} - Datos del usuario
   */
  async getUserById(userId) {
    return api.get(`/users/${userId}`)
  },
  
  /**
   * Buscar usuarios
   * @param {Object} options - Opciones de búsqueda
   * @param {number} options.page - Número de página
   * @param {number} options.limit - Límite de resultados por página
   * @returns {Promise<Array>} - Lista de usuarios
   */
  async searchUsers(options = { page: 1, limit: 20 }) {
    return api.get('/users', { params: options })
  },

  /**
   * Obtener datos del dashboard de un usuario
   * @param {string} username - Nombre de usuario
   * @returns {Promise<Object>} - Datos del dashboard
   */
  async getDashboard(username) {
    return api.get(`/users/dashboard/${username}`)
  }
}

export default userService