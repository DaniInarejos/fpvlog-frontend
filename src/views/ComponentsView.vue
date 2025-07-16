<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import componentService from '../services/componentService'
import ComponentList from '../components/component/ComponentList.vue'
import ComponentForm from '../components/component/ComponentForm.vue'
import ComponentInfo from '../components/component/ComponentInfo.vue'
import BaseModal from '../components/base/BaseModal.vue'

const userStore = useUserStore()
const { t } = useI18n()
const components = ref({
  FRAME: [], MOTOR: [], FC: [], ESC: [], CAMERA: [], VTX: [],
  ANTENNA: [], RECEIVER: [], BATTERY: [], PROPS: [], MOUNT: [], OTHER: []
})
const isLoading = ref(false)
const showForm = ref(false)
const selectedType = ref(null)
const showDeleteModal = ref(false)
const componentToDelete = ref(null)
const errors = ref({})

// Variables para el modal de información
const showComponentInfo = ref(false)
const selectedComponent = ref(null)

const fetchComponents = async () => {
  isLoading.value = true
  try {
    const response = await componentService.getUserComponents(userStore.user._id)
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
  selectedType.value = null
  selectedComponent.value = null
}

const handleSaved = async () => {
  showForm.value = false
  selectedType.value = null
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

onMounted(() => {
  fetchComponents()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!showForm">
      <ComponentList
        :components="components"
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