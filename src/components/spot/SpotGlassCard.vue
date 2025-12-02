<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CardGlassBase from '../base/CardGlassBase.vue'

const props = defineProps({
  spot: {
    type: Object,
    required: true
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'green',
    validator: (value) => ['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray'].includes(value)
  }
})

const emit = defineEmits(['edit', 'delete', 'view', 'show-info'])
const { t } = useI18n()

const subtitle = computed(() => {
  const parts = []
  if (props.spot.city) parts.push(props.spot.city)
  if (props.spot.country) parts.push(props.spot.country)
  return parts.join(', ')
})

const mapImageUrl = computed(() => {
  if (!props.spot.location?.coordinates) return null
  
  const [lng, lat] = props.spot.location.coordinates
  const zoom = 15
  const size = '400x200'
  const mapType = 'satellite'
  
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=${mapType}&markers=color:red%7C${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
})

const difficultyColor = computed(() => {
  const colors = {
    EASY: 'bg-green-400',
    MEDIUM: 'bg-yellow-400',
    HARD: 'bg-orange-400',
    EXPERT: 'bg-red-400'
  }
  return colors[props.spot.difficulty] || 'bg-gray-400'
})

const typeIcon = computed(() => {
  const icons = {
    MOUNTAIN: '🏔️',
    BEACH: '🏖️',
    FOREST: '🌲',
    URBAN: '🏙️',
    FIELD: '🌾',
    DESERT: '🏜️',
    LAKE: '🏞️',
    RIVER: '🏞️',
    OTHER: '📍'
  }
  return icons[props.spot.type] || '📍'
})

const handleEdit = () => {
  emit('edit', props.spot)
}

const handleDelete = () => {
  emit('delete', props.spot)
}

const handleView = () => {
  emit('view', props.spot)
}

const handleShowInfo = () => {
  emit('show-info', props.spot)
}
</script>

<template>
  <CardGlassBase
    :title="spot.name"
    :subtitle="subtitle"
    :image="mapImageUrl"
    :fallback-icon="typeIcon"
    :is-authenticated="isAuthenticated"
    :show-edit-button="true"
    :show-delete-button="true"
    edit-button-color="green"
    delete-button-color="red"
    edit-icon="✏️"
    delete-icon="🗑️"
    @edit="handleEdit"
    @delete="handleDelete"
    @view="handleView"
    @click="handleShowInfo"
  >
    <!-- Slot para iconos informativos -->
    <template #info-icons>
      <!-- Icono de dificultad -->
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm border border-white/20">
        <div :class="`w-3 h-3 rounded-full ${difficultyColor}`"></div>
      </div>

      <!-- Icono de coordenadas -->
      <div v-if="spot.location?.coordinates" class="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm border border-white/20">
        <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
      </div>

      <!-- Icono de favorito -->
      <button
        @click.stop="$emit('toggle-favorite', spot)"
        class="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 transition-all duration-200"
        :class="{ 'text-yellow-400': spot.favorite, 'text-white/60': !spot.favorite }"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </button>
    </template>

    <!-- Slot para información adicional en la parte inferior -->
    <template #footer>
      <div class="flex items-center justify-between text-xs text-white/80">
        <div class="flex items-center space-x-2">
          <span class="px-2 py-1 bg-black/20 rounded-full backdrop-blur-sm border border-white/20">
            {{ t(`spots.types.${spot.type?.toLowerCase()}`) }}
          </span>
          <span class="px-2 py-1 bg-black/20 rounded-full backdrop-blur-sm border border-white/20">
            {{ t(`spots.difficulty.${spot.difficulty?.toLowerCase()}`) }}
          </span>
        </div>
        <div v-if="spot.location?.coordinates" class="text-white/60">
          {{ spot.location.coordinates[1].toFixed(4) }}, {{ spot.location.coordinates[0].toFixed(4) }}
        </div>
      </div>
    </template>
  </CardGlassBase>
</template>