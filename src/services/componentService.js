import api from './api'

const componentService = {
  // ❌ DEPRECATED - Migrado a getUserComponents
  getComponents() {
    console.warn('getComponents() is deprecated. Use getUserComponents(userId) instead.')
    return api.get('/components')
  },

  getComponent(id) {
    return api.get(`/components/${id}`)
  },

  // ✅ NUEVO - Obtener componentes de un usuario específico
  getUserComponents(userId) {
    return api.get(`/users/${userId}/components`)
  },

  // ✅ NUEVO - Obtener estadísticas de componentes de un usuario
  getUserComponentStats(userId) {
    return api.get(`/users/${userId}/components/stats`)
  },

  // ❌ DEPRECATED - Migrado a createUserComponent
  createComponent(componentData) {
    console.warn('createComponent() is deprecated. Use createUserComponent(userId, componentData) instead.')
    return api.post('/components', componentData)
  },

  // ✅ NUEVO - Crear componente para un usuario específico
  createUserComponent(userId, componentData) {
    return api.post(`/users/${userId}/components`, componentData)
  },

  updateComponent(id, componentData) {
    return api.put(`/components/${id}`, componentData)
  },

  deleteComponent(id) {
    return api.delete(`/components/${id}`)
  },

  // ✅ NUEVO - Toggle favorito de un componente
  toggleFavorite(userId, componentId) {
    return api.patch(`/users/${userId}/components/${componentId}/favorite`)
  }
}

export default componentService