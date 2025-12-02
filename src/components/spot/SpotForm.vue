<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../stores/user'
import BaseAlert from '../base/BaseAlert.vue'
import SpotFormStep1 from './SpotFormStep1.vue'
import SpotFormStep2 from './SpotFormStep2.vue'
import spotService from '../../services/spotService'

const { t } = useI18n()
const userStore = useUserStore()

const props = defineProps({
  spot: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'close', 'saved'])

// Estado del formulario multi-paso
const currentStep = ref(1)
const totalSteps = 2
const errors = ref({})
const isSubmitting = ref(false)

const formData = ref({
  name: '',
  description: '',
  location: {
    type: 'Point',
    coordinates: [],
    address: '',
    city: '',
    country: '',
    placeId: ''
  },
  visibility: {
    public: true,
    visibleToFollowersOnly: false
  },
  legalStatus: 'WITHOUT_ANALIZED'
})

// Validaciones por paso
const validateStep1 = () => {
  const stepErrors = {}
  
  if (!formData.value.name?.trim()) {
    stepErrors.name = t('spots.form.errors.nameRequired')
  }
  
  if (formData.value.name && formData.value.name.length > 100) {
    stepErrors.name = t('spots.form.errors.nameTooLong')
  }
  
  if (formData.value.description && formData.value.description.length > 500) {
    stepErrors.description = t('spots.form.errors.descriptionTooLong')
  }
  
  errors.value = stepErrors
  return Object.keys(stepErrors).length === 0
}

const validateStep2 = () => {
  const stepErrors = {}
  
  if (!formData.value.location?.coordinates || formData.value.location.coordinates.length !== 2) {
    stepErrors.location = t('spots.form.errors.locationRequired')
  }
  
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

// Inicializar datos si se está editando
if (props.spot) {
  formData.value = {
    name: props.spot.name || '',
    description: props.spot.description || '',
    location: props.spot.location || {
      type: 'Point',
      coordinates: [],
      address: '',
      city: '',
      country: '',
      placeId: ''
    },
    visibility: props.spot.visibility || {
      public: true,
      visibleToFollowersOnly: false
    },
    legalStatus: props.spot.legalStatus || 'WITHOUT_ANALIZED'
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
  }
  
  if (!isValid) return
  
  isSubmitting.value = true
  try {
    // Preparar los datos para envío
    const dataToSend = { ...formData.value }
    
    if (props.spot) {
      await spotService.updateSpot(props.spot._id, dataToSend)
    } else {
      const spotData = {
        ...dataToSend,
        submittedBy: userStore.user._id
      }
      await spotService.createSpot(spotData)
    }
    
    emit('saved')
  } catch (error) {
    errors.value.submit = error.response?.data?.message || error.message
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
        v-for="step in 2" 
        :key="step"
        class="flex items-center"
      >
        <div 
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
            currentStep >= step 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          ]"
        >
          {{ step }}
        </div>
        <div 
          v-if="step < 2"
          :class="[
            'w-16 h-0.5 mx-2 transition-all duration-300',
            currentStep > step 
              ? 'bg-green-600' 
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
        <SpotFormStep1
          v-if="currentStep === 1"
          v-model="formData"
          :errors="errors"
        />
        
        <SpotFormStep2
          v-if="currentStep === 2"
          v-model="formData"
          :errors="errors"
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
            class="group relative px-6 py-3 bg-gradient-to-r from-green-500/90 to-emerald-600/90 hover:from-green-600/90 hover:to-emerald-700/90 backdrop-blur-sm border border-green-400/50 dark:border-emerald-500/50 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 dark:hover:shadow-emerald-500/30 active:scale-95"
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
              <span>{{ spot ? t('common.save') : t('spots.form.create') }}</span>
            </div>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>