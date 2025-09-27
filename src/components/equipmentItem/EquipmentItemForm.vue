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
const imagePreview = ref(null)
const selectedImageFile = ref(null)
const isDragOver = ref(false)

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

// Función para obtener las clases de color glassmorphism por tipo
const getTypeColorClasses = (typeId) => {
  const colorMap = {
    DRONE: {
      gradient: 'from-blue-400/20 to-blue-500/20',
      selectedBg: 'bg-gradient-to-r from-blue-100/10 to-blue-200/10',
      selectedRing: 'ring-blue-400/50',
      indicator: 'from-blue-400/60 to-blue-500/60',
      counter: 'from-blue-400/30 to-blue-500/30',
      hover: 'hover:from-blue-300/25 hover:to-blue-400/25',
      border: 'border-blue-400/30',
      text: 'text-blue-700 dark:text-blue-300',
      shadow: 'shadow-blue-500/30',
      selectedBorder: 'border-blue-400/60',
      selectedShadow: 'shadow-blue-500/40'
    },
    RADIO: {
      gradient: 'from-green-400/20 to-green-500/20',
      selectedBg: 'bg-gradient-to-r from-green-100/10 to-green-200/10',
      selectedRing: 'ring-green-400/50',
      indicator: 'from-green-400/60 to-green-500/60',
      counter: 'from-green-400/30 to-green-500/30',
      hover: 'hover:from-green-300/25 hover:to-green-400/25',
      border: 'border-green-400/30',
      text: 'text-green-700 dark:text-green-300',
      shadow: 'shadow-green-500/30',
      selectedBorder: 'border-green-400/60',
      selectedShadow: 'shadow-green-500/40'
    },
    GOGGLES: {
      gradient: 'from-purple-400/20 to-purple-500/20',
      selectedBg: 'bg-gradient-to-r from-purple-100/10 to-purple-200/10',
      selectedRing: 'ring-purple-400/50',
      indicator: 'from-purple-400/60 to-purple-500/60',
      counter: 'from-purple-400/30 to-purple-500/30',
      hover: 'hover:from-purple-300/25 hover:to-purple-400/25',
      border: 'border-purple-400/30',
      text: 'text-purple-700 dark:text-purple-300',
      shadow: 'shadow-purple-500/30',
      selectedBorder: 'border-purple-400/60',
      selectedShadow: 'shadow-purple-500/40'
    },
    BATTERY: {
      gradient: 'from-yellow-400/20 to-yellow-500/20',
      selectedBg: 'bg-gradient-to-r from-yellow-100/10 to-yellow-200/10',
      selectedRing: 'ring-yellow-400/50',
      indicator: 'from-yellow-400/60 to-yellow-500/60',
      counter: 'from-yellow-400/30 to-yellow-500/30',
      hover: 'hover:from-yellow-300/25 hover:to-yellow-400/25',
      border: 'border-yellow-400/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      shadow: 'shadow-yellow-500/30',
      selectedBorder: 'border-yellow-400/60',
      selectedShadow: 'shadow-yellow-500/40'
    },
    CHARGER: {
      gradient: 'from-red-400/20 to-red-500/20',
      selectedBg: 'bg-gradient-to-r from-red-100/10 to-red-200/10',
      selectedRing: 'ring-red-400/50',
      indicator: 'from-red-400/60 to-red-500/60',
      counter: 'from-red-400/30 to-red-500/30',
      hover: 'hover:from-red-300/25 hover:to-red-400/25',
      border: 'border-red-400/30',
      text: 'text-red-700 dark:text-red-300',
      shadow: 'shadow-red-500/30',
      selectedBorder: 'border-red-400/60',
      selectedShadow: 'shadow-red-500/40'
    },
    OTHERS: {
      gradient: 'from-indigo-400/20 to-indigo-500/20',
      selectedBg: 'bg-gradient-to-r from-indigo-100/10 to-indigo-200/10',
      selectedRing: 'ring-indigo-400/50',
      indicator: 'from-indigo-400/60 to-indigo-500/60',
      counter: 'from-indigo-400/30 to-indigo-500/30',
      hover: 'hover:from-indigo-300/25 hover:to-indigo-400/25',
      border: 'border-indigo-400/30',
      text: 'text-indigo-700 dark:text-indigo-300',
      shadow: 'shadow-indigo-500/30',
      selectedBorder: 'border-indigo-400/60',
      selectedShadow: 'shadow-indigo-500/40'
    }
  }
  return colorMap[typeId] || colorMap.OTHERS
}

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



