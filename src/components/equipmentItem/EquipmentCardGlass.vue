<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CardGlassBase from '../base/CardGlassBase.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray'].includes(value)
  }
})

const emit = defineEmits(['edit', 'delete', 'toggleFavorite', 'view'])
const { t } = useI18n()

const formattedPrice = computed(() => {
  if (!props.item.price) return null
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(props.item.price)
})

const subtitle = computed(() => {
  return [props.item.brand, props.item.model].filter(Boolean).join(' ')
})

const typeIcon = computed(() => {
  const icons = {
    DRONE: '🚁',
    RADIO: '🎮',
    GOGGLES: '🥽',
    BATTERY: '🔋',
    CHARGER: '🔌',
    OTHERS: '📦'
  }
  return icons[props.item.type] || '📋'
})

const conditionColor = computed(() => {
  const colors = {
    NEW: 'bg-green-400',
    LIKE_NEW: 'bg-blue-400',
    GOOD: 'bg-yellow-400',
    FAIR: 'bg-orange-400',
    POOR: 'bg-red-400'
  }
  return colors[props.item.condition] || 'bg-gray-400'
})

const handleEdit = () => {
  emit('edit', props.item)
}

const handleDelete = () => {
  emit('delete', props.item)
}

const handleToggleFavorite = () => {
  emit('toggleFavorite', props.item)
}

const handleView = () => {
  emit('view', props.item)
}
</script>

<template>
  <CardGlassBase
    :title="item.name"
    :subtitle="subtitle"
    :image="item.image"
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
  >
    <!-- Slot para iconos informativos -->
    <template #info-icons>
      <!-- Icono de condición -->
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm border border-white/20">
        <div :class="`w-3 h-3 rounded-full ${conditionColor}`"></div>
      </div>

      <!-- Icono de precio -->
      <div v-if="formattedPrice" class="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm border border-white/20">
        <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
        </svg>
      </div>

      <!-- Icono de favorito -->
      <button
        @click.stop="handleToggleFavorite"
        class="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 transition-all duration-200"
        :class="{ 'text-yellow-400': item.favorite, 'text-white/60': !item.favorite }"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </button>
    </template>
  </CardGlassBase>
</template>