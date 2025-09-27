<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from '../base/BaseInput.vue'
import BaseSelect from '../base/BaseSelect.vue'

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

const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

// Opciones para disciplines
const disciplineOptions = [
  { value: 'freestyle', label: 'Freestyle' },
  { value: 'racing', label: 'Racing' },
  { value: 'cinewhoop', label: 'Cinewhoop' },
  { value: 'long-range', label: 'Long Range' },
  { value: 'other', label: 'Other' }
]

// Opciones para visibility
const visibilityOptions = [
  { _id: 'private', name: t('flights.visibility.private') },
  { _id: 'followers', name: t('flights.visibility.followers') },
  { _id: 'public', name: t('flights.visibility.public') }
]

// Manejar disciplines como array
const updateDisciplines = (disciplineValue) => {
  const currentDisciplines = props.modelValue.disciplines || []
  let newDisciplines
  
  if (currentDisciplines.includes(disciplineValue)) {
    newDisciplines = currentDisciplines.filter(d => d !== disciplineValue)
  } else {
    newDisciplines = [...currentDisciplines, disciplineValue]
  }
  
  updateField('disciplines', newDisciplines)
}
</script>

<template>
  <div class="space-y-8">

    <!-- Sección Información Básica -->
    <div class="group relative p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
      <!-- Glassmorphism background -->
      <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-white/20 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl"></div>
      
      <!-- Border with gradient -->
      <div class="absolute inset-0 rounded-3xl border border-gray-300/50 dark:border-gray-600/50 group-hover:border-blue-400/60 transition-all duration-500"></div>
      
      <!-- Hover glow effect -->
      <div class="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-400/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
      
      <!-- Content -->
      <div class="relative z-20 space-y-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ t('flights.form.sections.basic') }}
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Fecha de grabación -->
          <div class="group/field relative p-4 rounded-xl bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                  <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ t('flights.form.recordedAt') }}
                </h4>
              </div>
              
              <BaseInput
                :model-value="modelValue.recordedAt"
                @update:model-value="updateField('recordedAt', $event)"
                type="date"
                class="w-full"
              />
            </div>
          </div>

          <!-- Visibilidad -->
          <div class="group/field relative p-4 rounded-xl bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
            <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                  <svg class="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ t('flights.form.visibility') }}
                </h4>
              </div>
              
              <BaseSelect
                :model-value="modelValue.visibility"
                @update:model-value="updateField('visibility', $event)"
                :label="t('flights.form.visibility')"
                :options="visibilityOptions"
                :placeholder="t('flights.form.selectVisibility')"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div class="group/field relative p-4 rounded-xl bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                <svg class="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ t('flights.form.description') }}
              </h4>
            </div>
            
            <BaseInput
              :model-value="modelValue.description"
              @update:model-value="updateField('description', $event)"
              type="textarea"
              :placeholder="t('flights.form.descriptionPlaceholder')"
              class="w-full"
            />
          </div>
        </div>
      </div>
      
      <!-- Glass reflection -->
      <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl opacity-60"></div>
    </div>

    <!-- Sección Categorías -->
    <div class="group relative p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
      <!-- Glassmorphism background -->
      <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-white/20 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl"></div>
      
      <!-- Border with gradient -->
      <div class="absolute inset-0 rounded-3xl border border-gray-300/50 dark:border-gray-600/50 group-hover:border-purple-400/60 transition-all duration-500"></div>
      
      <!-- Hover glow effect -->
      <div class="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-400/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
      
      <!-- Content -->
      <div class="relative z-20 space-y-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ t('flights.form.sections.categories') }}
          </h3>
        </div>

        <!-- Disciplines -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('flights.form.disciplines') }}
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <label 
              v-for="discipline in disciplineOptions" 
              :key="discipline.value"
              class="group/discipline relative flex items-center p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
              :class="(modelValue.disciplines || []).includes(discipline.value) ? 'bg-gradient-to-br from-primary-50/80 to-primary-100/80 dark:from-primary-900/30 dark:to-primary-800/30 border-primary-300/60 shadow-primary-500/20' : 'hover:bg-gradient-to-br hover:from-gray-50/80 hover:to-gray-100/80 dark:hover:from-gray-800/30 dark:hover:to-gray-700/30'"
              @click="updateDisciplines(discipline.value)"
            >
              <div class="flex items-center space-x-3">
                <div :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
                  (modelValue.disciplines || []).includes(discipline.value) 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'border-gray-300 dark:border-gray-600 group-hover/discipline:border-primary-400'
                ]">
                  <svg v-if="(modelValue.disciplines || []).includes(discipline.value)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ discipline.label }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Featured -->
        <div class="flex items-center p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:bg-gradient-to-br hover:from-yellow-50/80 hover:to-yellow-100/80 dark:hover:from-yellow-900/20 dark:hover:to-yellow-800/20 cursor-pointer"
             @click="updateField('featured', !modelValue.featured)">
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
              modelValue.featured 
                ? 'bg-yellow-500 border-yellow-500' 
                : 'border-gray-300 dark:border-gray-600 hover:border-yellow-400'
            ]">
              <svg v-if="modelValue.featured" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {{ t('flights.form.featured') }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Glass reflection -->
      <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl opacity-60"></div>
    </div>
  </div>
</template>