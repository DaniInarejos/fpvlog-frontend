import { defineStore } from 'pinia'
import equipmentItemService from '../services/equipmentItemService'
import { useUserStore } from './user'

export const useEquipmentItemStore = defineStore('equipmentItem', {
  state: () => ({
    equipmentItems: {},
    stats: null,
    isLoading: false,
    error: null
  }),

  getters: {
    allItems: (state) => {
      return Array.isArray(state.equipmentItems) ? state.equipmentItems : []
    },
    
    itemsByType: (state) => (type) => {
      if (!Array.isArray(state.equipmentItems)) return []
      return state.equipmentItems.filter(item => item.type === type)
    },
    
    favoriteItems: (state) => {
      if (!Array.isArray(state.equipmentItems)) return []
      return state.equipmentItems.filter(item => item.favorite)
    },
    
    totalValue: (state) => {
      if (!Array.isArray(state.equipmentItems)) return 0
      return state.equipmentItems.reduce((total, item) => total + (item.price || 0), 0)
    },
    
    totalCount: (state) => {
      return Array.isArray(state.equipmentItems) ? state.equipmentItems.length : 0
    }
  },

  actions: {
    async fetchEquipmentItems() {
      const userStore = useUserStore()
      if (!userStore.user?._id) return

      this.isLoading = true
      this.error = null

      try {
        const response = await equipmentItemService.getUserEquipmentItems(userStore.user._id)
        const items = response.data || []
        
        // Guardar items como array plano (como viene del endpoint)
        this.equipmentItems = items
        
        // Calcular estadísticas desde los datos obtenidos
        this.stats = equipmentItemService.calculateStats(items)
        
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Error al cargar equipos'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async fetchEquipmentItemStats() {
      const userStore = useUserStore()
      if (!userStore.user?._id) return

      try {
        const response = await equipmentItemService.getUserEquipmentItemStats(userStore.user._id)
        this.stats = response.data
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Error al cargar estadísticas'
        return { success: false, error: this.error }
      }
    },

    async createEquipmentItem(itemData) {
      const userStore = useUserStore()
      if (!userStore.user?._id) return

      this.isLoading = true
      this.error = null

      try {
        const response = await equipmentItemService.createEquipmentItem(itemData)
        const newItem = response.data
        
        // Agregar el nuevo item al estado local
        if (!this.equipmentItems[newItem.type]) {
          this.equipmentItems[newItem.type] = []
        }
        this.equipmentItems[newItem.type].push(newItem)
        
        // Recalcular estadísticas
        const allItems = Object.values(this.equipmentItems).flat()
        this.stats = equipmentItemService.calculateStats(allItems)
        
        return { success: true, data: newItem }
      } catch (error) {
        this.error = error.message || 'Error al crear equipo'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async updateEquipmentItem(itemId, itemData) {
      this.isLoading = true
      this.error = null

      try {
        const response = await equipmentItemService.updateEquipmentItem(itemId, itemData)
        const updatedItem = response.data
        
        // Actualizar el item en el estado local
        for (const type in this.equipmentItems) {
          const index = this.equipmentItems[type].findIndex(item => item._id === itemId)
          if (index !== -1) {
            this.equipmentItems[type][index] = updatedItem
            break
          }
        }
        
        // Recalcular estadísticas
        const allItems = Object.values(this.equipmentItems).flat()
        this.stats = equipmentItemService.calculateStats(allItems)
        
        return { success: true, data: updatedItem }
      } catch (error) {
        this.error = error.message || 'Error al actualizar equipo'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async deleteEquipmentItem(itemId) {
      this.isLoading = true
      this.error = null

      try {
        await equipmentItemService.deleteEquipmentItem(itemId)
        
        // Remover el item del estado local
        for (const type in this.equipmentItems) {
          const index = this.equipmentItems[type].findIndex(item => item._id === itemId)
          if (index !== -1) {
            this.equipmentItems[type].splice(index, 1)
            break
          }
        }
        
        // Recalcular estadísticas
        const allItems = Object.values(this.equipmentItems).flat()
        this.stats = equipmentItemService.calculateStats(allItems)
        
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Error al eliminar equipo'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async toggleFavorite(itemId) {
      const userStore = useUserStore()
      if (!userStore.user?._id) return

      try {
        const response = await equipmentItemService.toggleFavorite(userStore.user._id, itemId)
        const updatedItem = response.data
        
        // Actualizar el item en el estado local
        for (const type in this.equipmentItems) {
          const index = this.equipmentItems[type].findIndex(item => item._id === itemId)
          if (index !== -1) {
            this.equipmentItems[type][index] = updatedItem
            break
          }
        }
        
        return { success: true, data: updatedItem }
      } catch (error) {
        this.error = error.message || 'Error al actualizar favorito'
        return { success: false, error: this.error }
      }
    },

    async searchEquipmentItems(filters) {
      const userStore = useUserStore()
      if (!userStore.user?._id) return

      this.isLoading = true
      this.error = null

      try {
        const response = await equipmentItemService.searchUserEquipmentItems(userStore.user._id, filters)
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Error en la búsqueda'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    },

    clearEquipmentItems() {
      this.equipmentItems = {}
      this.stats = null
      this.error = null
    }
  }
})