<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import { useGlobalLoginModal } from '../composables/useGlobalLoginModal'
import equipmentItemService from '../services/equipmentItemService'
import EquipmentItemList from '../components/equipmentItem/EquipmentItemList.vue'
import EquipmentItemForm from '../components/equipmentItem/EquipmentItemForm.vue'
import EquipmentItemInfo from '../components/equipmentItem/EquipmentItemInfo.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseButton from '../components/base/BaseButton.vue'
import TabSelector from '../components/base/TabSelector.vue'
import LoginModal from '../components/common/LoginModal.vue'

const userStore = useUserStore()
const { t } = useI18n()
const { showLoginModal, openLoginModal, closeLoginModal, handleLoginSuccess } = useGlobalLoginModal()

const equipmentItems = ref({
  DRONE: [],
  RADIO: [],
  GOGGLES: [],
  BATTERY: [],
  CHARGER: [],
  OTHERS: []
})

const isLoading = ref(false)
const showForm = ref(false)
const selectedType = ref('ALL')
const showDeleteModal = ref(false)
const equipmentItemToDelete = ref(null)
const errors = ref({})
const showEquipmentItemInfo = ref(false)
const selectedEquipmentItem = ref(null)

// Configuración de pestañas
const tabs = [
  { id: 'ALL', label: t('equipmentItems.types.all') },
  { id: 'DRONE', label: t('equipmentItems.types.drone') },
  { id: 'RADIO', label: t('equipmentItems.types.radio') },
  { id: 'GOGGLES', label: t('equipmentItems.types.goggles') },
  { id: 'BATTERY', label: t('equipmentItems.types.battery') },
  { id: 'CHARGER', label: t('equipmentItems.types.charger') },
  { id: 'OTHERS', label: t('equipmentItems.types.others') }
]

const fetchEquipmentItems = async () => {
  isLoading.value = true
  try {
    const response = await equipmentItemService.getUserEquipmentItems(userStore.user._id)
    // Asegurarnos de que cada tipo tenga al menos un array vacío
    equipmentItems.value = {
      DRONE: response.DRONE || [],
      RADIO: response.RADIO || [],
      GOGGLES: response.GOGGLES || [],
      BATTERY: response.BATTERY || [],
      CHARGER: response.CHARGER || [],
      OTHERS: response.OTHERS || []
    }
  } catch (error) {
    errors.value.fetch = error.message
  } finally {
    isLoading.value = false
  }
}

const openDeleteModal = (equipmentItem) => {
  equipmentItemToDelete.value = equipmentItem
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!equipmentItemToDelete.value) return
  
  isLoading.value = true
  try {
    await equipmentItemService.deleteEquipmentItem(equipmentItemToDelete.value._id)
    await fetchEquipmentItems()
    showDeleteModal.value = false
    equipmentItemToDelete.value = null
  } catch (error) {
    errors.value.delete = error.message
  } finally {
    isLoading.value = false
  }
}

// Variables para el selector de tipo
const showTypeSelector = ref(false)

// Definir tipos de equipmentItems e iconos
const equipmentTypes = [
  { _id: 'DRONE', name: t('equipmentItems.types.drone') },
  { _id: 'RADIO', name: t('equipmentItems.types.radio') },
  { _id: 'GOGGLES', name: t('equipmentItems.types.goggles') },
  { _id: 'BATTERY', name: t('equipmentItems.types.battery') },
  { _id: 'CHARGER', name: t('equipmentItems.types.charger') },
  { _id: 'OTHERS', name: t('equipmentItems.types.others') }
]

const typeIcons = {
  DRONE: '🚁',
  RADIO: '📡',
  GOGGLES: '🥽',
  BATTERY: '🔋',
  CHARGER: '🔌',
  OTHERS: '📋'
}

// Funciones de manejo
const handleCreate = (type) => {
  if (!userStore.isAuthenticated) {
    openLoginModal()
    return
  }
  if (type && type !== 'ALL') {
    selectedType.value = type
    showForm.value = true
  } else {
    showTypeSelector.value = true
  }
}

const handleTypeSelect = (typeId) => {
  selectedType.value = typeId
  showForm.value = true
  showTypeSelector.value = false
}

const handleEdit = (equipmentItem) => {
  if (!userStore.isAuthenticated) {
    openLoginModal()
    return
  }
  selectedEquipmentItem.value = equipmentItem
  selectedType.value = equipmentItem.type
  showForm.value = true
}

const handleClose = () => {
  showForm.value = false
  selectedType.value = 'ALL'
  selectedEquipmentItem.value = null
}

const handleSaved = async () => {
  showForm.value = false
  selectedType.value = 'ALL'
  selectedEquipmentItem.value = null
  await fetchEquipmentItems()
}

// Funciones para el modal de información
const handleShowEquipmentItemInfo = (equipmentItem) => {
  selectedEquipmentItem.value = equipmentItem
  showEquipmentItemInfo.value = true
}

