<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../stores/user'
import { useEquipmentItemStore } from '../stores/equipmentItem'
import { useRouter } from 'vue-router'
import EquipmentItemForm from '../components/equipmentItem/EquipmentItemForm.vue'
import EquipmentItemInfo from '../components/equipmentItem/EquipmentItemInfo.vue'
import EquipmentTypeFilter from '../components/equipmentItem/EquipmentTypeFilter.vue'
import EquipmentHeader from '../components/equipmentItem/EquipmentHeader.vue'
import EquipmentCard from '../components/equipmentItem/EquipmentCard.vue'
// import EquipmentStats from '../components/equipmentItem/EquipmentStats.vue'
import BaseModal from '../components/base/BaseModal.vue'
import { EQUIPMENT_TYPES } from '../types/equipmentItem'

const { t } = useI18n()
const userStore = useUserStore()
const equipmentItemStore = useEquipmentItemStore()
const router = useRouter()

const showForm = ref(false)
const editingItem = ref(null)
const selectedType = ref('ALL')
const showInfoModal = ref(false)
const selectedItem = ref(null)

const isAuthenticated = computed(() => userStore.isAuthenticated)
const allItems = computed(() => equipmentItemStore.allItems)
const equipmentItems = computed(() => {
    return equipmentItemStore.equipmentItems
  })

const typeOptions = computed(() => [
  { value: 'ALL', label: t('equipmentItems.types.all') },
  ...Object.keys(EQUIPMENT_TYPES).map(type => ({
    value: type,
    label: t(`equipmentItems.types.${type.toLowerCase()}`)
  }))
])

// const equipmentStats = computed(() => {
//   return equipmentItemStore.stats || { total: 0, byType: {}, byStatus: { active: 0, archived: 0, sold: 0, lost: 0 } }
// })

const filteredAndSortedItems = computed(() => {
  if (selectedType.value === 'ALL') {
    return allItems.value
  }
  
  // Filtrar por tipo específico usando el getter itemsByType del store
  return equipmentItemStore.itemsByType(selectedType.value)
})

const handleLogin = () => {
  router.push('/login')
}

const handleCreateItem = (type = null) => {
  if (!isAuthenticated.value) {
    handleLogin()
    return
  }
  
  editingItem.value = null
  if (type && type !== 'ALL') {
    selectedType.value = type
  }
  showForm.value = true
}

const handleEditItem = (item) => {
  editingItem.value = item
  showForm.value = true
}

const handleDeleteItem = async (item) => {
  if (confirm(t('equipmentItems.confirmDelete'))) {
    try {
      await equipmentItemStore.deleteEquipmentItem(item._id)
      // Refrescar el listado después de eliminar
      await equipmentItemStore.fetchEquipmentItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }
}

const handleToggleFavorite = async (item) => {
  try {
    await equipmentItemStore.toggleFavorite(item._id)
    // Refrescar el listado después de cambiar favorito
    await equipmentItemStore.fetchEquipmentItems()
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

const handleViewItem = (item) => {
  selectedItem.value = item
  showInfoModal.value = true
}

const handleCloseInfoModal = () => {
  showInfoModal.value = false
  selectedItem.value = null
}

const handleEditFromModal = (item) => {
  showInfoModal.value = false
  selectedItem.value = null
  handleEditItem(item)
}

const handleDeleteFromModal = (item) => {
  showInfoModal.value = false
  selectedItem.value = null
  handleDeleteItem(item)
}

const handleFormSubmit = async (formData) => {
  try {
    if (editingItem.value) {
      await equipmentItemStore.updateEquipmentItem(editingItem.value._id, formData)
    } else {
      await equipmentItemStore.createEquipmentItem(formData)
    }
    
    // Refrescar el listado después de la operación
    await equipmentItemStore.fetchEquipmentItems()
    
    showForm.value = false
    editingItem.value = null
  } catch (error) {
    console.error('Error saving item:', error)
  }
}

const handleFormCancel = () => {
  showForm.value = false
  editingItem.value = null
}

const handleTypeChange = (type) => {
  selectedType.value = type
}

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await equipmentItemStore.fetchEquipmentItems()
      // await equipmentItemStore.fetchEquipmentItemStats() // Eliminado
    } catch (error) {
      console.error('Error fetching equipment items:', error)
    }
  }
})
</script>
<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <EquipmentHeader
      :is-authenticated="isAuthenticated"
      :selected-type="selectedType"
      :equipment-items="equipmentItems"
      @create="handleCreateItem"
      @login="handleLogin"
    />

    <!-- Filtros y búsqueda -->
    <div class="mb-6 space-y-4 mt-8">
      <!-- Estadísticas eliminadas -->
      <!-- <EquipmentStats 
        v-if="isAuthenticated && allItems.length > 0"
        :stats="equipmentStats"
      /> -->
      
      <!-- Filtro de tipos -->
      <EquipmentTypeFilter
        :selected-type="selectedType"
        @type-change="handleTypeChange"
      />
    </div>

    <!-- Lista de equipos -->
    <div v-if="isAuthenticated" class="space-y-4">
      <!-- Contador de filtros -->
      <div class="text-sm text-gray-600 dark:text-gray-400">
        {{ t('equipmentItems.showing', { 
          count: filteredAndSortedItems.length,
          total: allItems.length 
        }) }}
      </div>

      <!-- Grid de equipos -->
      <div v-if="filteredAndSortedItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EquipmentCard
          v-for="item in filteredAndSortedItems"
          :key="item._id"
          :item="item"
          :is-authenticated="isAuthenticated"
          @edit="handleEditItem"
          @delete="handleDeleteItem"
          @toggle-favorite="handleToggleFavorite"
          @view="handleViewItem"
        />
      </div>

      <!-- Estado vacío -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {{ t('equipmentItems.noItems') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ t('equipmentItems.noItemsDescription') }}
        </p>
        <button
          @click="handleCreateItem()"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span class="mr-2">➕</span>
          {{ t('equipmentItems.addFirstItem') }}
        </button>
      </div>
    </div>

    <!-- Estado no autenticado -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🔐</div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {{ t('auth.loginRequired') }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ t('equipmentItems.loginDescription') }}
      </p>
      <button
        @click="handleLogin"
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <span class="mr-2">🔐</span>
        {{ t('auth.login') }}
      </button>
    </div>

    <!-- Modal para formulario -->
    <Teleport to="body">
      <BaseModal
        v-if="showForm"
        :show="showForm"
        :title="editingItem ? t('equipmentItems.editItem') : t('equipmentItems.addItem')"
        :show-accept-button="false"
        :show-cancel-button="false"
        :show-close-button="true"
        :require-double-click="true"
        size="full"
        @close="handleFormCancel"
      >
        <EquipmentItemForm
          :equipment-item="editingItem"
          :selected-type="selectedType !== 'ALL' ? selectedType : null"
          @close="handleFormCancel"
          @saved="handleFormSubmit"
        />
      </BaseModal>

      <!-- Modal para información del equipamiento -->
      <EquipmentItemInfo
        :show="showInfoModal"
        :equipment-item="selectedItem"
        @close="handleCloseInfoModal"
      />
    </Teleport>
  </div>
</template>
