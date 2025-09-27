<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSelect from '../base/BaseSelect.vue'
import BaseButton from '../base/BaseButton.vue'
import { useEquipmentItemStore } from '../../stores/equipmentItem'

const { t } = useI18n()
const equipmentItemStore = useEquipmentItemStore()

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  spots: {
    type: Array,
    default: () => []
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const isLoadingEquipment = ref(false)

const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

// Transformar spots al formato esperado por BaseSelect
const spotOptions = computed(() => 
  props.spots.map(spot => ({ _id: spot._id, name: spot.name }))
)

// Obtener equipos del store y transformarlos
const equipmentOptions = computed(() => {
  const allItems = equipmentItemStore.allItems || []
  return allItems.map(item => ({
    _id: item._id,
    name: `${getTypeIcon(item.type)} ${item.name}`,
    type: item.type,
    originalName: item.name
  }))
})

// Equipos seleccionados
const selectedEquipmentIds = computed({
  get: () => props.modelValue.equipmentItems || [],
  set: (value) => updateField('equipmentItems', value)
})

// Iconos por tipo de equipo
const getTypeIcon = (type) => {
  const icons = {
    DRONE: '🚁',
    RADIO: '🎮',
    GOGGLES: '🥽',
    BATTERY: '🔋',
    CHARGER: '🔌',
    OTHERS: '📋'
  }
  return icons[type] || '📋'
}

// Colores por tipo de equipo
const getTypeColorClasses = (type) => {
  const colorMap = {
    DRONE: 'from-blue-400/20 to-blue-500/20 border-blue-400/30 text-blue-700 dark:text-blue-300',
    RADIO: 'from-green-400/20 to-green-500/20 border-green-400/30 text-green-700 dark:text-green-300',
    GOGGLES: 'from-purple-400/20 to-purple-500/20 border-purple-400/30 text-purple-700 dark:text-purple-300',
    BATTERY: 'from-yellow-400/20 to-yellow-500/20 border-yellow-400/30 text-yellow-700 dark:text-yellow-300',
    CHARGER: 'from-red-400/20 to-red-500/20 border-red-400/30 text-red-700 dark:text-red-300',
    OTHERS: 'from-indigo-400/20 to-indigo-500/20 border-indigo-400/30 text-indigo-700 dark:text-indigo-300'
  }
  return colorMap[type] || colorMap.OTHERS
}

// Manejar selección/deselección de equipos
const toggleEquipment = (equipmentId) => {
  const currentIds = selectedEquipmentIds.value
  let newIds
  
  if (currentIds.includes(equipmentId)) {
    newIds = currentIds.filter(id => id !== equipmentId)
  } else {
    newIds = [...currentIds, equipmentId]
  }
  
  selectedEquipmentIds.value = newIds
}

// Obtener equipo por ID
const getEquipmentById = (id) => {
  return equipmentOptions.value.find(item => item._id === id)
}

// Cargar equipos al montar el componente
onMounted(async () => {
  if (equipmentOptions.value.length === 0) {
    isLoadingEquipment.value = true
    try {
      await equipmentItemStore.fetchEquipmentItems()
    } catch (error) {
      console.error('Error loading equipment items:', error)
    } finally {
      isLoadingEquipment.value = false
    }
  }
})
</script>

<template>
  <div class="space-y-8">

    <!-- Selección de Spot -->
    <div class="group relative p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
      <!-- Glassmorphism background -->
      <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-white/20 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl"></div>
      
      <!-- Border with gradient -->
      <div class="absolute inset-0 rounded-3xl border border-gray-300/50 dark:border-gray-600/50 group-hover:border-green-400/60 transition-all duration-500"></div>
      
      <!-- Hover glow effect -->
      <div class="absolute -inset-1 rounded-3xl bg-gradient-to-r from-green-400/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
      
      <!-- Content -->
      <div class="relative z-20 space-y-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ t('flights.form.spot') }}
          </h3>
        </div>

        <div class="group/field relative p-4 rounded-xl bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
          <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative z-10">
            <BaseSelect
              :model-value="modelValue.spotId"
              @update:model-value="updateField('spotId', $event)"
              :label="t('spots.spot')"
              :options="spotOptions"
              :placeholder="t('flights.form.spotPlaceholder')"
              :error="errors.spotId"
              class="w-full"
            />
          </div>
        </div>
      </div>
      
      <!-- Glass reflection -->
      <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl opacity-60"></div>
    </div>

    <!-- Selección de Equipos -->
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ t('flights.form.equipment') }}
          </h3>
          <div class="ml-auto">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ selectedEquipmentIds.length }} {{ t('flights.form.equipmentSelected') }}
            </span>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingEquipment" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ t('common.loading') }}</p>
        </div>

        <!-- Equipment grid -->
        <div v-else-if="equipmentOptions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="equipment in equipmentOptions"
            :key="equipment._id"
            class="group/equipment relative p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
            :class="[
              'bg-gradient-to-br backdrop-blur-xl border',
              selectedEquipmentIds.includes(equipment._id)
                ? `${getTypeColorClasses(equipment.type)} shadow-lg`
                : 'bg-gradient-to-br from-white/60 via-white/30 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/60'
            ]"
            @click="toggleEquipment(equipment._id)"
          >
            <div class="flex items-center space-x-3">
              <!-- Checkbox visual -->
              <div :class="[
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
                selectedEquipmentIds.includes(equipment._id)
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-300 dark:border-gray-600 group-hover/equipment:border-blue-400'
              ]">
                <svg v-if="selectedEquipmentIds.includes(equipment._id)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              
              <!-- Equipment info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ equipment.originalName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ t(`equipmentItems.types.${equipment.type.toLowerCase()}`) }}
                </p>
              </div>
              
              <!-- Type icon -->
              <div class="text-lg">
                {{ getTypeIcon(equipment.type) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <div class="text-4xl mb-4">📦</div>
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {{ t('flights.form.noEquipment') }}
          </h4>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ t('flights.form.noEquipmentDescription') }}
          </p>
          <BaseButton
            variant="secondary"
            @click="$router.push('/equipment-items')"
            class="mx-auto"
          >
            {{ t('flights.form.addEquipment') }}
          </BaseButton>
        </div>

        <!-- Selected equipment summary -->
        <div v-if="selectedEquipmentIds.length > 0" class="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/50">
          <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
            {{ t('flights.form.selectedEquipment') }} ({{ selectedEquipmentIds.length }})
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="equipmentId in selectedEquipmentIds"
              :key="equipmentId"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 border border-blue-200 dark:border-blue-700"
            >
              {{ getEquipmentById(equipmentId)?.originalName || 'Unknown' }}
              <button
                @click.stop="toggleEquipment(equipmentId)"
                class="ml-1 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5 transition-colors"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </span>
          </div>
        </div>
      </div>
      
      <!-- Glass reflection -->
      <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl opacity-60"></div>
    </div>
  </div>
</template>