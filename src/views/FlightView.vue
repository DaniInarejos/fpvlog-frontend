<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseModal from '../components/base/BaseModal.vue'
import flightService from '../services/flightService'
import droneService from '../services/droneService' // Añadido para obtener los drones

const userStore = useUserStore()
const flights = ref([])
const drones = ref([]) // Añadido para almacenar la lista de drones
const isLoading = ref(false)
const showForm = ref(false)
const selectedFlight = ref(null)
const showDeleteModal = ref(false)
const flightToDelete = ref(null)

const formData = ref({
  title: '',
  date: '',
  location: '',
  duration: '',
  batteryUsed: '',
  weather: '',
  notes: '',
  droneId: '', // Campo para el drone seleccionado
  visibility: {
    isVisibleToFollowers: true,
    isPublic: false
  }
})

const errors = ref({})

const fetchDrones = async () => {
  try {
    drones.value = await droneService.getUserDrones(userStore.user._id)
  } catch (error) {
    errors.value.drones = 'Error cargando drones'
  }
}

const fetchFlights = async () => {
  isLoading.value = true
  try {
    flights.value = await flightService.getUserFlights(userStore.user._id)
  } catch (error) {
    errors.value.fetch = error.message
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  errors.value = {}
  if (!formData.value.title) errors.value.title = 'El título es requerido'
  if (!formData.value.date) errors.value.date = 'La fecha es requerida'
  if (!formData.value.location) errors.value.location = 'La ubicación es requerida'
  if (!formData.value.duration) errors.value.duration = 'La duración es requerida'
  if (!formData.value.batteryUsed) errors.value.batteryUsed = 'El número de baterías es requerido'
  if (!formData.value.droneId) errors.value.droneId = 'El drone es requerido'
  return Object.keys(errors.value).length === 0
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDuration = (duration) => {
  if (!duration) return ''
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const resetForm = () => {
  formData.value = {
    title: '',
    date: '',
    location: '',
    duration: '',
    batteryUsed: '',
    weather: '',
    notes: '',
    droneId: '',
    visibility: {
      isVisibleToFollowers: true,
      isPublic: false
    }
  }
  selectedFlight.value = null
  errors.value = {}
}

const editFlight = (flight) => {
  selectedFlight.value = flight
  formData.value = { 
    ...flight,
    date: flight.date.split('T')[0]
  }
  showForm.value = true
}

const openDeleteModal = (flight) => {
  flightToDelete.value = flight
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!flightToDelete.value) return
  
  try {
    await flightService.deleteFlight(flightToDelete.value._id)
    await fetchFlights()
    showDeleteModal.value = false
    flightToDelete.value = null
  } catch (error) {
    errors.value.delete = error.message
  }
}

onMounted(() => {
  fetchFlights()
  fetchDrones()
})

const selectedDroneInfo = ref(null)
const showDroneModal = ref(false)

const showDroneDetails = async (droneId) => {
  try {
    const drone = await droneService.getDrone(droneId)
    selectedDroneInfo.value = drone
    showDroneModal.value = true
  } catch (error) {
    errors.value.droneInfo = 'Error al cargar la información del drone'
  }
}

const handleFlightImageUpload = async (event) => {
  try {
    const file = event.target.files[0]
    if (!file) return

    isLoading.value = true
    errors.value = {}
    
    const formData = new FormData()
    formData.append('image', file)
    
    if (selectedFlight.value) {
      await flightService.uploadFlightImage(selectedFlight.value._id, formData)
      await fetchFlights()
    } else {
      // Si es un nuevo vuelo, guardamos el archivo para subirlo después de crear el vuelo
      formData.value.imageFile = file
    }
  } catch (error) {
    errors.value.image = 'Error al subir la imagen del vuelo'
  } finally {
    isLoading.value = false
  }
}

// Modificar handleSubmit para incluir la subida de imagen
const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    let response
    if (selectedFlight.value) {
      response = await flightService.updateFlight(selectedFlight.value._id, formData.value)
    } else {
      response = await flightService.createFlight(formData.value)
      // Si hay una imagen seleccionada, la subimos después de crear el vuelo
      if (formData.value.imageFile) {
        const imageFormData = new FormData()
        imageFormData.append('image', formData.value.imageFile)
        await flightService.uploadFlightImage(response.data._id, imageFormData)
      }
    }
    
    showForm.value = false
    resetForm()
    await fetchFlights()
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mis Vuelos</h1>
      <BaseButton
        v-if="!showForm"
        @click="showForm = true"
      >
        Añadir Vuelo
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
          {{ selectedFlight ? 'Editar Vuelo' : 'Nuevo Vuelo' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <BaseAlert
            v-if="errors.submit"
            type="error"
            :message="errors.submit"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="formData.title"
              label="Título"
              :error="errors.title"
              required
            />

            <BaseInput
              v-model="formData.date"
              label="Fecha"
              type="date"
              :error="errors.date"
              required
            />

            <select
              v-model="formData.droneId"
              class="input"
              :class="{ 'border-red-500': errors.droneId }"
              required
            >
              <option value="">Selecciona un drone</option>
              <option v-for="drone in drones" :key="drone._id" :value="drone._id">
                {{ drone.name }}
              </option>
            </select>

            <BaseInput
              v-model="formData.location"
              label="Ubicación"
              :error="errors.location"
              required
            />

            <BaseInput
              v-model="formData.duration"
              label="Duración (segundos)"
              type="number"
              :error="errors.duration"
              required
            />

            <BaseInput
              v-model="formData.batteryUsed"
              label="Baterías Usadas"
              type="number"
              :error="errors.batteryUsed"
              required
            />

            <BaseInput
              v-model="formData.weather"
              label="Clima"
            />

            <div class="md:col-span-2">
              <BaseInput
                v-model="formData.notes"
                label="Notas"
                type="textarea"
              />
            </div>

            <!-- Añadir campo de imagen aquí -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Imagen del Vuelo
              </label>
              <input
                type="file"
                accept="image/*"
                @change="handleFlightImageUpload"
                class="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p v-if="errors.image" class="mt-1 text-sm text-red-600">
                {{ errors.image }}
              </p>
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
              {{ selectedFlight ? 'Guardar Cambios' : 'Crear Vuelo' }}
            </BaseButton>
          </div>
        </form>
      </BaseCard>
    </div>

    <div v-else-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="flights.length === 0" class="text-center py-12">
      <p class="text-gray-500 mb-4">Aún no tienes ningún vuelo registrado</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard v-for="flight in flights" :key="flight._id" class="overflow-hidden">
        <div class="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            :src="flight.image || '/images/placeholder.png'"
            :alt="flight.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ flight.title }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(flight.date) }}</p>
            </div>
          </div>

          <div class="text-sm text-gray-600 mb-4">
            <p class="mb-1 flex items-center justify-between">
              <span>
                <span class="font-medium">Drone:</span>
                {{ drones.find(d => d._id === flight.droneId)?.name || 'No especificado' }}
              </span>
              <button
                v-if="flight.droneId && drones.find(d => d._id === flight.droneId)"
                @click="showDroneDetails(flight.droneId)"
                class="text-primary-600 hover:text-primary-700 transition-colors"
                title="Ver detalles del drone"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </p>
            <p class="mb-1">
              <span class="font-medium">Ubicación:</span>
              {{ flight.location }}
            </p>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <span class="font-medium">{{ formatDuration(flight.duration) }}</span>
                <span class="text-gray-400">duración</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="font-medium">{{ flight.batteryUsed }}</span>
                <span class="text-gray-400">baterías</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-2">
            <BaseButton
              size="sm"
              variant="secondary"
              @click="editFlight(flight)"
            >
              Editar
            </BaseButton>
            <BaseButton
              size="sm"
              variant="danger"
              @click="openDeleteModal(flight)"
            >
              Eliminar
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <BaseModal
      :show="showDeleteModal"
      title="Eliminar Vuelo"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    >
      <p class="text-sm text-gray-500">
        ¿Estás seguro de que quieres eliminar el vuelo "{{ flightToDelete?.title }}"? Esta acción no se puede deshacer.
      </p>
    </BaseModal>
  </div>

  <!-- Modal para mostrar detalles del drone -->
  <BaseModal
    :show="showDroneModal"
    title="Detalles del Drone"
    @close="showDroneModal = false"
    :showAcceptButton="false"
    :showCancelButton="true"
  >
    <div v-if="selectedDroneInfo" class="space-y-4">
      <div class="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
        <img
          :src="selectedDroneInfo.image || '/src/assets/images/placeholder.png'"
          :alt="selectedDroneInfo.name"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm font-medium text-gray-500">Nombre</p>
          <p class="text-base">{{ selectedDroneInfo.name }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Modelo</p>
          <p class="text-base">{{ selectedDroneInfo.model }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Peso</p>
          <p class="text-base">{{ selectedDroneInfo.weight }}g</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Tamaño del Frame</p>
          <p class="text-base">{{ selectedDroneInfo.frameSize }}mm</p>
        </div>
      </div>

      <div v-if="selectedDroneInfo.description" class="mt-4">
        <p class="text-sm font-medium text-gray-500">Descripción</p>
        <p class="text-base">{{ selectedDroneInfo.description }}</p>
      </div>

      <div v-if="selectedDroneInfo.notes" class="mt-4">
        <p class="text-sm font-medium text-gray-500">Notas</p>
        <p class="text-base">{{ selectedDroneInfo.notes }}</p>
      </div>
    </div>
  </BaseModal>
</template>
