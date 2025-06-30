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

// Añadir useI18n al inicio del script
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const validateForm = () => {
  errors.value = {}
  if (!formData.value.name) errors.value.name = t('message.drones.validation.name')
  if (!formData.value.typeId) errors.value.typeId = t('message.drones.validation.type')
  if (!formData.value.brandId) errors.value.brandId = t('message.drones.validation.brand')
  if (!formData.value.model) errors.value.model = t('message.drones.validation.model')
  if (!formData.value.serialNumber) errors.value.serialNumber = t('message.drones.validation.serialNumber')
  if (!formData.value.weight) errors.value.weight = t('message.drones.validation.weight')
  if (!formData.value.frameSize) errors.value.frameSize = t('message.drones.validation.frameSize')
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
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('message.drones.title') }}</h1>
      <BaseButton
        v-if="!showForm"
        @click="showForm = true"
      >
        {{ $t('message.drones.addDrone') }}
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
          {{ selectedDrone ? $t('message.drones.editDrone') : $t('message.drones.newDrone') }}
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
              :label="$t('message.drones.form.name')"
              :error="errors.name"
              required
            />

            <select
              v-model="formData.typeId"
              class="input"
              :class="{ 'border-red-500': errors.typeId }"
              required
            >
              <option value="">{{ $t('message.drones.form.type') }}</option>
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
              <option value="">{{ $t('message.drones.form.brand') }}</option>
              <option v-for="brand in droneBrands" :key="brand._id" :value="brand._id">
                {{ brand.name }}
              </option>
            </select>

            <BaseInput
              v-model="formData.model"
              :label="$t('message.drones.form.model')"
              :error="errors.model"
              required
            />

            <BaseInput
              v-model="formData.serialNumber"
              :label="$t('message.drones.form.serialNumber')"
              :error="errors.serialNumber"
              required
            />

            <BaseInput
              v-model="formData.weight"
              :label="$t('message.drones.form.weight')"
              type="number"
              :error="errors.weight"
              required
            />

            <BaseInput
              v-model="formData.frameSize"
              :label="$t('message.drones.form.frameSize')"
              type="number"
              :error="errors.frameSize"
              required
            />

            <div class="md:col-span-2">
              <BaseInput
                v-model="formData.description"
                :label="$t('message.drones.form.description')"
                type="textarea"
              />
            </div>

            <div class="md:col-span-2">
              <BaseInput
                v-model="formData.notes"
                :label="$t('message.drones.form.notes')"
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
                <span class="ml-2">{{ $t('message.drones.form.visibility.followers') }}</span>
              </label>

              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.visibility.isPublic"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2">{{ $t('message.drones.form.visibility.public') }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <BaseButton
              type="button"
              variant="secondary"
              @click="showForm = false; resetForm()"
            >
              {{ $t('message.common.cancel') }}
            </BaseButton>

            <BaseButton
              type="submit"
              :loading="isLoading"
            >
              {{ selectedDrone ? $t('message.common.save') : $t('message.drones.addDrone') }}
            </BaseButton>
          </div>
        </form>
        
        <div class="col-span-full">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {{ $t('message.drones.form.image') }}
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
      <p class="text-gray-500 mb-4">{{ $t('message.drones.noDrones') }}</p>
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
              <span class="text-gray-400">{{ $t('message.drones.specs.weight') }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="font-medium">{{ drone.frameSize }}mm</span>
              <span class="text-gray-400">{{ $t('message.drones.specs.frame') }}</span>
            </div>
          </div>
<div class="flex items-center gap-1 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {{drone.likesCount || 0 }}
            </div>
          <div class="flex justify-end space-x-2">
            <BaseButton
              size="sm"
              variant="secondary"
              @click="editDrone(drone)"
            >
              {{ $t('message.common.edit') }}
            </BaseButton>
            <BaseButton
              size="sm"
              variant="danger"
              @click="openDeleteModal(drone)"
            >
              {{ $t('message.common.delete') }}
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <BaseModal
      :show="showDeleteModal"
      :title="$t('message.drones.delete.title')"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    >
      <p class="text-sm text-gray-500">
        {{ $t('message.drones.delete.confirmation', { name: droneToDelete?.name }) }}
      </p>
    </BaseModal>
  </div>
</template>