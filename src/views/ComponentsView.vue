<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import { useGlobalLoginModal } from '../composables/useGlobalLoginModal'
import componentService from '../services/componentService'
import ComponentList from '../components/component/ComponentList.vue'
import ComponentForm from '../components/component/ComponentForm.vue'
import ComponentInfo from '../components/component/ComponentInfo.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseButton from '../components/base/BaseButton.vue'
import TabSelector from '../components/base/TabSelector.vue'
import LoginModal from '../components/common/LoginModal.vue'

const userStore = useUserStore()
const { t } = useI18n()
const { showLoginModal, openLoginModal, closeLoginModal, handleLoginSuccess } = useGlobalLoginModal()
const components = ref({
  FRAME: [], 
  MOTOR: [], 
  FC: [], 
  ESC: [], 
  CAMERA: [], 
  VTX: [],
  ANTENNA: [], 
  RECEIVER: [], 
  BATTERY: [], 
  PROPS: [], 
  MOUNT: [], 
  OTHER: []
})
const isLoading = ref(false)
const showForm = ref(false)
const selectedType = ref('ALL') // Valor por defecto
const showDeleteModal = ref(false)
const componentToDelete = ref(null)
const errors = ref({})
const showComponentInfo = ref(false)
const selectedComponent = ref(null)

// Configuración de pestañas
// Añadir 'ALL' al inicio de las pestañas
const tabs = [
  { id: 'ALL', label: t('components.types.all') },
  { id: 'FRAME', label: t('components.types.frame') },
  { id: 'MOTOR', label: t('components.types.motor') },
  { id: 'FC', label: t('components.types.fc') },
  { id: 'ESC', label: t('components.types.esc') },
  { id: 'CAMERA', label: t('components.types.camera') },
  { id: 'VTX', label: t('components.types.vtx') },
  { id: 'ANTENNA', label: t('components.types.antenna') },
  { id: 'RECEIVER', label: t('components.types.receiver') },
  { id: 'BATTERY', label: t('components.types.battery') },
  { id: 'PROPS', label: t('components.types.props') },
  { id: 'MOUNT', label: t('components.types.mount') },
  { id: 'OTHER', label: t('components.types.other') }
]

const fetchComponents = async () => {
  isLoading.value = true
  try {
    const response = await componentService.getUserComponents(userStore.user._id)
    // Asegurarnos de que cada tipo tenga al menos un array vacío
    components.value = {
      FRAME: response.FRAME || [],
      MOTOR: response.MOTOR || [],
      FC: response.FC || [],
      ESC: response.ESC || [],
      CAMERA: response.CAMERA || [],
      VTX: response.VTX || [],
      ANTENNA: response.ANTENNA || [],
      RECEIVER: response.RECEIVER || [],
      BATTERY: response.BATTERY || [],
      PROPS: response.PROPS || [],
      MOUNT: response.MOUNT || [],
      OTHER: response.OTHER || []
    }
  } catch (error) {
    errors.value.fetch = error.message
  } finally {
    isLoading.value = false
  }
}

const openDeleteModal = (component) => {
  componentToDelete.value = component
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!componentToDelete.value) return
  
  isLoading.value = true
  try {
    await componentService.deleteComponent(componentToDelete.value._id)
    await fetchComponents()
    showDeleteModal.value = false
    componentToDelete.value = null
  } catch (error) {
    errors.value.delete = error.message
  } finally {
    isLoading.value = false
  }
}

// Agregar variables para el selector de tipo
const showTypeSelector = ref(false)

// Definir tipos de componentes e iconos
const componentTypes = [
  { _id: 'FRAME', name: t('components.types.frame') },
  { _id: 'MOTOR', name: t('components.types.motor') },
  { _id: 'FC', name: t('components.types.fc') },
  { _id: 'ESC', name: t('components.types.esc') },
  { _id: 'VTX', name: t('components.types.vtx') },
  { _id: 'CAMERA', name: t('components.types.camera') },
  { _id: 'ANTENNA', name: t('components.types.antenna') },
  { _id: 'RECEIVER', name: t('components.types.receiver') },
  { _id: 'BATTERY', name: t('components.types.battery') },
  { _id: 'PROPS', name: t('components.types.props') },
  { _id: 'MOUNT', name: t('components.types.mount') },
  { _id: 'OTHER', name: t('components.types.other') }
]

