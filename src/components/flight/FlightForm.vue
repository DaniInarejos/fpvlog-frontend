<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import FlightFormStep1 from './FlightFormStep1.vue'
import FlightFormStep2 from './FlightFormStep2.vue'
import FlightFormStep3 from './FlightFormStep3.vue'
import flightService from '../../services/flightService'

const { t } = useI18n()

const props = defineProps({
  flight: {
    type: Object,
    default: null
  },
  drones: {
    type: Array,
    required: true
  },
  spots: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'close', 'saved'])

// Estado del formulario multi-paso
const currentStep = ref(1)
const totalSteps = 3
const errors = ref({})
const isSubmitting = ref(false)

const formData = ref({
  title: '',
  description: '',
  videoUrl: '',
  posterUrl: '',
  tags: [],
  disciplines: [],
  recordedAt: '',
  spotId: '',
  visibility: 'PUBLIC',
  featured: false,
  equipmentItems: []
})

// Validaciones por paso
const validateStep1 = () => {
  const stepErrors = {}
  
  if (!formData.value.title?.trim()) {
    stepErrors.title = t('flights.form.errors.titleRequired')
  }
  
  if (!formData.value.videoUrl?.trim()) {
    stepErrors.videoUrl = t('flights.form.errors.videoUrlRequired')
  } else if (!isValidUrl(formData.value.videoUrl)) {
    stepErrors.videoUrl = t('flights.form.errors.invalidVideoUrl')
  }
  
  errors.value = stepErrors
  return Object.keys(stepErrors).length === 0
}

const validateStep2 = () => {
  const stepErrors = {}
  
  // Validaciones opcionales para el paso 2
  if (formData.value.description && formData.value.description.length > 1000) {
    stepErrors.description = t('flights.form.errors.descriptionTooLong')
  }
  
  errors.value = stepErrors
  return Object.keys(stepErrors).length === 0
}

const validateStep3 = () => {
  const stepErrors = {}
  
  // Validaciones opcionales para el paso 3
  // El spot y equipos son opcionales
  
  errors.value = stepErrors
  return Object.keys(stepErrors).length === 0
}

// Navegación entre pasos
const nextStep = () => {
  let isValid = false
  
  switch (currentStep.value) {
    case 1:
      isValid = validateStep1()
      break
    case 2:
      isValid = validateStep2()
      break
    case 3:
      isValid = validateStep3()
      break
  }
  
  if (isValid && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Utilidades
const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Opciones para los selects
const disciplineOptions = [
  { _id: 'FREESTYLE', name: t('flights.disciplines.freestyle') },
  { _id: 'RACING', name: t('flights.disciplines.racing') },
  { _id: 'CINEMATIC', name: t('flights.disciplines.cinematic') },
  { _id: 'ACRO', name: t('flights.disciplines.acro') },
  { _id: 'LONG_RANGE', name: t('flights.disciplines.longRange') }
]

const visibilityOptions = [
  { _id: 'PUBLIC', name: t('flights.visibility.public') },
  { _id: 'PRIVATE', name: t('flights.visibility.private') },
  { _id: 'UNLISTED', name: t('flights.visibility.unlisted') }
]

// Inicializar datos si se está editando
if (props.flight) {
  formData.value = {
    title: props.flight.title || '',
    description: props.flight.description || '',
    videoUrl: props.flight.videoUrl || '',
    posterUrl: props.flight.posterUrl || '',
    tags: props.flight.tags || [],
    disciplines: props.flight.disciplines || [],
    recordedAt: props.flight.recordedAt || '',
    spotId: props.flight.spotId || '',
    visibility: props.flight.visibility || 'PUBLIC',
    featured: props.flight.featured || false,
    equipmentItems: props.flight.equipmentItems || []
  }
}
// Manejo del envío del formulario
const handleSubmit = async () => {
  // Validar el paso actual antes de enviar
  let isValid = false
  switch (currentStep.value) {
    case 1:
      isValid = validateStep1()
      break
    case 2:
      isValid = validateStep2()
      break
    case 3:
      isValid = validateStep3()
      break
  }
  
  if (!isValid) return
  
  isSubmitting.value = true
  try {
    // Preparar los datos para envío, excluyendo spotId si está vacío
    const dataToSend = { ...formData.value }
    
    // Si spotId está vacío o es null, no lo incluimos en el payload
    if (!dataToSend.spotId || dataToSend.spotId.trim() === '') {
      delete dataToSend.spotId
    }
    
    if (props.flight) {
      await flightService.updateFlight(props.flight._id, dataToSend)
    } else {
      await flightService.createFlight(dataToSend)
    }
    
    emit('saved')
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6 glass-scrollbar">
    <!-- Progress Indicator -->
    <div class="flex justify-center items-center space-x-4 mb-8">
      <div 
        v-for="step in 3" 
        :key="step"
        class="flex items-center"
      >
        <div 
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
            currentStep >= step 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          ]"
        >
          {{ step }}
        </div>
        <div 
          v-if="step < 3"
          :class="[
            'w-16 h-0.5 mx-2 transition-all duration-300',
            currentStep > step 
              ? 'bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-700'
          ]"
        ></div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <BaseAlert
        v-if="errors.submit"
        type="error"
        :message="errors.submit"
        class="mb-6"
      />

      <!-- Step Content -->
      <div class="min-h-[500px]">
        <FlightFormStep1
          v-if="currentStep === 1"
          v-model="formData"
          :errors="errors"
        />
        
        <FlightFormStep2
          v-if="currentStep === 2"
          v-model="formData"
          :errors="errors"
          :discipline-options="disciplineOptions"
          :visibility-options="visibilityOptions"
        />
        
        <FlightFormStep3
          v-if="currentStep === 3"
          v-model="formData"
          :errors="errors"
          :spots="spots"
        />
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-between items-center p-6">
        <div class="flex space-x-4">
          <!-- Back Button -->
          <button
            v-if="currentStep > 1"
            type="button"
            @click="prevStep"
            class="group relative px-6 py-3 bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-800/50 active:scale-95"
          >
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>{{ t('common.previous') }}</span>
            </div>
          </button>
        </div>

        <div class="flex space-x-4">
          <!-- Next Button -->
          <button
            v-if="currentStep < totalSteps"
            type="button"
            @click="nextStep"
            class="group relative px-6 py-3 bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600/90 hover:to-purple-700/90 backdrop-blur-sm border border-blue-400/50 dark:border-purple-500/50 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-purple-500/30 active:scale-95"
          >
            <div class="flex items-center space-x-2">
              <span>{{ t('common.next') }}</span>
              <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <!-- Submit Button -->
          <button
            v-if="currentStep === totalSteps"
            type="submit"
            :disabled="isSubmitting"
            class="group relative px-6 py-3 bg-gradient-to-r from-green-500/90 to-emerald-600/90 hover:from-green-600/90 hover:to-emerald-700/90 disabled:from-gray-400/90 disabled:to-gray-500/90 backdrop-blur-sm border border-green-400/50 dark:border-emerald-500/50 disabled:border-gray-400/50 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 dark:hover:shadow-emerald-500/30 active:scale-95 disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
          >
            <div class="flex items-center space-x-2">
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ flight ? t('common.save') : t('flights.addFlight') }}</span>
            </div>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>