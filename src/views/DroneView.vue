<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseModal from '../components/base/BaseModal.vue'
import droneService from '../services/droneService'

const userStore = useUserStore()
const drones = ref([])
const droneTypes = ref([])
const droneBrands = ref([])
const isLoading = ref(false)
const showForm = ref(false)
const selectedDrone = ref(null)

const formData = ref({
  name: '',
  typeId: '',
  brandId: '',
  model: '',
  serialNumber: '',
  weight: '',
  frameSize: '',
  notes: '',
  description: '',
  visibility: {
    isVisibleToFollowers: true,
    isPublic: false
  }
})

const errors = ref({})

const fetchDroneTypes = async () => {
  try {
    droneTypes.value = await droneService.getDroneTypes()
  } catch (error) {
    errors.value.types = 'Error cargando tipos de drones'
  }
}

const fetchDroneBrands = async () => {
  try {
    droneBrands.value = await droneService.getDroneBrands()
  } catch (error) {
    errors.value.brands = 'Error cargando marcas de drones'
  }
}

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

const validateForm = () => {
  errors.value = {}
  if (!formData.value.name) errors.value.name = 'El nombre es requerido'
  if (!formData.value.typeId) errors.value.typeId = 'El tipo de drone es requerido'
  if (!formData.value.brandId) errors.value.brandId = 'La marca es requerida'
  if (!formData.value.model) errors.value.model = 'El modelo es requerido'
  if (!formData.value.serialNumber) errors.value.serialNumber = 'El número de serie es requerido'
  if (!formData.value.weight) errors.value.weight = 'El peso es requerido'
  if (!formData.value.frameSize) errors.value.frameSize = 'El tamaño del frame es requerido'
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    let droneId
    if (selectedDrone.value) {
      await droneService.updateDrone(selectedDrone.value._id, formData.value)
      droneId = selectedDrone.value._id
    } else {
      const newDrone = await droneService.createDrone(formData.value)
      droneId = newDrone._id
    }
    
    // Si hay una imagen seleccionada, la subimos
    if (imageFile.value) {
      const imageFormData = new FormData()
      imageFormData.append('image', imageFile.value)
      await droneService.uploadDroneImage(droneId, imageFormData)
    }
    
    showForm.value = false
    resetForm()
    await fetchDrones()
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isLoading.value = false
  }
}

const imageFile = ref(null)

const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    typeId: '',
    brandId: '',
    model: '',
    serialNumber: '',
    weight: '',
    frameSize: '',
    notes: '',
    description: '',
    visibility: {
      isVisibleToFollowers: true,
      isPublic: false
    }
  }
  imageFile.value = null
  selectedDrone.value = null
  errors.value = {}
}

const deleteDrone = async (droneId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este drone?')) return
  
  try {
    await droneService.deleteDrone(droneId)
    await fetchDrones()
  } catch (error) {
    errors.value.delete = error.message
  }
}

const editDrone = (drone) => {
  selectedDrone.value = drone
  formData.value = { ...drone }
  showForm.value = true
}

onMounted(() => {
  fetchDrones()
  fetchDroneTypes()
  fetchDroneBrands()
})

const showDeleteModal = ref(false)
const droneToDelete = ref(null)

const confirmDelete = async () => {
  if (!droneToDelete.value) return
  
  try {
    await droneService.deleteDrone(droneToDelete.value._id)
    await fetchDrones()
    showDeleteModal.value = false
    droneToDelete.value = null
  } catch (error) {
    errors.value.delete = error.message
  }
}

