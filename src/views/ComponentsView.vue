<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import componentService from '../services/componentService'
import ComponentList from '../components/component/ComponentList.vue'
import ComponentForm from '../components/component/ComponentForm.vue'
import ComponentInfo from '../components/component/ComponentInfo.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseButton from '../components/base/BaseButton.vue'
import TabSelector from '../components/base/TabSelector.vue'

const userStore = useUserStore()
const { t } = useI18n()
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

const handleCreate = (type) => {
  selectedType.value = type
  showForm.value = true
}

const handleEdit = (component) => {
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

onMounted(() => {
  fetchComponents()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!showForm">
      <!-- Título y botón de añadir -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ t('components.title') }}</h1>
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
  </div>
</template>