const handleClose = () => {
  emit('close')
}

// Funciones para manejo de imágenes
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    processImageFile(file)
  }
}

const processImageFile = (file) => {
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    errors.value.image = 'Solo se permiten archivos de imagen'
    return
  }
  
  // Validar tamaño (10MB máximo)
  if (file.size > 10 * 1024 * 1024) {
    errors.value.image = 'El archivo no puede ser mayor a 10MB'
    return
  }
  
  selectedImageFile.value = file
  
  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
  
  // Limpiar errores
  delete errors.value.image
}

const removeImage = () => {
  imagePreview.value = null
  selectedImageFile.value = null
  formData.value.image = ''
  
  // Limpiar el input file
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) {
    fileInput.value = ''
  }
}

const uploadImageToServer = async (equipmentItemId) => {
  if (!selectedImageFile.value) return null
  
  try {
    const formDataUpload = new FormData()
    formDataUpload.append('image', selectedImageFile.value)
    
    const response = await equipmentItemService.uploadEquipmentItemImage(equipmentItemId, formDataUpload)
    return response.data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Error al subir la imagen')
  }
}

// Drag and drop handlers
const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    processImageFile(files[0])
  }
}

// Modificar handleSubmit para incluir subida de imagen
const handleSubmit = async () => {
  if (!validateStep2()) return
  
  isLoading.value = true
  errors.value = {}
  
  try {
    const submitData = {
      ...formData.value,
      userId: userStore.user._id
    }

    let savedItem
    if (props.equipmentItem) {
      savedItem = await equipmentItemService.updateEquipmentItem(props.equipmentItem._id, submitData)
    } else {
      savedItem = await equipmentItemService.createEquipmentItem(submitData)
    }
    
    // Subir imagen si hay una seleccionada
    if (selectedImageFile.value && savedItem.data) {
      try {
        await uploadImageToServer(savedItem.data._id)
      } catch (imageError) {
        console.error('Error uploading image:', imageError)
        // No fallar todo el proceso por error de imagen
        errors.value.image = 'El equipamiento se guardó pero hubo un error al subir la imagen'
      }
    }
    
    emit('saved')
  } catch (error) {
    console.error('Error saving equipment item:', error)
    errors.value.submit = error.message || t('equipmentItems.errors.saveFailed')
  } finally {
    isLoading.value = false
  }
}

// Watch para resetear errores cuando cambie el tipo
watch(() => formData.value.type, () => {
  errors.value = {}
})
</script>

