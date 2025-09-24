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
   * Crear un nuevo equipmentItem
   * @param {Object} equipmentItemData - Datos del equipmentItem
   * @returns {Promise} Response con el equipmentItem creado
   */
  createEquipmentItem(equipmentItemData) {
    return api.post('/equipment-items', equipmentItemData)
  },

  /**
   * Actualizar un equipmentItem existente
   * @param {string} id - ID del equipmentItem
   * @param {Object} equipmentItemData - Datos actualizados
   * @returns {Promise} Response con el equipmentItem actualizado
   */
  updateEquipmentItem(id, equipmentItemData) {
    return api.patch(`/equipment-items/${id}`, equipmentItemData)
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
   * Buscar equipmentItems de un usuario con filtros
   * @param {string} userId - ID del usuario
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise} Response con equipmentItems filtrados
   */
  searchUserEquipmentItems(userId, filters) {
    return api.get(`/users/${userId}/equipment-items/search`, { params: filters })
  },

  /**
   * Calcular estadísticas de equipamiento desde los datos
   * @param {Array} equipmentItems - Array de equipmentItems
   * @returns {Object} Estadísticas calculadas
   */
  calculateStats(equipmentItems) {
    if (!Array.isArray(equipmentItems)) {
      return { 
        total: 0, 
        byType: {},
        byStatus: {
          active: 0,
          archived: 0,
          sold: 0,
          lost: 0
        }
      }
    }

    const stats = {
      total: equipmentItems.length,
      byType: {},
      byStatus: {
        active: 0,
        archived: 0,
        sold: 0,
        lost: 0
      }
    }

    // Contar por tipo y estado
    equipmentItems.forEach(item => {
      const type = item.type || 'UNKNOWN'
      const status = item.status || 'active'
      
      stats.byType[type] = (stats.byType[type] || 0) + 1
      
      if (stats.byStatus.hasOwnProperty(status)) {
        stats.byStatus[status]++
      }
    })

    return stats
  }
}

export default equipmentItemService