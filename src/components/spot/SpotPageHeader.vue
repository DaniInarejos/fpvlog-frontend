<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'green'
  }
})

const emit = defineEmits(['create', 'login'])

const { t } = useI18n()

const colorClasses = computed(() => {
  const colors = {
    blue: {
      gradient: 'from-blue-500/80 via-blue-600/70 to-blue-700/80',
      pattern: 'text-blue-300/30',
      dots: 'bg-blue-200/60',
      accent: 'bg-blue-300/50',
      button: 'bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50'
    },
    green: {
      gradient: 'from-green-500/80 via-green-600/70 to-green-700/80',
      pattern: 'text-green-300/30',
      dots: 'bg-green-200/60',
      accent: 'bg-green-300/50',
      button: 'bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50'
    },
    purple: {
      gradient: 'from-purple-500/80 via-purple-600/70 to-purple-700/80',
      pattern: 'text-purple-300/30',
      dots: 'bg-purple-200/60',
      accent: 'bg-purple-300/50',
      button: 'bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50'
    }
  }
  return colors[props.color] || colors.green
})

const icon = computed(() => '📍')

const computedButtonText = computed(() => {
  if (props.isAuthenticated) {
    return t('spots.addSpot')
  }
  return t('auth.loginToManage')
})

const handleCreate = () => {
  if (props.isAuthenticated) {
    emit('create')
  } else {
    emit('login')
  }
}
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl p-8 text-white backdrop-blur-md border border-white/20 shadow-2xl">
    <!-- Glassmorphism background -->
    <div :class="`absolute inset-0 bg-gradient-to-br ${colorClasses.gradient} opacity-90`"></div>
    <div class="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
    
    <!-- Patrón de fondo con glassmorphism -->
    <div class="absolute inset-0 opacity-20">
      <div :class="`absolute inset-0 ${colorClasses.pattern}`" style="background-image: radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px); background-size: 24px 24px;"></div>
    </div>
    
    <!-- Elementos flotantes animados con glassmorphism -->
    <div class="absolute top-4 right-4 animate-bounce">
      <div class="w-3 h-3 bg-white/60 rounded-full backdrop-blur-sm shadow-lg"></div>
    </div>
    <div class="absolute top-12 right-12 animate-pulse">
      <div :class="`w-2 h-2 ${colorClasses.dots} rounded-full backdrop-blur-sm shadow-md`"></div>
    </div>
    <div class="absolute bottom-8 right-8 animate-bounce" style="animation-delay: 1s;">
      <div :class="`w-4 h-4 ${colorClasses.accent} rounded-full opacity-40 backdrop-blur-sm shadow-lg`"></div>
    </div>

    <!-- Glassmorphism overlay adicional -->
    <div class="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5"></div>

    <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <!-- Título y descripción -->
      <div class="mb-6 lg:mb-0">
        <div class="flex items-center space-x-3 mb-2">
          <div class="text-4xl animate-pulse drop-shadow-lg backdrop-blur-sm bg-white/10 rounded-xl p-2">
            {{ icon }}
          </div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
            {{ title }}
          </h1>
        </div>
        <p class="text-white/90 text-lg max-w-2xl drop-shadow-lg backdrop-blur-sm bg-white/10 rounded-lg px-4 py-2 border border-white/20">
          {{ description }}
        </p>
      </div>

      <!-- Botón de acción -->
      <div class="flex flex-col items-end space-y-4">
        <BaseButton
          @click="handleCreate"
          :class="`${colorClasses.button} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl font-semibold backdrop-blur-sm border border-white/30`"
        >
          <div class="flex items-center space-x-2">
            <span class="text-xl">{{ isAuthenticated ? '➕' : '🔐' }}</span>
            <span>{{ computedButtonText }}</span>
          </div>
        </BaseButton>
      </div>
    </div>

    <!-- Efecto de brillo glassmorphism -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>
  </div>
</template>