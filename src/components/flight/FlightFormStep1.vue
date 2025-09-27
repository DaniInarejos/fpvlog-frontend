<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from '../base/BaseInput.vue'
import BaseImageUpload from '../base/BaseImageUpload.vue'
import BaseAlert from '../base/BaseAlert.vue'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const imagePreview = ref(null)
const selectedImageFile = ref(null)
const isDragOver = ref(false)

// Si hay una imagen existente, mostrarla
if (props.modelValue.posterUrl) {
  imagePreview.value = props.modelValue.posterUrl
}

const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

// Funciones para manejo de imágenes
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    processImageFile(file)
  }
}

const processImageFile = (file) => {
  if (file.size > 10 * 1024 * 1024) { // 10MB
    return
  }

  selectedImageFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    updateField('posterUrl', e.target.result)
  }
  reader.readAsDataURL(file)
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
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

const removeImage = () => {
  imagePreview.value = null
  selectedImageFile.value = null
  updateField('posterUrl', '')
}
</script>

<template>
  <div class="space-y-8">

    <!-- Grid principal -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          
          <!-- Dynamic border color -->
          <div :class="[
            'absolute inset-0 rounded-3xl border-2 border-dashed transition-all duration-500',
            isDragOver 
              ? 'border-primary-400/80 dark:border-primary-500/80' 
              : 'border-gray-300/60 dark:border-gray-600/60 group-hover:border-primary-400/60 dark:group-hover:border-primary-500/60'
          ]"></div>
          
          <!-- Content -->
          <div class="relative z-10 text-center">
            <!-- Image preview or upload area -->
            <div v-if="imagePreview" class="relative">
              <img 
                :src="imagePreview" 
                alt="Preview" 
                class="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <button
                type="button"
                @click="removeImage"
                class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                ×
              </button>
            </div>
            
            <div v-else class="space-y-4">
              <!-- Upload icon -->
              <div class="w-16 h-16 mx-auto bg-gradient-to-br from-primary-100/80 to-primary-200/60 dark:from-primary-900/40 dark:to-primary-800/40 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <!-- Upload text -->
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {{ t('flights.form.posterImage') }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {{ t('flights.form.posterImageDescription') }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  {{ imagePreview ? 'Haz clic para cambiar' : 'Arrastra y suelta o haz clic para seleccionar' }}
                </p>
              </div>
            </div>
            
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
              class="group/btn relative inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/40 mt-4"
            >
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              <span class="relative z-10">
                {{ imagePreview ? t('common.change') : t('common.select') }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Columna derecha: Campos del formulario -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Título -->
        <div class="group relative p-6 rounded-2xl bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300">
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ t('flights.form.title') }}
              </h4>
            </div>
            
            <BaseInput
              :model-value="modelValue.title"
              @update:model-value="updateField('title', $event)"
              :placeholder="t('flights.form.titlePlaceholder')"
              :error="errors.title"
              class="w-full"
            />
          </div>
        </div>

        <!-- Enlace al video -->
        <div class="group relative p-6 rounded-2xl bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300">
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ t('flights.form.videoUrl') }}
                <span class="text-red-500 ml-1">*</span>
              </h4>
            </div>
            
            <BaseInput
              :model-value="modelValue.videoUrl"
              @update:model-value="updateField('videoUrl', $event)"
              :placeholder="t('flights.form.videoUrlPlaceholder')"
              :error="errors.videoUrl"
              class="w-full"
            />
            
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {{ t('flights.form.videoUrlHelp') }}
            </p>
          </div>
        </div>

        <!-- Campo obligatorio notice -->
        <BaseAlert
          v-if="errors.videoUrl"
          type="error"
          :message="errors.videoUrl"
        />
      </div>
    </div>
  </div>
</template>