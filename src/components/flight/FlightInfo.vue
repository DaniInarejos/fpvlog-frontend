<script setup>
import { defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '../base/BaseModal.vue'

const { t } = useI18n()

const props = defineProps({
  flight: {
    type: Object,
    required: false,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDuration = (duration) => {
  if (!duration) return ''
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null
  // Soporte para videos normales y shorts
  const videoId = url.match(/(?:youtube\.com\/(?:shorts\/|(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))|youtu\.be\/)([^"&?\/ ]{11})/)?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}
</script>

<template>
  <BaseModal
    v-if="flight && show"
    :show="show"
    :title="flight.title || ''"
    :show-cancel-button="false"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Video o Imagen del vuelo -->
    <div v-if="flight.videoUrl || flight.posterUrl" class="relative aspect-[4/3] overflow-hidden rounded-lg">
      <template v-if="flight.videoUrl && getYouTubeEmbedUrl(flight.videoUrl)">
        <iframe
          :src="getYouTubeEmbedUrl(flight.videoUrl)"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="w-full h-full"
        ></iframe>
      </template>
      <template v-else>
        <img
          :src="flight.posterUrl || '/images/placeholder.png'"
          :alt="flight.title"
          class="w-full h-full object-cover"
        />
      </template>
    </div>

      <!-- Información básica -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('flights.details.drone') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('flights.details.recordedAt') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(flight.recordedAt || flight.createdAt) }}</dd>
            </div>
            
            <div v-if="flight.disciplines && flight.disciplines.length > 0">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('flights.details.disciplines') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ flight.disciplines.join(', ') }}</dd>
            </div>

            <div v-if="flight.tags && flight.tags.length > 0">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('flights.details.tags') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">
                <div class="flex flex-wrap gap-1 mt-1">
                  <span 
                    v-for="tag in flight.tags" 
                    :key="tag"
                    class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('flights.details.visibility') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ t(`flights.visibility.${flight.visibility}`) }}</dd>
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div v-if="flight.description">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('flights.details.description') }}</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ flight.description }}</p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>