const handleCloseEquipmentItemInfo = () => {
  showEquipmentItemInfo.value = false
  selectedEquipmentItem.value = null
}

const handleTabChange = (tabId) => {
  selectedType.value = tabId
}

// Función para manejar toggle de favoritos
const handleToggleFavorite = async (equipmentItemId) => {
  if (!userStore.isAuthenticated) {
    openLoginModal()
    return
  }
  
  try {
    await equipmentItemService.toggleFavorite(userStore.user._id, equipmentItemId)
    // Actualizar el estado local del equipmentItem
    for (const type in equipmentItems.value) {
      const itemIndex = equipmentItems.value[type].findIndex(item => item._id === equipmentItemId)
      if (itemIndex !== -1) {
        equipmentItems.value[type][itemIndex].favorite = !equipmentItems.value[type][itemIndex].favorite
        break
      }
    }
  } catch (error) {
    errors.value.toggleFavorite = error.message
  }
}

onMounted(() => {
  if (userStore.isAuthenticated) {
    fetchEquipmentItems()
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {{ t('equipmentItems.title') }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ t('equipmentItems.description') }}
        </p>
      </div>
      
      <BaseButton
        v-if="userStore.isAuthenticated"
        @click="handleCreate(selectedType)"
        class="flex items-center gap-2"
      >
        <span>➕</span>
        {{ selectedType && selectedType !== 'ALL' 
          ? t('equipmentItems.addItem', { type: t(`equipmentItems.types.${selectedType.toLowerCase()}`) })
          : t('equipmentItems.addItem') }}
      </BaseButton>
      
      <BaseButton
        v-else
        @click="openLoginModal"
        class="flex items-center gap-2"
      >
        <span>🔐</span>
        {{ t('auth.loginToManage') }}
      </BaseButton>
    </div>

    <!-- Tabs de tipos -->
    <div class="mb-6">
      <TabSelector
        :tabs="tabs"
        :active-tab="selectedType"
        @tab-change="handleTabChange"
      />
    </div>

    <!-- Lista de equipmentItems -->
    <EquipmentItemList
      v-if="userStore.isAuthenticated"
      :equipment-items="equipmentItems"
      :selected-type="selectedType"
      :is-loading="isLoading"
      :errors="errors"
      @create="handleCreate"
      @edit="handleEdit"
      @delete="openDeleteModal"
      @show-info="handleShowEquipmentItemInfo"
      @toggle-favorite="handleToggleFavorite"
    />

    <!-- Estado no autenticado -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🔐</div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {{ t('auth.loginRequired') }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ t('equipmentItems.loginDescription') }}
      </p>
      <BaseButton @click="openLoginModal">
        {{ t('auth.login') }}
      </BaseButton>
    </div>

    <!-- Modal de formulario -->
    <BaseModal
      :show="showForm"
      :title="selectedEquipmentItem 
        ? t('equipmentItems.editItem') 
        : t('equipmentItems.addItem', { type: selectedType !== 'ALL' ? t(`equipmentItems.types.${selectedType.toLowerCase()}`) : '' })"
      size="lg"
      @close="handleClose"
    >
      <EquipmentItemForm
        :equipment-item="selectedEquipmentItem"
        :selected-type="selectedType !== 'ALL' ? selectedType : null"
        @saved="handleSaved"
        @close="handleClose"
      />
    </BaseModal>

    <!-- Modal selector de tipo -->
    <BaseModal
      :show="showTypeSelector"
      :title="t('equipmentItems.selectType')"
      @close="showTypeSelector = false"
    >
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="type in equipmentTypes"
          :key="type._id"
          @click="handleTypeSelect(type._id)"
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span class="text-2xl">{{ typeIcons[type._id] }}</span>
          <span class="text-sm font-medium">{{ type.name }}</span>
        </button>
      </div>
    </BaseModal>

    <!-- Modal de confirmación de eliminación -->
    <BaseModal
      :show="showDeleteModal"
      :title="t('equipmentItems.confirmDelete')"
      @close="showDeleteModal = false"
    >
      <div class="text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ t('equipmentItems.deleteWarning', { name: equipmentItemToDelete?.name }) }}
        </p>
        <div class="flex items-center justify-center gap-3">
          <BaseButton
            variant="outline"
            @click="showDeleteModal = false"
          >
            {{ t('common.cancel') }}
          </BaseButton>
          <BaseButton
            @click="confirmDelete"
            :loading="isLoading"
            class="bg-red-600 hover:bg-red-700 text-white"
          >
            {{ t('common.delete') }}
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Modal de información del equipmentItem -->
    <EquipmentItemInfo
      :equipment-item="selectedEquipmentItem"
      :show="showEquipmentItemInfo"
      @close="handleCloseEquipmentItemInfo"
      @edit="handleEdit"
      @delete="openDeleteModal"
    />

    <!-- Modal de login -->
    <LoginModal
      :show="showLoginModal"
      @close="closeLoginModal"
      @success="handleLoginSuccess"
    />
  </div>
</template>