const openDeleteModal = (drone) => {
  droneToDelete.value = drone
  showDeleteModal.value = true
}
// En la sección de script setup, añadir:
const handleDroneImageUpload = async (event, droneId) => {
  try {
    const file = event.target.files[0]
    if (!file) return

    isLoading.value = true
    error.value = ''
    
    const formData = new FormData()
    formData.append('image', file)
    
    await droneService.uploadDroneImage(droneId, formData)
    await fetchDrones()
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } catch (err) {
    errors.value.submit = 'Error subiendo la imagen del drone'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mis Drones</h1>
      <BaseButton
        v-if="!showForm"
        @click="showForm = true"
      >
        Añadir Drone
      </BaseButton>
    </div>

    <BaseAlert
      v-if="errors.fetch"
      type="error"
      :message="errors.fetch"
    />

    <BaseAlert
      v-if="errors.delete"
      type="error"
      :message="errors.delete"
    />

    <div v-if="showForm" class="mb-8">
      <BaseCard class="p-6">
        <h2 class="text-xl font-semibold mb-4">
          {{ selectedDrone ? 'Editar Drone' : 'Nuevo Drone' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <BaseAlert
            v-if="errors.submit"
            type="error"
            :message="errors.submit"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="formData.name"
              label="Nombre"
              :error="errors.name"
              required
            />

            <select
              v-model="formData.typeId"
              class="input"
              :class="{ 'border-red-500': errors.typeId }"
              required
            >
              <option value="">Selecciona un tipo</option>
              <option v-for="type in droneTypes" :key="type._id" :value="type._id">
                {{ type.name }}
              </option>
            </select>

            <select
              v-model="formData.brandId"
              class="input"
              :class="{ 'border-red-500': errors.brandId }"
              required
            >
              <option value="">Selecciona una marca</option>
              <option v-for="brand in droneBrands" :key="brand._id" :value="brand._id">
                {{ brand.name }}
              </option>
            </select>

            <BaseInput
              v-model="formData.model"
              label="Modelo"
              :error="errors.model"
              required
            />

            <BaseInput
              v-model="formData.serialNumber"
              label="Número de Serie"
              :error="errors.serialNumber"
              required
            />

            <BaseInput
              v-model="formData.weight"
              label="Peso (g)"
              type="number"
              :error="errors.weight"
              required
            />

            <BaseInput
              v-model="formData.frameSize"
              label="Tamaño del Frame (mm)"
              type="number"
              :error="errors.frameSize"
              required
            />

            <div class="md:col-span-2">
              <BaseInput
                v-model="formData.description"
                label="Descripción"
                type="textarea"
              />
            </div>

            <div class="md:col-span-2">
              <BaseInput
                v-model="formData.notes"
                label="Notas"
                type="textarea"
              />
            </div>

            <div class="md:col-span-2 space-y-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.visibility.isVisibleToFollowers"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2">Visible para seguidores</span>
              </label>

              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.visibility.isPublic"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2">Público</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <BaseButton
              type="button"
              variant="secondary"
              @click="showForm = false; resetForm()"
            >
              Cancelar
            </BaseButton>

            <BaseButton
              type="submit"
              :loading="isLoading"
            >
              {{ selectedDrone ? 'Guardar Cambios' : 'Crear Drone' }}
            </BaseButton>
          </div>
        </form>
        
        <div class="col-span-full">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Imagen del Drone
          </label>
          <input
            type="file"
            accept="image/*"
            @change="handleImageSelect"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 dark:file:bg-sky-900 dark:file:text-sky-300 dark:text-gray-300"
          />
        </div>
      </BaseCard>
    </div>

    <div v-else-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="drones.length === 0" class="text-center py-12">
      <p class="text-gray-500 mb-4">Aún no tienes ningún drone registrado</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard v-for="drone in drones" :key="drone._id" class="overflow-hidden">
        <div class="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            :src="drone.image || '/images/placeholder.png'"
            :alt="drone.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Información del drone -->
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ drone.name }}</h3>
              <p class="text-sm text-gray-600">{{ droneBrands.find(b => b._id === drone.brandId)?.name }} {{ drone.model }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div class="flex items-center gap-1">
              <span class="font-medium">{{ drone.weight }}g</span>
              <span class="text-gray-400">peso</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="font-medium">{{ drone.frameSize }}mm</span>
              <span class="text-gray-400">frame</span>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end space-x-2">
            <BaseButton
              size="sm"
              variant="secondary"
              @click="editDrone(drone)"
            >
              Editar
            </BaseButton>
            <!-- Reemplazar el botón de eliminar existente con: -->
            <BaseButton
              size="sm"
              variant="danger"
              @click="openDeleteModal(drone)"
            >
              Eliminar
            </BaseButton>
            
            <!-- Añadir el modal al final del template -->
            <BaseModal
              :show="showDeleteModal"
              title="Eliminar Drone"
              @close="showDeleteModal = false"
              @confirm="confirmDelete"
            >
              <p class="text-sm text-gray-500">
                ¿Estás seguro de que quieres eliminar el drone "{{ droneToDelete?.name }}"? Esta acción no se puede deshacer.
              </p>
            </BaseModal>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>