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
  icon: {
    type: String,
    default: '🛠️'
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray'].includes(value)
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  selectedType: {
    type: String,
    default: 'ALL'
  },
  buttonText: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['create', 'login'])
const { t } = useI18n()

const colorClasses = computed(() => {
  const colors = {
    blue: {
      gradient: 'from-blue-600 via-blue-700 to-indigo-800',
      button: 'bg-white text-blue-700 hover:bg-blue-50',
      pattern: 'bg-white/10',
      dots: 'bg-blue-300',
      accent: 'bg-indigo-300'
    },
    green: {
      gradient: 'from-green-600 via-green-700 to-emerald-800',
      button: 'bg-white text-green-700 hover:bg-green-50',
      pattern: 'bg-white/10',
      dots: 'bg-green-300',
      accent: 'bg-emerald-300'
    },
    purple: {
      gradient: 'from-purple-600 via-purple-700 to-violet-800',
      button: 'bg-white text-purple-700 hover:bg-purple-50',
      pattern: 'bg-white/10',
      dots: 'bg-purple-300',
      accent: 'bg-violet-300'
    },
    red: {
      gradient: 'from-red-600 via-red-700 to-rose-800',
      button: 'bg-white text-red-700 hover:bg-red-50',
      pattern: 'bg-white/10',
      dots: 'bg-red-300',
      accent: 'bg-rose-300'
    },
    yellow: {
      gradient: 'from-yellow-600 via-yellow-700 to-amber-800',
      button: 'bg-white text-yellow-700 hover:bg-yellow-50',
      pattern: 'bg-white/10',
      dots: 'bg-yellow-300',
      accent: 'bg-amber-300'
    },
    indigo: {
      gradient: 'from-indigo-600 via-indigo-700 to-blue-800',
      button: 'bg-white text-indigo-700 hover:bg-indigo-50',
      pattern: 'bg-white/10',
      dots: 'bg-indigo-300',
      accent: 'bg-blue-300'
    },
    pink: {
      gradient: 'from-pink-600 via-pink-700 to-rose-800',
      button: 'bg-white text-pink-700 hover:bg-pink-50',
      pattern: 'bg-white/10',
      dots: 'bg-pink-300',
      accent: 'bg-rose-300'
    },
    gray: {
      gradient: 'from-gray-600 via-gray-700 to-slate-800',
      button: 'bg-white text-gray-700 hover:bg-gray-50',
      pattern: 'bg-white/10',
      dots: 'bg-gray-300',
      accent: 'bg-slate-300'
    }
  }
  return colors[props.color] || colors.blue
})

const computedButtonText = computed(() => {
  if (props.buttonText) return props.buttonText
  
  if (props.isAuthenticated) {
    if (props.selectedType && props.selectedType !== 'ALL') {
      return t('equipmentItems.addItem', { type: t(`equipmentItems.types.${props.selectedType.toLowerCase()}`) })
    }
    return t('equipmentItems.addItem')
  }
  return t('auth.loginToManage')
})

const handleCreate = () => {
  if (props.isAuthenticated) {
    emit('create', props.selectedType)
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