<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'

import BaseModal from '../components/base/BaseModal.vue'
import droneService from '../services/droneService'
import DroneList from '../components/drone/DroneList.vue'
import DroneForm from '../components/drone/DroneForm.vue'

const userStore = useUserStore()
const { t } = useI18n()
const drones = ref([])
const droneBrands = ref([]) // Nueva variable para almacenar las marcas
const isLoading = ref(false)
const showForm = ref(false)
const selectedDrone = ref(null)
const showDeleteModal = ref(false)
const droneToDelete = ref(null)
const errors = ref({})

const fetchDrones = async () => {
  isLoading.value = true
  try {
    drones.value = await droneService.getUserDrones(userStore.user._id)
  } catch (error) {
    errors.value.fetch = error.message
  } finally {
    isLoading.value = false
  }
}

const openDeleteModal = (drone) => {
  droneToDelete.value = drone
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!droneToDelete.value) return
  
  isLoading.value = true
  try {
    await droneService.deleteDrone(droneToDelete.value._id)
    await fetchDrones()
    showDeleteModal.value = false
    droneToDelete.value = null
  } catch (error) {
    errors.value.delete = error.message
  } finally {
    isLoading.value = false
  }
}

const handleEdit = (drone) => {
  selectedDrone.value = drone
  showForm.value = true
}

const handleClose = () => {
  showForm.value = false
  selectedDrone.value = null
}

const handleSaved = async () => {
  showForm.value = false
  selectedDrone.value = null
  await fetchDrones()
}

// Nueva función para cargar marcas de drones
const fetchDroneBrands = async () => {
  try {
    droneBrands.value = await droneService.getDroneBrands()
  } catch (error) {
    console.error('Error fetching drone brands:', error)
    errors.value.brands = 'Error cargando marcas de drones'
  }
}

onMounted(() => {
  fetchDrones()
  fetchDroneBrands() // Cargar marcas al montar el componente
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!showForm">
      <DroneList
        :drones="drones"
        :drone-brands="droneBrands"
        :is-loading="isLoading"
        :errors="errors"
        @edit="handleEdit"
        @create="showForm = true"
        @delete="openDeleteModal"
      />
    </div>

    <div v-else>
      <DroneForm
        :drone="selectedDrone"
        @close="handleClose"
        @saved="handleSaved"
      />
    </div>

    <!-- Modal para confirmar eliminación -->
    <BaseModal
      :show="showDeleteModal"
      :title="t('drones.delete.title')"
      :show-warning-icon="true"
      :show-delete-button="true"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    >
      <p class="text-sm text-gray-500">
        {{ t('drones.delete.confirmation', { name: droneToDelete?.name }) }}
      </p>
    </BaseModal>
  </div>
</template>