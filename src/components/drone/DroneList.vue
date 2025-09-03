<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../../stores/user'
import { useI18n } from 'vue-i18n'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseCard from '../base/BaseCard.vue'
import droneService from '../../services/droneService'
import DroneInfo from './DroneInfo.vue'

const props = defineProps({
  showCreateButton: {
    type: Boolean,
    default: true
  },
  droneBrands: { // Nueva prop para recibir las marcas
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'create', 'delete'])

const userStore = useUserStore()
const { t } = useI18n()
const drones = ref([])
const isLoading = ref(false)
const errors = ref({})

const fetchDrones = async () => {
  isLoading.value = true
  try {
    drones.value = await droneService.getUserDrones(userStore.user._id)
  } catch (error) {
    errors.value.fetch = error.message
  } finally {
    isLoading.value = false
  }
}

const handleEdit = (drone) => {
  emit('edit', drone)
}

const handleCreate = () => {
  emit('create')
}

const handleDelete = (drone) => {
  emit('delete', drone)
}

onMounted(() => {
  fetchDrones()
})

const showInfo = ref(false)
const selectedDroneInfo = ref(null)

const handleShowInfo = (drone) => {
  selectedDroneInfo.value = drone
  showInfo.value = true
}

const handleCloseInfo = () => {
  showInfo.value = false
  selectedDroneInfo.value = null
}

// Función para resolver brandId a nombre de marca
const getBrandName = (brandId) => {
  if (!brandId || !props.droneBrands.length) return '-'
  const brand = props.droneBrands.find(b => b._id === brandId)
  return brand?.name || '-'
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-foreground">{{ $t('drones.title') }}</h1>
      
      <BaseButton
        v-if="showCreateButton"
        @click="handleCreate"
      >
        {{ $t('drones.addDrone') }}
      </BaseButton>
    </div>

    <BaseAlert
      v-if="errors.fetch"
      type="error"
      :message="errors.fetch"
    />

    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="drones.length === 0" class="text-center py-12">
      <p class="text-muted-foreground mb-4">{{ $t('drones.noDrones') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard v-for="drone in drones" :key="drone._id" class="overflow-hidden">
        <div class="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            :src="drone.image || '/images/placeholder.png'"
            :alt="drone.name"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 
                class="text-lg font-semibold text-foreground hover:text-primary-600 cursor-pointer"
                @click="handleShowInfo(drone)"
              >
                {{ drone.name }}
              </h3>
              <!-- Usar la función getBrandName en lugar de drone.brand?.name -->
              <p class="text-sm text-muted-foreground">{{ getBrandName(drone.brandId) }} {{ drone.model }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div class="flex items-center gap-1">
              <span class="font-medium">{{ drone.weight }}g</span>
              <span class="text-muted-foreground/70">{{ $t('drones.specs.weight') }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="font-medium">{{ drone.frameSize }}mm</span>
              <span class="text-muted-foreground/70">{{ $t('drones.specs.frame') }}</span>
            </div>
          </div>

          <div class="flex items-center gap-1 text-muted-foreground/80 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {{ drone.likesCount || 0 }}
          </div>

          <div class="flex justify-end space-x-2">
            <BaseButton
              size="sm"
              variant="secondary"
              @click="handleEdit(drone)"
            >
              {{ $t('common.edit') }}
            </BaseButton>
            <BaseButton
              size="sm"
              variant="danger"
              @click="handleDelete(drone)"
            >
              {{ $t('common.delete') }}
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Pasar droneBrands al componente DroneInfo -->
    <DroneInfo
      :drone="selectedDroneInfo"
      :drone-brands="droneBrands"
      :show="showInfo"
      @close="handleCloseInfo"
    />
  </div>
</template>