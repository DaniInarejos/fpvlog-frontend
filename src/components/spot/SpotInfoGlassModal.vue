<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StaticMap from '@/components/base/StaticMap.vue'

const props = defineProps({
  spot: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const { t } = useI18n()

// Información de ubicación
const locationInfo = computed(() => {
  if (!props.spot) return null
  
  if (props.spot.latitude && props.spot.longitude) {
    return {
      text: props.spot.location || `${props.spot.latitude.toFixed(4)}, ${props.spot.longitude.toFixed(4)}`,
      coordinates: [props.spot.longitude, props.spot.latitude]
    }
  }
  
  return {
    text: props.spot.location || t('spots.noLocation'),
    coordinates: null
  }
})

// Estado legal del spot
const spotStatus = computed(() => {
  if (!props.spot?.legalStatus) {
    return {
      icon: '❓',
      text: t('spots.legalStatus.notAnalyzed'),
      status: 'unknown'
    }
  }

  const statusMap = {
    NO_RESTRICTIONS: {
      icon: '✅',
      text: t('spots.legalStatus.noRestrictions'),
      status: 'clear'
    },
    RESTRICTED_ZONE: {
      icon: '⚠️',
      text: t('spots.legalStatus.restrictedZone'),
      status: 'restricted'
    },
    PROHIBITED_ZONE: {
      icon: '🚫',
      text: t('spots.legalStatus.prohibitedZone'),
      status: 'prohibited'
    },
    NOT_ANALYZED: {
      icon: '❓',
      text: t('spots.legalStatus.notAnalyzed'),
      status: 'unknown'
    }
  }

  return statusMap[props.spot.legalStatus] || statusMap.NOT_ANALYZED
})

// Información de visibilidad
const visibilityInfo = computed(() => {
  if (!props.spot?.visibility) {
    return {
      icon: '🌐',
      text: t('spots.public')
    }
  }

  const visibilityMap = {
    PUBLIC: {
      icon: '🌐',
      text: t('spots.public')
    },
    FOLLOWERS_ONLY: {
      icon: '👥',
      text: t('spots.followersOnly')
    },
    PRIVATE: {
      icon: '🔒',
      text: t('spots.private')
    }
  }

  return visibilityMap[props.spot.visibility] || visibilityMap.PUBLIC
})

// Descripción del estado de restricción
const getStatusDescription = () => {
  if (!props.spot?.legalStatus) return null
  
  const descriptions = {
    RESTRICTED_ZONE: t('spots.legalStatus.restrictedZoneDescription'),
    PROHIBITED_ZONE: t('spots.legalStatus.prohibitedZoneDescription'),
    NOT_ANALYZED: t('spots.legalStatus.notAnalyzedDescription')
  }
  
  return descriptions[props.spot.legalStatus] || null
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show && spot"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="$emit('close')"
      >
        <!-- Backdrop con blur -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div
          class="relative w-full max-w-6xl max-h-[90vh] overflow-hidden"
          @click.stop
        >
          <!-- Glass container -->
          <div class="bg-gradient-to-br from-white/95 via-white/90 to-white/80 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            
            <!-- Close button -->
          <button
            @click="$emit('close')"
            class="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

            <!-- Content -->
            <div class="flex flex-col lg:flex-row max-h-[90vh] overflow-hidden">
              
              <!-- Map section -->
              <div class="lg:w-1/2 relative">
                <div v-if="locationInfo?.coordinates?.length === 2" class="h-64 lg:h-full">
                  <StaticMap 
                    :coordinates="locationInfo.coordinates" 
                    :spot-id="spot._id" 
                    :show-aeronautical-zones="true"
                    class="w-full h-full"
                  />
                  <!-- Gradient overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/10"></div>
                </div>
                <div v-else class="h-64 lg:h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p class="text-gray-500 dark:text-gray-400 text-lg">{{ t('spots.noLocation') }}</p>
                  </div>
                </div>
              </div>

              <!-- Info section -->
              <div class="lg:w-1/2 p-8 overflow-y-auto">
                
                <!-- Header -->
                <div class="mb-8">
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {{ spot.name }}
                  </h1>
                  <p v-if="locationInfo?.text" class="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ locationInfo.text }}
                  </p>
                  <p v-else class="text-lg text-gray-500 dark:text-gray-500 italic">
                    {{ t('spots.noLocation') }}
                  </p>
                </div>

                <!-- Details grid -->
                <div class="space-y-6">
                  
                  <!-- Legal Status with restriction message -->
                  <div class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span>{{ spotStatus.icon }}</span>
                      {{ t('spots.form.legalStatus') }}
                    </h3>
                    <p class="text-lg text-gray-700 dark:text-gray-300 mb-2">
                      {{ spotStatus.text }}
                    </p>
                    <p v-if="getStatusDescription()" class="text-sm text-gray-600 dark:text-gray-400 italic">
                      {{ getStatusDescription() }}
                    </p>
                  </div>

                  <!-- Visibility -->
                  <div class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span>{{ visibilityInfo.icon }}</span>
                      {{ t('spots.form.visibility') }}
                    </h3>
                    <p class="text-lg text-gray-700 dark:text-gray-300">
                      {{ visibilityInfo.text }}
                    </p>
                  </div>

                  <!-- Description -->
                  <div v-if="spot.description" class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      {{ t('spots.form.description') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {{ spot.description }}
                    </p>
                  </div>

                  <!-- Coordinates -->
                  <div v-if="locationInfo?.coordinates" class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                      {{ t('spots.coordinates') }}
                    </h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span class="text-gray-500 dark:text-gray-400">Lat:</span>
                        <span class="font-mono text-gray-700 dark:text-gray-300 ml-2">{{ locationInfo.coordinates[1].toFixed(6) }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500 dark:text-gray-400">Lng:</span>
                        <span class="font-mono text-gray-700 dark:text-gray-300 ml-2">{{ locationInfo.coordinates[0].toFixed(6) }}</span>
                      </div>
                    </div>
                  </div>

                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Asegurar que el modal esté por encima de todo */
.z-50 {
  z-index: 50;
}
</style>