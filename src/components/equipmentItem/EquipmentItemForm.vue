<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseSelect from '../base/BaseSelect.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import equipmentItemService from '../../services/equipmentItemService'
import { useUserStore } from '../../stores/user'

const props = defineProps({
  selectedType: {
    type: String,
    default: null
  },
  equipmentItem: {
    type: Object,
    default: null
  }
})

const userStore = useUserStore()
const emit = defineEmits(['close', 'saved'])
const { t } = useI18n()
const isLoading = ref(false)
const errors = ref({})
const currentStep = ref(1)

// Enums basados en el modelo
const EQUIPMENT_TYPES = {
  DRONE: 'DRONE',
  RADIO: 'RADIO', 
  GOGGLES: 'GOGGLES',
  BATTERY: 'BATTERY',
  CHARGER: 'CHARGER',
  OTHERS: 'OTHERS'
}

const EQUIPMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED', 
  SOLD: 'SOLD',
  LOST: 'LOST'
}

const formData = ref({
  name: '',
  type: props.selectedType || '',
  condition: 'new',
  status: 'ACTIVE',
  description: '',
  image: '',
  productLink: '',
  favorite: false
})

// Si estamos editando, cargar los datos
if (props.equipmentItem) {
  Object.assign(formData.value, props.equipmentItem)
  currentStep.value = 2 // Saltar la selección de tipo si estamos editando
}

// Opciones para los selects
const typeOptions = computed(() => 
  Object.keys(EQUIPMENT_TYPES).map(key => ({
    value: key,
    label: t(`equipmentItems.types.${key.toLowerCase()}`)
  }))
)

const statusOptions = computed(() => 
  Object.keys(EQUIPMENT_STATUS).map(key => ({
    value: key,
    label: t(`equipmentItems.status.${key.toLowerCase()}`)
  }))
)

const conditionOptions = computed(() => [
  { value: 'new', label: t('equipmentItems.conditions.new') },
  { value: 'like_new', label: t('equipmentItems.conditions.likeNew') },
  { value: 'good', label: t('equipmentItems.conditions.good') },
  { value: 'fair', label: t('equipmentItems.conditions.fair') },
  { value: 'poor', label: t('equipmentItems.conditions.poor') }
])

// Computed para el icono del tipo
const typeIcon = computed(() => {
  const icons = {
    DRONE: '🚁',
    RADIO: '🎮',
    GOGGLES: '🥽',
    BATTERY: '🔋',
    CHARGER: '🔌',
    OTHERS: '📋'
  }
  return icons[formData.value.type] || '📋'
})

const currentTypeLabel = computed(() => {
  if (!formData.value.type) return ''
  return t(`equipmentItems.types.${formData.value.type.toLowerCase()}`)
})

// Validación por pasos
const validateStep1 = () => {
  errors.value = {}
  if (!formData.value.type) {
    errors.value.type = t('equipmentItems.validation.typeRequired')
    return false
  }
  return true
}

const validateStep2 = () => {
  errors.value = {}
  if (!formData.value.name?.trim()) {
    errors.value.name = t('equipmentItems.validation.nameRequired')
    return false
  }
  return true
}

