<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from '../base/BaseInput.vue'

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

// Manejar visibilidad anidada
const updateVisibility = (field, value) => {
  const currentVisibility = props.modelValue.visibility || { public: true, visibleToFollowersOnly: false }
  
  emit('update:modelValue', {
    ...props.modelValue,
    visibility: {
      ...currentVisibility,
      [field]: value
    }
  })
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
            {{ t('spots.form.sections.basic') }}
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nombre -->
          <div class="group/field relative p-4 rounded-xl bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                  <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                  </svg>
                </div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ t('spots.form.name') }}
                  <span class="text-red-500 ml-1">*</span>
                </h4>
              </div>
              
              <BaseInput
                :model-value="modelValue.name"
                @update:model-value="updateField('name', $event)"
                :placeholder="t('spots.form.namePlaceholder')"
                :error="errors.name"
                class="w-full"
              />
            </div>
          </div>

          <!-- Descripción -->
          <div class="group/field relative p-4 rounded-xl bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
            <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                  <svg class="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ t('spots.form.description') }}
                </h4>
              </div>
              
              <BaseInput
                :model-value="modelValue.description"
                @update:model-value="updateField('description', $event)"
                type="textarea"
                :placeholder="t('spots.form.descriptionPlaceholder')"
                :error="errors.description"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Glass reflection -->
      <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl opacity-60"></div>
    </div>

    <!-- Sección Privacidad -->
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ t('spots.form.sections.privacy') }}
          </h3>
        </div>

        <!-- Opciones de privacidad -->
        <div class="space-y-4">
          <!-- Público -->
          <div class="flex items-center p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:bg-gradient-to-br hover:from-green-50/80 hover:to-green-100/80 dark:hover:from-green-900/20 dark:hover:to-green-800/20 cursor-pointer"
               @click="updateVisibility('public', !modelValue.visibility?.public)">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
                modelValue.visibility?.public 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
              ]">
                <svg v-if="modelValue.visibility?.public" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ t('spots.form.public') }}
                </span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ t('spots.form.publicDescription') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Solo seguidores -->
          <div class="flex items-center p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50/80 hover:to-blue-100/80 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 cursor-pointer"
               @click="updateVisibility('visibleToFollowersOnly', !modelValue.visibility?.visibleToFollowersOnly)">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
                modelValue.visibility?.visibleToFollowersOnly 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              ]">
                <svg v-if="modelValue.visibility?.visibleToFollowersOnly" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {{ t('spots.form.visibleToFollowersOnly') }}
                </span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ t('spots.form.visibleToFollowersOnlyDescription') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Glass reflection -->
      <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl opacity-60"></div>
    </div>
  </div>
</template>