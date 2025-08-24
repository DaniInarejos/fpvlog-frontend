<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import { useI18n } from 'vue-i18n'
import componentService from '../../services/componentService'

const { t } = useI18n()

const props = defineProps({
  drone: {
    type: Object,
    required: false,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  },
  droneBrands: { // Nueva prop para recibir las marcas
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const components = ref({})
const isLoadingComponents = ref(false)

const handleClose = () => {
  emit('close')
}

// Computed para determinar si es un drone personalizado
const isCustomDrone = computed(() => {
  return props.drone?.originType === 'CUSTOM'
})

// Función para obtener componentes del usuario
const fetchUserComponents = async () => {
  if (!props.drone?.userId) return
  
  isLoadingComponents.value = true
  try {
    const response = await componentService.getUserComponents(props.drone.userId)
    
    // La API devuelve un objeto con componentes agrupados por tipo
    // Necesitamos aplanar todos los componentes en un solo mapa
    const componentMap = {}
    
    if (response && typeof response === 'object') {
      // Iterar sobre cada tipo de componente (FRAME, MOTOR, ESC, etc.)
      Object.values(response).forEach(componentArray => {
        if (Array.isArray(componentArray)) {
          componentArray.forEach(component => {
            if (component._id) {
              componentMap[component._id] = component
            }
          })
        }
      })
    }
    
    components.value = componentMap
  } catch (error) {
    console.error('Error fetching user components:', error)
  } finally {
    isLoadingComponents.value = false
  }
}
// Función para obtener el nombre del componente por ID
const getComponentName = (componentId) => {
  if (!componentId) return '-'
  
  // Si es un string (ID), buscar en el mapa de componentes
  if (typeof componentId === 'string') {
    const component = components.value[componentId]
    return component?.name || 'Componente no encontrado'
  }
  
  // Si es un objeto, devolver el nombre directamente
  if (typeof componentId === 'object' && componentId.name) {
    return componentId.name
  }
  
  return '-'
}

// Watcher para cargar componentes cuando se muestra el modal
watch(() => props.show, (newShow) => {
  if (newShow && isCustomDrone.value) {
    fetchUserComponents()
  }
})
// Función para resolver brandId a nombre de marca
const getBrandName = (brandId) => {
  if (!brandId || !props.droneBrands.length) return '-'
  const brand = props.droneBrands.find(b => b._id === brandId)
  return brand?.name || '-'
}
</script>

<template>
  <BaseModal
    v-if="drone && show"
    :show="show"
    :title="drone.name || ''"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Imagen del drone -->
      <div class="relative aspect-[4/3] overflow-hidden rounded-lg">
        <img
          :src="drone.image || '/images/placeholder.png'"
          :alt="drone.name || ''"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Vista para drones BRANDED -->
      <div v-if="!isCustomDrone" class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('drones.description') }}</h3>
          <dl class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('drones.form.brandName') }}</dt>
              <!-- Usar getBrandName en lugar de drone.brand?.name -->
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ getBrandName(drone.brandId) }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('drones.form.model') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ drone.model || '-' }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('drones.form.weight') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ drone.weight ? `${drone.weight}g` : '-' }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('drones.form.frame') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ drone.frameSize ? `${drone.frameSize}mm` : '-' }}</dd>
            </div>
          </dl>
        </div>

        <!-- Descripción para drones BRANDED -->
        <div v-if="drone.description">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('drones.description') }}</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ drone.description }}</p>
        </div>
      </div>

      <!-- Vista para drones CUSTOM -->
      <div v-else class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Componentes del Drone</h3>
          
          <!-- Información básica sin marca y modelo -->
          <dl class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('drones.form.weight') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ drone.weight ? `${drone.weight}g` : '-' }}</dd>
            </div>
            <div class="flex justify-between sm:block">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('drones.form.frame') }}</dt>
              <dd class="text-sm text-gray-900 dark:text-gray-100">{{ drone.frameSize ? `${drone.frameSize}mm` : '-' }}</dd>
            </div>
          </dl>
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingComponents" class="text-center py-4">
          <div class="text-sm text-gray-500 dark:text-gray-400">Cargando componentes...</div>
        </div>

        <!-- Lista de componentes sin imágenes -->
        <div v-else-if="drone.components" class="space-y-3">
          <!-- Frame -->
          <div v-if="drone.components.frameId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Frame</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ getComponentName(drone.components.frameId) }}</p>
          </div>

          <!-- Motors -->
          <div v-if="drone.components.motors && drone.components.motors.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Motores ({{ drone.components.motors.length }})</h4>
            <div class="space-y-1">
              <div v-for="(motor, index) in drone.components.motors" :key="index" class="text-sm text-gray-600 dark:text-gray-400">
                • {{ getComponentName(motor) }}
              </div>
            </div>
          </div>

          <!-- Flight Controller -->
          <div v-if="drone.components.flightControllerId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Controladora de Vuelo</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ getComponentName(drone.components.flightControllerId) }}</p>
          </div>

          <!-- ESC -->
          <div v-if="drone.components.escId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">ESC</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ getComponentName(drone.components.escId) }}</p>
          </div>

          <!-- Camera -->
          <div v-if="drone.components.cameraId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Cámara</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ getComponentName(drone.components.cameraId) }}</p>
          </div>

          <!-- VTX -->
          <div v-if="drone.components.vtxId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Transmisor de Video</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ getComponentName(drone.components.vtxId) }}</p>
          </div>

          <!-- Receiver -->
          <div v-if="drone.components.receiverId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Receptor</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ getComponentName(drone.components.receiverId) }}</p>
          </div>

          <!-- Antenna -->
          <div v-if="drone.components.antennaId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Antena</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ getComponentName(drone.components.antennaId) }}</p>
          </div>

          <!-- Battery -->
          <div v-if="drone.components.batteryId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Batería</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ getComponentName(drone.components.batteryId) }}</p>
          </div>

          <!-- Props -->
          <div v-if="drone.components.propsId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Hélices</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ getComponentName(drone.components.propsId) }}</p>
          </div>

          <!-- Mount -->
          <div v-if="drone.components.mountId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Soporte</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ getComponentName(drone.components.mountId) }}</p>
          </div>

          <!-- Others -->
          <div v-if="drone.components.others && drone.components.others.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Otros ({{ drone.components.others.length }})</h4>
            <div class="space-y-1">
              <div v-for="(other, index) in drone.components.others" :key="index" class="text-sm text-gray-600 dark:text-gray-400">
                • {{ getComponentName(other) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Descripción para drones CUSTOM -->
        <div v-if="drone.description">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Descripción</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ drone.description }}</p>
        </div>
      </div>

      <!-- Estadísticas (común para ambos tipos) -->
      <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {{ drone.likesCount || 0 }} {{ t('common.likes') }}
        </div>
      </div>
    </div>
  </BaseModal>
</template>