const selectTypeAndAdvance = (type) => {
  formData.value.type = type
  // Avanzar automáticamente al siguiente paso
  if (validateStep1()) {
    currentStep.value = 2
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  if (!validateStep2()) return
  
  isLoading.value = true
  errors.value = {}
  
  try {
    const submitData = {
      ...formData.value,
      userId: userStore.user._id
    }

    if (props.equipmentItem) {
      await equipmentItemService.updateEquipmentItem(props.equipmentItem._id, submitData)
    } else {
      await equipmentItemService.createEquipmentItem(submitData)
    }
    
    emit('saved')
  } catch (error) {
    console.error('Error saving equipment item:', error)
    errors.value.submit = error.message || t('equipmentItems.errors.saveFailed')
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  emit('close')
}

// Watch para resetear errores cuando cambie el tipo
watch(() => formData.value.type, () => {
  errors.value = {}
})
</script>

<template>
  <div class="space-y-6">
    <!-- Progress indicator -->
    <div v-if="!props.equipmentItem" class="px-8 py-6 bg-gradient-to-r from-card/60 to-card/30 backdrop-blur-sm rounded-xl border border-border/30">
      <div class="flex items-center justify-center gap-6">
        <div class="flex items-center gap-3">
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-lg transition-all duration-300',
            currentStep >= 1 
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30' 
              : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 dark:from-gray-700 dark:to-gray-600 dark:text-gray-400'
          ]">
            <svg v-if="currentStep > 1" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span v-else>1</span>
          </div>
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ t('equipmentItems.form.steps.selectType') }}
          </span>
        </div>
        
        <div :class="[
          'w-12 h-1 rounded-full transition-all duration-500',
          currentStep >= 2 
            ? 'bg-gradient-to-r from-primary-500 to-primary-600' 
            : 'bg-gray-200 dark:bg-gray-700'
        ]"></div>
        
        <div class="flex items-center gap-3">
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-lg transition-all duration-300',
            currentStep >= 2 
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30' 
              : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 dark:from-gray-700 dark:to-gray-600 dark:text-gray-400'
          ]">
            2
          </div>
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ t('equipmentItems.form.steps.fillDetails') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <BaseAlert
        v-if="errors.submit"
        type="error"
        :message="errors.submit"
        class="mb-6"
      />

      <!-- Step 1: Selección de tipo -->
      <div v-if="currentStep === 1" class="space-y-8">
        <div class="text-center mb-10">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {{ t('equipmentItems.form.selectEquipmentType') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {{ t('equipmentItems.form.selectEquipmentTypeDescription') }}
          </p>
        </div>

        <!-- Type selection grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <button
            v-for="option in typeOptions"
            :key="option.value"
            type="button"
            @click="selectTypeAndAdvance(option.value)"
            :class="[
              'group relative p-6 rounded-2xl border transition-all duration-500 transform hover:scale-105 hover:-translate-y-2',
              'bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl',
              'dark:from-white/10 dark:via-white/5 dark:to-transparent',
              'shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-primary-500/30',
              'border-white/20 dark:border-white/10',
              'hover:border-primary-300/50 dark:hover:border-primary-400/30',
              'overflow-hidden',
              formData.type === option.value
                ? 'border-primary-400/60 bg-gradient-to-br from-primary-100/30 via-primary-50/20 to-transparent dark:from-primary-900/20 dark:via-primary-800/10 shadow-xl shadow-primary-500/40'
                : ''
            ]"
          >
            <!-- Liquid glass layers -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="absolute inset-0 bg-gradient-to-tl from-primary-200/20 via-transparent to-primary-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
            
            <!-- Shimmer effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            <!-- Ripple effect -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/0 via-primary-400/30 to-primary-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md scale-110"></div>
            
            <!-- Inner glow -->
            <div class="absolute inset-1 rounded-xl bg-gradient-to-br from-white/40 via-transparent to-white/20 opacity-0 group-hover:opacity-60 transition-opacity duration-400"></div>
            
            <!-- Content -->
            <div class="relative z-20">
              <div class="text-4xl mb-3 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 filter group-hover:drop-shadow-lg">
                {{ option.value === 'DRONE' ? '🚁' : 
                   option.value === 'RADIO' ? '🎮' : 
                   option.value === 'GOGGLES' ? '🥽' : 
                   option.value === 'BATTERY' ? '🔋' : 
                   option.value === 'CHARGER' ? '🔌' : '📋' }}
              </div>
              <div class="font-semibold text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {{ option.label }}
              </div>
            </div>
            
            <!-- Outer glow -->
            <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-400/0 via-primary-400/40 to-primary-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
            
            <!-- Glass reflection -->
            <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl opacity-60"></div>
          </button>
        </div>

        <BaseAlert
          v-if="errors.type"
          type="error"
          :message="errors.type"
        />


      </div>

      <!-- Step 2: Detalles del equipamiento -->
      <div v-if="currentStep === 2" class="space-y-6">
        <!-- Información básica -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
            {{ t('equipmentItems.form.basicInfo') }}
          </h3>
          
          <BaseInput
            v-model="formData.name"
            :label="t('equipmentItems.form.name')"
            :placeholder="t('equipmentItems.form.placeholders.name')"
            :error="errors.name"
            required
            class="w-full"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInput
              v-model="formData.image"
              :label="t('equipmentItems.form.image')"
              :placeholder="t('equipmentItems.form.placeholders.image')"
              type="url"
              class="w-full"
            />

            <BaseInput
              v-model="formData.productLink"
              :label="t('equipmentItems.form.productLink')"
              :placeholder="t('equipmentItems.form.placeholders.productLink')"
              type="url"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('equipmentItems.form.notes') }}
            </label>
            <textarea
              v-model="formData.notes"
              :placeholder="t('equipmentItems.form.placeholders.notes')"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 resize-none"
            />
          </div>
        </div>

        <!-- Opciones adicionales -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
            {{ t('equipmentItems.form.options') }}
          </h3>

          <div class="flex items-center gap-3">
            <input
              id="favorite"
              v-model="formData.favorite"
              type="checkbox"
              class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="favorite" class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <span>⭐</span>
              {{ t('equipmentItems.form.favorite') }}
            </label>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex items-center justify-between pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            v-if="!props.equipmentItem"
            type="button"
            @click="prevStep"
            class="group relative inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-gray-100/80 to-gray-200/60 dark:from-gray-800/80 dark:to-gray-700/60 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-500/20 dark:hover:shadow-gray-900/30"
          >
            <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg class="w-4 h-4 mr-2 relative z-10 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="relative z-10">{{ t('common.back') }}</span>
          </button>
          
          <div class="flex items-center ml-auto">
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-500/40 dark:hover:shadow-primary-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden"
            >
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              <!-- Glow effect -->
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/0 via-primary-400/30 to-primary-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
              
              <!-- Loading spinner -->
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              
              <span class="relative z-10">{{ props.equipmentItem ? t('common.update') : t('common.create') }}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Animaciones suaves */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Focus styles */
textarea:focus {
  outline: none;
}
</style>