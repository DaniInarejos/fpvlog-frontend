<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'
import BaseCard from '../components/base/BaseCard.vue'

const router = useRouter()
const drones = ref([])
const isLoading = ref(false)
const showForm = ref(false)
const selectedDrone = ref(null)

const formData = ref({
  brand: '',
  model: '',
  weight: '',
  frameSize: '',
  motorKV: '',
  batteryCell: ''
})

const errors = ref({})

const fetchDrones = async () => {
  isLoading.value = true
  try {
    // Aquí iría la llamada a la API para obtener los drones
    drones.value = [] // Temporal hasta implementar la API
  } catch (error) {
    errors.value.fetch = error.message
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  errors.value = {}
  if (!formData.value.brand) errors.value.brand = 'La marca es requerida'
  if (!formData.value.model) errors.value.model = 'El modelo es requerido'
  if (!formData.value.weight) errors.value.weight = 'El peso es requerido'
  if (!formData.value.frameSize) errors.value.frameSize = 'El tamaño del frame es requerido'
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    // Aquí iría la llamada a la API para guardar el drone
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación temporal
    showForm.value = false
    await fetchDrones()
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isLoading.value = false
  }
}

const deleteDrone = async (droneId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este drone?')) return
  
  try {
    // Aquí iría la llamada a la API para eliminar el drone
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

const resetForm = () => {
  formData.value = {
    brand: '',
    model: '',
    weight: '',
    frameSize: '',
    motorKV: '',
    batteryCell: ''
  }
  selectedDrone.value = null
  errors.value = {}
}

onMounted(fetchDrones)
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
              v-model="formData.brand"
              label="Marca"
              :error="errors.brand"
              required
            />

            <BaseInput
              v-model="formData.model"
              label="Modelo"
              :error="errors.model"
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

            <BaseInput
              v-model="formData.motorKV"
              label="KV del Motor"
              type="number"
            />

            <BaseInput
              v-model="formData.batteryCell"
              label="Celdas de Batería"
              type="number"
            />
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
      </BaseCard>
    </div>

    <div v-else-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div
      v-else-if="drones.length === 0"
      class="text-center py-12 text-gray-500"
    >
      No tienes drones registrados
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <BaseCard
        v-for="drone in drones"
        :key="drone.id"
        class="p-6"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ drone.brand }} {{ drone.model }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              Frame: {{ drone.frameSize }}mm
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              @click="editDrone(drone)"
              class="text-gray-400 hover:text-primary-500"
            >
              <span class="sr-only">Editar</span>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteDrone(drone.id)"
              class="text-gray-400 hover:text-red-500"
            >
              <span class="sr-only">Eliminar</span>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Peso:</span>
            <span class="ml-1 text-gray-900">{{ drone.weight }}g</span>
          </div>
          <div>
            <span class="text-gray-500">Motor:</span>
            <span class="ml-1 text-gray-900">{{ drone.motorKV }}KV</span>
          </div>
          <div>
            <span class="text-gray-500">Batería:</span>
            <span class="ml-1 text-gray-900">{{ drone.batteryCell }}S</span>
          </div>
          <div>
            <span class="text-gray-500">Vuelos:</span>
            <span class="ml-1 text-gray-900">{{ drone.flightCount || 0 }}</span>
          </div>
        </div>

        <div class="mt-4">
          <BaseButton
            variant="secondary"
            class="w-full"
            @click="router.push(`/flights?drone=${drone.id}`)"
          >
            Ver Vuelos
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>