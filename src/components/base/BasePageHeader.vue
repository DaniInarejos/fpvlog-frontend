<script setup>
import { computed } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '📋'
  },
  stats: {
    type: Array,
    default: () => []
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  showCreateButton: {
    type: Boolean,
    default: true
  },
  createButtonText: {
    type: String,
    default: 'Crear'
  },
  loginButtonText: {
    type: String,
    default: 'Iniciar Sesión'
  },
  themeColor: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'orange', 'purple', 'green', 'red', 'indigo'].includes(value)
  }
})

const emit = defineEmits(['create', 'login', 'stat-click'])

const themeClasses = computed(() => {
  const themes = {
    blue: {
      gradient: 'from-slate-50/95 via-blue-50/90 to-indigo-50/85 dark:from-slate-900/95 dark:via-blue-950/90 dark:to-indigo-950/85',
      accent: 'from-blue-500/8 via-indigo-500/6 to-purple-500/8',
      text: 'text-slate-700 dark:text-slate-300',
      button: 'text-blue-700 hover:bg-blue-100/80 dark:text-blue-300 dark:hover:bg-blue-900/40',
      buttonAlt: 'border-blue-200/60 hover:bg-blue-500/15 hover:border-blue-300/80 dark:border-blue-700/60 dark:hover:bg-blue-500/20'
    },
    orange: {
      gradient: 'from-orange-50/95 via-amber-50/90 to-yellow-50/85 dark:from-orange-950/95 dark:via-amber-950/90 dark:to-yellow-950/85',
      accent: 'from-orange-500/8 via-amber-500/6 to-red-500/8',
      text: 'text-orange-800 dark:text-orange-200',
      button: 'text-orange-700 hover:bg-orange-100/80 dark:text-orange-300 dark:hover:bg-orange-900/40',
      buttonAlt: 'border-orange-200/60 hover:bg-orange-500/15 hover:border-orange-300/80 dark:border-orange-700/60 dark:hover:bg-orange-500/20'
    },
    purple: {
      gradient: 'from-purple-50/95 via-violet-50/90 to-indigo-50/85 dark:from-purple-950/95 dark:via-violet-950/90 dark:to-indigo-950/85',
      accent: 'from-purple-500/8 via-violet-500/6 to-pink-500/8',
      text: 'text-purple-800 dark:text-purple-200',
      button: 'text-purple-700 hover:bg-purple-100/80 dark:text-purple-300 dark:hover:bg-purple-900/40',
      buttonAlt: 'border-purple-200/60 hover:bg-purple-500/15 hover:border-purple-300/80 dark:border-purple-700/60 dark:hover:bg-purple-500/20'
    },
    green: {
      gradient: 'from-green-50/95 via-emerald-50/90 to-teal-50/85 dark:from-green-950/95 dark:via-emerald-950/90 dark:to-teal-950/85',
      accent: 'from-green-500/8 via-emerald-500/6 to-teal-500/8',
      text: 'text-green-800 dark:text-green-200',
      button: 'text-green-700 hover:bg-green-100/80 dark:text-green-300 dark:hover:bg-green-900/40',
      buttonAlt: 'border-green-200/60 hover:bg-green-500/15 hover:border-green-300/80 dark:border-green-700/60 dark:hover:bg-green-500/20'
    },
    red: {
      gradient: 'from-red-50/95 via-rose-50/90 to-pink-50/85 dark:from-red-950/95 dark:via-rose-950/90 dark:to-pink-950/85',
      accent: 'from-red-500/8 via-rose-500/6 to-pink-500/8',
      text: 'text-red-800 dark:text-red-200',
      button: 'text-red-700 hover:bg-red-100/80 dark:text-red-300 dark:hover:bg-red-900/40',
      buttonAlt: 'border-red-200/60 hover:bg-red-500/15 hover:border-red-300/80 dark:border-red-700/60 dark:hover:bg-red-500/20'
    },
    indigo: {
      gradient: 'from-indigo-50/95 via-blue-50/90 to-purple-50/85 dark:from-indigo-950/95 dark:via-blue-950/90 dark:to-purple-950/85',
      accent: 'from-indigo-500/8 via-blue-500/6 to-purple-500/8',
      text: 'text-indigo-800 dark:text-indigo-200',
      button: 'text-indigo-700 hover:bg-indigo-100/80 dark:text-indigo-300 dark:hover:bg-indigo-900/40',
      buttonAlt: 'border-indigo-200/60 hover:bg-indigo-500/15 hover:border-indigo-300/80 dark:border-indigo-700/60 dark:hover:bg-indigo-500/20'
    }
  }
  return themes[props.themeColor] || themes.blue
})

