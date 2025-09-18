import api from './api'

const equipmentItemService = {
  /**
   * Obtener todos los equipmentItems de un usuario específico
   * @param {string} userId - ID del usuario
   * @returns {Promise} Response con equipmentItems agrupados por categoría
   */
  getUserEquipmentItems(userId) {
    return api.get(`/users/${userId}/equipment-items`)
  },

  /**
   * Obtener un equipmentItem específico por ID
   * @param {string} id - ID del equipmentItem
   * @returns {Promise} Response con el equipmentItem
   */
  getEquipmentItem(id) {
    return api.get(`/equipment-items/${id}`)
  },

  /**
   * Obtener estadísticas de equipmentItems de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise} Response con estadísticas
   */
  getUserEquipmentItemStats(userId) {
    return api.get(`/users/${userId}/equipment-items/stats`)
  },

  /**
   * Crear un nuevo equipmentItem para un usuario específico
   * @param {string} userId - ID del usuario
   * @param {Object} equipmentItemData - Datos del equipmentItem
   * @returns {Promise} Response con el equipmentItem creado
   */
  createUserEquipmentItem(userId, equipmentItemData) {
    return api.post(`/users/${userId}/equipment-items`, equipmentItemData)
  },

  /**
   * Actualizar un equipmentItem existente
   * @param {string} id - ID del equipmentItem
   * @param {Object} equipmentItemData - Datos actualizados
   * @returns {Promise} Response con el equipmentItem actualizado
   */
  updateEquipmentItem(id, equipmentItemData) {
    return api.put(`/equipment-items/${id}`, equipmentItemData)
  },

  /**
   * Eliminar un equipmentItem
   * @param {string} id - ID del equipmentItem
   * @returns {Promise} Response de confirmación
   */
  deleteEquipmentItem(id) {
    return api.delete(`/equipment-items/${id}`)
  },

  /**
   * Toggle favorito de un equipmentItem
   * @param {string} userId - ID del usuario
   * @param {string} equipmentItemId - ID del equipmentItem
   * @returns {Promise} Response con el estado actualizado
   */
  toggleFavorite(userId, equipmentItemId) {
    return api.patch(`/users/${userId}/equipment-items/${equipmentItemId}/favorite`)
  },

  /**
   * Buscar equipmentItems por filtros
   * @param {string} userId - ID del usuario
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise} Response con equipmentItems filtrados
   */
  searchUserEquipmentItems(userId, filters) {
    const params = new URLSearchParams(filters)
    return api.get(`/users/${userId}/equipment-items/search?${params}`)
  }
}

export default equipmentItemService