<template>
  <div class="space-y-6 glass-scrollbar">
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
              'bg-gradient-to-br backdrop-blur-xl',
              `bg-gradient-to-br ${getTypeColorClasses(option.value).gradient}`,
              'dark:from-white/10 dark:via-white/5 dark:to-transparent', 
              'shadow-lg shadow-black/5 hover:shadow-2xl',
              `hover:shadow-2xl hover:${getTypeColorClasses(option.value).shadow}`,
              getTypeColorClasses(option.value).border,
              `hover:${getTypeColorClasses(option.value).border}`,
              'overflow-hidden', 
              formData.type === option.value 
                ? `${getTypeColorClasses(option.value).selectedBorder} ${getTypeColorClasses(option.value).selectedBg} shadow-xl ${getTypeColorClasses(option.value).selectedShadow}` 
                : '' 
            ]" 
          > 
            <!-- Liquid glass layers --> 
            <div :class="[
              'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
              `bg-gradient-to-br ${getTypeColorClasses(option.value).gradient}`
            ]"></div> 
            <div :class="[
              'absolute inset-0 bg-gradient-to-tl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100',
              `bg-gradient-to-tl ${getTypeColorClasses(option.value).indicator}`
            ]"></div> 
            
            <!-- Shimmer effect --> 
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div> 
            
            <!-- Ripple effect --> 
            <div :class="[
              'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md scale-110',
              `bg-gradient-to-r ${getTypeColorClasses(option.value).indicator}`
            ]"></div> 
            
            <!-- Inner glow --> 
            <div :class="[
              'absolute inset-1 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-60 transition-opacity duration-400',
              `bg-gradient-to-br ${getTypeColorClasses(option.value).gradient}`
            ]"></div> 
            
            <!-- Content --> 
            <div class="relative z-20"> 
              <div class="text-4xl mb-3 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 filter group-hover:drop-shadow-lg"> 
                {{ option.value === 'DRONE' ? '🚁' : 
                   option.value === 'RADIO' ? '🎮' : 
                   option.value === 'GOGGLES' ? '🥽' : 
                   option.value === 'BATTERY' ? '🔋' : 
                   option.value === 'CHARGER' ? '🔌' : '📋' }} 
              </div> 
              <div class="font-semibold text-sm transition-colors duration-300">
                {{ option.label }}
              </div> 
            </div> 
            
            <!-- Outer glow --> 
            <div :class="[
              'absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10',
              `bg-gradient-to-r ${getTypeColorClasses(option.value).indicator}`
            ]"></div>
            
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
      <div v-if="currentStep === 2" class="space-y-8">
        <!-- Header del paso 2 -->
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {{ t('equipmentItems.form.fillDetails') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Completa los detalles de tu equipamiento para tener un registro completo
          </p>
        </div>

        <!-- Grid principal -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Columna izquierda: Subida de imagen -->
          <div class="lg:col-span-1">
            <div 
              class="group relative p-8 rounded-3xl border-2 border-dashed transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @drop="handleDrop"
              :class="{ 'scale-105 -translate-y-2': isDragOver }"
            >
              <!-- Glassmorphism background -->
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-white/20 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl"></div>
              
              <!-- Dynamic border color based on equipment type -->
              <div :class="[
                'absolute inset-0 rounded-3xl border-2 border-dashed transition-all duration-500',
                isDragOver 
                  ? formData.type 
                    ? `${getTypeColorClasses(formData.type).selectedBorder} border-opacity-100` 
                    : 'border-primary-400 border-opacity-100'
                  : formData.type 
                    ? getTypeColorClasses(formData.type).border 
                    : 'border-gray-300/50 dark:border-gray-600/50',
                'group-hover:border-opacity-80'
              ]"></div>
              
              <!-- Hover glow effect -->
              <div :class="[
                'absolute -inset-1 rounded-3xl transition-opacity duration-500 blur-xl -z-10',
                isDragOver || imagePreview ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                formData.type ? `bg-gradient-to-r ${getTypeColorClasses(formData.type).indicator}` : 'bg-gradient-to-r from-gray-400/30 to-gray-500/30'
              ]"></div>
              
              <!-- Drag overlay -->
              <div v-if="isDragOver" class="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur-sm flex items-center justify-center z-20">
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-400/30 to-primary-500/30 flex items-center justify-center animate-bounce">
                    <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p class="text-lg font-semibold text-primary-700 dark:text-primary-300">
                    Suelta la imagen aquí
                  </p>
                </div>
              </div>
              
              <!-- Content -->
              <div class="relative z-10 text-center">
                <!-- Image preview or upload area -->
                <div v-if="imagePreview" class="mb-6">
                  <div class="relative inline-block">
                    <img 
                      :src="imagePreview" 
                      alt="Preview" 
                      class="w-32 h-32 object-cover rounded-2xl shadow-lg"
                    />
                    <button
                      type="button"
                      @click="removeImage"
                      class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div v-else class="mb-6">
                  <!-- Upload icon with dynamic color -->
                  <div :class="[
                    'w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110',
                    formData.type ? `bg-gradient-to-br ${getTypeColorClasses(formData.type).gradient}` : 'bg-gradient-to-br from-gray-100/80 to-gray-200/60 dark:from-gray-800/80 dark:to-gray-700/60'
                  ]">
                    <svg class="w-10 h-10 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <!-- Upload text -->
                <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {{ imagePreview ? 'Imagen cargada' : 'Sube una imagen' }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {{ imagePreview ? 'Haz clic para cambiar' : 'Arrastra y suelta o haz clic para seleccionar' }}
                </p>
                
                <!-- Upload input -->
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                />
                
                <!-- Upload button -->
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  :class="[
                    'group/btn relative inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 overflow-hidden',
                    formData.type 
                      ? `bg-gradient-to-r ${getTypeColorClasses(formData.type).gradient} ${getTypeColorClasses(formData.type).text} hover:shadow-lg hover:${getTypeColorClasses(formData.type).shadow}` 
                      : 'bg-gradient-to-r from-gray-100/80 to-gray-200/60 dark:from-gray-800/80 dark:to-gray-700/60 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:shadow-gray-500/20'
                  ]"
                >
                  <!-- Shimmer effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  <svg class="w-5 h-5 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span class="relative z-10">{{ imagePreview ? 'Cambiar imagen' : 'Seleccionar imagen' }}</span>
                </button>
                
                <!-- File format info -->
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-3">
                  JPG, PNG o WEBP • Máx. 10MB
                </p>
                
                <!-- Error message -->
                <p v-if="errors.image" class="mt-3 text-xs text-red-600 dark:text-red-400">
                  {{ errors.image }}
                </p>
              </div>
            </div>
          </div>

          <!-- Columna derecha: Formulario de detalles -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Card: Información básica -->
            <div class="group relative p-4 rounded-2xl border transition-all duration-500 hover:scale-[1.005] hover:-translate-y-0.5 overflow-hidden">
              <!-- Glassmorphism background -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl"></div>
              
              <!-- Dynamic border -->
              <div :class="[
                'absolute inset-0 rounded-2xl border transition-all duration-500',
                formData.type ? getTypeColorClasses(formData.type).border : 'border-gray-200/50 dark:border-gray-700/50'
              ]"></div>
              
              <!-- Subtle glow -->
              <div :class="[
                'absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10',
                formData.type ? `bg-gradient-to-r ${getTypeColorClasses(formData.type).gradient}` : 'bg-gradient-to-r from-gray-200/30 to-gray-300/30'
              ]"></div>
              
              <!-- Content -->
              <div class="relative z-10">
                <!-- Header with icon -->
                <div class="flex items-center gap-3 mb-4">
                  <div :class="[
                    'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300',
                    formData.type ? `bg-gradient-to-br ${getTypeColorClasses(formData.type).gradient}` : 'bg-gradient-to-br from-gray-100/80 to-gray-200/60 dark:from-gray-800/80 dark:to-gray-700/60'
                  ]">
                    <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {{ t('equipmentItems.form.basicInfo') }}
                  </h4>
                </div>
                
                <!-- Form fields -->
                <div class="space-y-4">
                  <!-- Nombre -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('equipmentItems.form.name') }} *
                    </label>
                    <div class="relative">
                      <input
                        v-model="formData.name"
                        type="text"
                        :placeholder="t('equipmentItems.form.placeholders.name')"
                        :class="[
                          'w-full px-3 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none backdrop-blur-sm',
                          'bg-white/50 dark:bg-gray-800/50',
                          errors.name 
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : formData.type 
                              ? `border-gray-200/50 dark:border-gray-700/50 focus:${getTypeColorClasses(formData.type).selectedBorder} focus:ring-4 focus:ring-current/20`
                              : 'border-gray-200/50 dark:border-gray-700/50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20',
                          'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
                        ]"
                      />
                      <!-- Focus glow -->
                      <div :class="[
                        'absolute -inset-1 rounded-xl opacity-0 transition-opacity duration-300 blur-lg -z-10',
                        formData.type ? `bg-gradient-to-r ${getTypeColorClasses(formData.type).indicator}` : 'bg-gradient-to-r from-primary-400/30 to-primary-500/30'
                      ]" :style="{ opacity: errors.name ? 0 : 'var(--focus-opacity, 0)' }"></div>
                    </div>
                    <p v-if="errors.name" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.name }}</p>
                  </div>
                  
                  <!-- Grid para URL de producto -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('equipmentItems.form.productLink') }}
                    </label>
                    <div class="relative">
                      <input
                        v-model="formData.productLink"
                        type="url"
                        :placeholder="t('equipmentItems.form.placeholders.productLink')"
                        :class="[
                          'w-full px-3 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none backdrop-blur-sm',
                          'bg-white/50 dark:bg-gray-800/50',
                          formData.type 
                            ? `border-gray-200/50 dark:border-gray-700/50 focus:${getTypeColorClasses(formData.type).selectedBorder} focus:ring-4 focus:ring-current/20`
                            : 'border-gray-200/50 dark:border-gray-700/50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20',
                          'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
                        ]"
                      />
                      <!-- Icon -->
                      <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card: Notas y opciones -->
            <div class="group relative p-4 rounded-2xl border transition-all duration-500 hover:scale-[1.005] hover:-translate-y-0.5 overflow-hidden">
              <!-- Glassmorphism background -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl"></div>
              
              <!-- Dynamic border -->
              <div :class="[
                'absolute inset-0 rounded-2xl border transition-all duration-500',
                formData.type ? getTypeColorClasses(formData.type).border : 'border-gray-200/50 dark:border-gray-700/50'
              ]"></div>
              
              <!-- Subtle glow -->
              <div :class="[
                'absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10',
                formData.type ? `bg-gradient-to-r ${getTypeColorClasses(formData.type).gradient}` : 'bg-gradient-to-r from-gray-200/30 to-gray-300/30'
              ]"></div>
              
              <!-- Content -->
              <div class="relative z-10 space-y-4">
                <!-- Notas -->
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div :class="[
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
                      formData.type ? `bg-gradient-to-br ${getTypeColorClasses(formData.type).gradient}` : 'bg-gradient-to-br from-gray-100/80 to-gray-200/60 dark:from-gray-800/80 dark:to-gray-700/60'
                    ]">
                      <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <label class="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {{ t('equipmentItems.form.notes') }}
                    </label>
                  </div>
                  
                  <textarea
                    v-model="formData.notes"
                    :placeholder="t('equipmentItems.form.placeholders.notes')"
                    rows="3"
                    :class="[
                      'w-full px-3 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none backdrop-blur-sm resize-none',
                      'bg-white/50 dark:bg-gray-800/50',
                      formData.type 
                        ? `border-gray-200/50 dark:border-gray-700/50 focus:${getTypeColorClasses(formData.type).selectedBorder} focus:ring-4 focus:ring-current/20`
                        : 'border-gray-200/50 dark:border-gray-700/50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20',
                      'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
                    ]"
                  />
                </div>

                <!-- Opciones -->
                <div>
                  <h5 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {{ t('equipmentItems.form.options') }}
                  </h5>
                  
                  <!-- Favorito -->
                  <label class="group/check relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/30 dark:hover:bg-white/5">
                    <div class="relative">
                      <input
                        id="favorite"
                        v-model="formData.favorite"
                        type="checkbox"
                        class="sr-only"
                      />
                      <div :class="[
                        'w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center',
                        formData.favorite 
                          ? formData.type 
                            ? `${getTypeColorClasses(formData.type).selectedBg} ${getTypeColorClasses(formData.type).selectedBorder}` 
                            : 'bg-primary-500 border-primary-500'
                          : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50'
                      ]">
                        <svg v-if="formData.favorite" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-2">
                      <span class="text-lg">⭐</span>
                      <div>
                        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {{ t('equipmentItems.form.favorite') }}
                        </span>
                        <p class="text-xs text-gray-600 dark:text-gray-400">
                          Marca como favorito para acceso rápido
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex items-center justify-between pt-4">
          <button
            v-if="!props.equipmentItem"
            type="button"
            @click="prevStep"
            class="group relative inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-100/80 to-gray-200/60 dark:from-gray-800/80 dark:to-gray-700/60 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-500/20 dark:hover:shadow-gray-900/30 overflow-hidden"
          >
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg class="w-5 h-5 mr-3 relative z-10 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="relative z-10">{{ t('common.back') }}</span>
          </button>
          
          <div class="flex items-center ml-auto">
            <button
              type="submit"
              :disabled="isLoading"
              :class="[
                'group relative inline-flex items-center px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden',
                formData.type 
                  ? `bg-gradient-to-r ${getTypeColorClasses(formData.type).gradient} ${getTypeColorClasses(formData.type).text} hover:shadow-2xl hover:${getTypeColorClasses(formData.type).shadow}` 
                  : 'bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white hover:shadow-2xl hover:shadow-primary-500/40 dark:hover:shadow-primary-600/40'
              ]"
            >
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
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

/* Aplicar scrollbar glassmorphism específicamente a este componente */
.glass-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(14, 165, 233, 0.6) rgba(255, 255, 255, 0.1);
}
</style>