const handleCreate = () => {
  emit('create')
}

const handleLogin = () => {
  emit('login')
}

const handleStatClick = (stat) => {
  emit('stat-click', stat)
}
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/20">
    <!-- Subtle Background with Integration -->
    <div :class="[
      'absolute inset-0 bg-gradient-to-br',
      themeClasses.gradient
    ]"></div>
    
    <!-- Organic Shapes -->
     <div class="absolute inset-0 overflow-hidden">
       <!-- Efecto de Burbujas -->
       <div class="absolute inset-0">
         <!-- Burbujas grandes -->
         <div :class="[
           'absolute top-16 right-20 w-20 h-20 rounded-full blur-sm opacity-20 animate-bubble-1',
           'bg-gradient-to-br',
           themeClasses.accent
         ]"></div>
         <div :class="[
           'absolute top-32 left-16 w-16 h-16 rounded-full blur-sm opacity-25 animate-bubble-2',
           'bg-gradient-to-tr',
           themeClasses.accent
         ]"></div>
         <div :class="[
           'absolute bottom-20 right-32 w-12 h-12 rounded-full blur-sm opacity-30 animate-bubble-3',
           'bg-gradient-to-bl',
           themeClasses.accent
         ]"></div>
         
         <!-- Burbujas medianas -->
         <div :class="[
           'absolute top-24 left-1/3 w-8 h-8 rounded-full blur-xs opacity-35 animate-bubble-4',
           'bg-gradient-to-r',
           themeClasses.accent
         ]"></div>
         <div :class="[
           'absolute bottom-32 left-20 w-10 h-10 rounded-full blur-xs opacity-25 animate-bubble-5',
           'bg-gradient-to-l',
           themeClasses.accent
         ]"></div>
         <div :class="[
           'absolute top-40 right-1/4 w-6 h-6 rounded-full blur-xs opacity-40 animate-bubble-6',
           'bg-gradient-to-t',
           themeClasses.accent
         ]"></div>
         
         <!-- Burbujas pequeñas -->
         <div :class="[
           'absolute top-12 left-1/2 w-4 h-4 rounded-full opacity-45 animate-bubble-7',
           'bg-gradient-to-br',
           themeClasses.accent
         ]"></div>
         <div :class="[
           'absolute bottom-16 right-1/3 w-3 h-3 rounded-full opacity-50 animate-bubble-8',
           'bg-gradient-to-tl',
           themeClasses.accent
         ]"></div>
       </div>
       
       <!-- Geometric Patterns -->
       <div class="absolute top-0 right-0 w-64 h-64 opacity-5">
         <svg viewBox="0 0 100 100" class="w-full h-full">
           <defs>
             <pattern id="hexagons" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
               <polygon points="10,2 18,7 18,13 10,18 2,13 2,7" fill="none" stroke="currentColor" stroke-width="0.5"/>
             </pattern>
           </defs>
           <rect width="100" height="100" fill="url(#hexagons)"/>
         </svg>
       </div>
     </div>
    
    <!-- Sophisticated Glass Effect -->
    <div class="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl"></div>
    
    <!-- Subtle Inner Glow -->
    <div class="absolute inset-0 rounded-3xl shadow-inner shadow-white/10"></div>
    
    <div class="relative container mx-auto px-4 py-20 rounded-3xl">
      <div class="text-center space-y-8">
        <!-- Icono y título con efectos glass -->
        <div class="space-y-6">
          <div class="flex justify-center">
            <div class="relative group">
              <!-- Icon Background with Organic Shape -->
              <div class="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg transform group-hover:scale-105 transition-all duration-500"></div>
              <div class="relative p-6">
                <slot name="icon">
                  <div :class="['w-16 h-16 mx-auto', themeClasses.text]">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.08-.64 3-1.22.92.58 1.91 1.01 3 1.22 5.16-1 9-5.45 9-11V7l-10-5z"/>
                    </svg>
                  </div>
                </slot>
              </div>
              <!-- Subtle Glow Effect -->
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          
          <!-- Title with Enhanced Typography -->
          <div class="space-y-3">
            <h1 :class="['text-5xl font-bold tracking-tight', themeClasses.text]">
              <slot name="title">{{ title }}</slot>
            </h1>
            <div class="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-current to-transparent opacity-30 rounded-full"></div>
          </div>
          
          <slot name="description">
            <p v-if="description" :class="['text-lg opacity-90 max-w-2xl mx-auto leading-relaxed', themeClasses.text]">
              {{ description }}
            </p>
          </slot>
        </div>
        
        <!-- Enhanced Statistics with Organic Cards -->
        <div v-if="stats && stats.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="group cursor-pointer"
            @click="$emit('stat-click', stat)"
          >
            <div class="relative overflow-hidden rounded-2xl">
              <!-- Card Background -->
              <div class="absolute inset-0 bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl"></div>
              
              <!-- Hover Effects -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>
              <div class="absolute inset-0 ring-1 ring-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>
              
              <!-- Content -->
              <div class="relative p-6 text-center transform group-hover:scale-105 transition-all duration-500">
                <div :class="['text-3xl font-bold mb-2', themeClasses.text]">{{ stat.value }}</div>
                <div :class="['text-sm opacity-80', themeClasses.text]">{{ stat.label }}</div>
              </div>
              
              <!-- Subtle Animation -->
              <div class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
            </div>
          </div>
        </div>

        <!-- Solo botón de Añadir Elementos -->
        <div v-if="isAuthenticated" class="flex justify-center">
          <button
            @click="$emit('create')"
            :class="[
              'group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500',
              'bg-white/15 backdrop-blur-xl border border-white/25',
              'hover:bg-white/20 hover:border-white/35 hover:shadow-2xl hover:shadow-white/15',
              'transform hover:scale-105 hover:-translate-y-1',
              themeClasses.text
            ]"
          >
            <!-- Enhanced Button Effects -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="absolute inset-0 rounded-2xl ring-2 ring-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Pulse Effect -->
            <div class="absolute inset-0 rounded-2xl bg-white/5 animate-pulse opacity-0 group-hover:opacity-100"></div>
            
            <!-- Shimmer Effect Corregido -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out overflow-hidden"></div>
            
            <span class="relative z-10">{{ createButtonText }}</span>
          </button>
        </div>

        <!-- Slot adicional para contenido personalizado -->
        <slot name="additional-content"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom Animations for Bubble Effects */