const componentIcons = {
  FRAME: '🧩', MOTOR: '⚙️', FC: '🧠', ESC: '🔌',
  VTX: '📡', CAMERA: '📷', ANTENNA: '📶', RECEIVER: '📥',
  BATTERY: '🔋', PROPS: '🪶', MOUNT: '🗜️', OTHER: '🧰'
}

// Agregar las funciones que faltan
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

// Agregar función para manejar la selección de tipo
const handleTypeSelect = (typeId) => {
  selectedType.value = typeId
  showForm.value = true
  showTypeSelector.value = false
}

const handleEdit = (component) => {
  if (!userStore.isAuthenticated) {
    openLoginModal()
    return
  }
  selectedComponent.value = component
  selectedType.value = component.type
  showForm.value = true
}

const handleClose = () => {
  showForm.value = false
  selectedType.value = 'ALL'  // Changed from null to 'ALL'
  selectedComponent.value = null
}

const handleSaved = async () => {
  showForm.value = false
  selectedType.value = 'ALL'  // Changed from null to 'ALL'
  selectedComponent.value = null
  await fetchComponents()
}

// Funciones para el modal de información
const handleShowComponentInfo = (component) => {
  selectedComponent.value = component
  showComponentInfo.value = true
}

const handleCloseComponentInfo = () => {
  showComponentInfo.value = false
  selectedComponent.value = null
}

const handleTabChange = (tabId) => {
  selectedType.value = tabId
}

// Función para manejar toggle de favoritos
const handleToggleFavorite = async (component) => {
  if (!userStore.isAuthenticated) {
    openLoginModal()
    return
  }
  
  try {
    await componentService.toggleFavorite(userStore.user._id, component._id)
    // Actualizar el estado local del componente
    const componentType = component.type
    const componentIndex = components.value[componentType].findIndex(c => c._id === component._id)
    if (componentIndex !== -1) {
      components.value[componentType][componentIndex].favorite = !components.value[componentType][componentIndex].favorite
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    errors.value.favorite = error.message
  }
}

onMounted(() => {
  // Cargar componentes independientemente del estado de autenticación
  // Los usuarios no autenticados pueden ver los componentes pero no interactuar
  fetchComponents()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!showForm">
      <!-- Título y botón de añadir -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-foreground">{{ t('components.title') }}</h1>
        <BaseButton
          variant="primary"
          @click="handleCreate(selectedType)"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </template>
          {{ t('components.addComponent') }}
        </BaseButton>
      </div>
  
   
      <!-- Tabs debajo del título -->
      <div class="mb-8">
        <TabSelector
          :tabs="tabs"
          :active-tab="selectedType"
          @tab-change="handleTabChange"
        />
      </div>

      <!-- Lista de componentes -->
      <ComponentList
        :components="selectedType === 'ALL' ? components : { [selectedType]: components[selectedType] }"
        :selected-type="selectedType === 'ALL' ? null : selectedType"
        :is-loading="isLoading"
        :errors="errors"
        @create="handleCreate"
        @edit="handleEdit"
        @delete="openDeleteModal"
        @showInfo="handleShowComponentInfo"
        @toggleFavorite="handleToggleFavorite"
      />
    </div>

    <div v-else>
      <ComponentForm
        :selected-type="selectedType"
        :component="selectedComponent"
        @close="handleClose"
        @saved="handleSaved"
      />
    </div>

    <!-- Modal de selección de tipo -->
    <BaseModal
      :show="showTypeSelector"
      :title="t('components.selectType')"
      @close="showTypeSelector = false"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseButton
          v-for="type in componentTypes"
          :key="type._id"
          variant="secondary"
          class="w-full text-left px-4 py-3"
          @click="handleTypeSelect(type._id)"
        >
          <span class="mr-2">{{ componentIcons[type._id] }}</span>
          {{ type.name }}
        </BaseButton>
      </div>
    </BaseModal>

    <BaseModal
      :show="showDeleteModal"
      :title="t('common.delete')"
      :show-warning-icon="true"
      :show-delete-button="true"
      :show-accept-button="false"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    >
      <p class="text-sm text-gray-500">
        {{ t('components.delete.confirmation', { name: componentToDelete?.name }) }}
      </p>
    </BaseModal>

    <ComponentInfo
      :component="selectedComponent"
      :show="showComponentInfo"
      @close="handleCloseComponentInfo"
    />
    
    <!-- Modal de Login Global -->
    <LoginModal
      :show="showLoginModal"
      @close="closeLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>