@keyframes bubble-1 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  25% { transform: translateY(-15px) translateX(5px) scale(1.1); }
  50% { transform: translateY(-30px) translateX(-10px) scale(0.9); }
  75% { transform: translateY(-15px) translateX(8px) scale(1.05); }
}

@keyframes bubble-2 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  33% { transform: translateY(-20px) translateX(-8px) scale(1.15); }
  66% { transform: translateY(-10px) translateX(12px) scale(0.85); }
}

@keyframes bubble-3 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  50% { transform: translateY(-25px) translateX(-15px) scale(1.2); }
}

@keyframes bubble-4 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  40% { transform: translateY(-18px) translateX(6px) scale(0.9); }
  80% { transform: translateY(-8px) translateX(-4px) scale(1.1); }
}

@keyframes bubble-5 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  30% { transform: translateY(-12px) translateX(-7px) scale(1.05); }
  70% { transform: translateY(-22px) translateX(9px) scale(0.95); }
}

@keyframes bubble-6 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  25% { transform: translateY(-8px) translateX(3px) scale(1.1); }
  75% { transform: translateY(-16px) translateX(-5px) scale(0.9); }
}

@keyframes bubble-7 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  50% { transform: translateY(-10px) translateX(4px) scale(1.2); }
}

@keyframes bubble-8 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  60% { transform: translateY(-6px) translateX(-2px) scale(0.8); }
}

.animate-bubble-1 { animation: bubble-1 8s ease-in-out infinite; }
.animate-bubble-2 { animation: bubble-2 6s ease-in-out infinite 1s; }
.animate-bubble-3 { animation: bubble-3 10s ease-in-out infinite 2s; }
.animate-bubble-4 { animation: bubble-4 7s ease-in-out infinite 0.5s; }
.animate-bubble-5 { animation: bubble-5 9s ease-in-out infinite 1.5s; }
.animate-bubble-6 { animation: bubble-6 5s ease-in-out infinite 3s; }
.animate-bubble-7 { animation: bubble-7 4s ease-in-out infinite 2.5s; }
.animate-bubble-8 { animation: bubble-8 6s ease-in-out infinite 4s; }

/* Enhanced Glass Effects */
.backdrop-blur-xl {
  backdrop-filter: blur(16px);
}

.backdrop-blur-lg {
  backdrop-filter: blur(12px);
}

/* Subtle Hover Enhancements */
.group:hover .animate-pulse {
  animation-duration: 2s;
}

/* Blur utilities for bubbles */
.blur-xs {
  filter: blur(2px);
}
</style>