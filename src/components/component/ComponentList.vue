<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseModal from '../base/BaseModal.vue'

const props = defineProps({
  components: {
    type: Object,
    required: true
  },
  selectedType: {
    type: String,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['create', 'delete', 'edit', 'showInfo'])
const { t } = useI18n()
const showTypeSelector = ref(false)

const componentTypes = [
  { _id: 'FRAME', name: t('components.types.frame') },
  { _id: 'MOTOR', name: t('components.types.motor') },
  { _id: 'FC', name: t('components.types.flightController') },
  { _id: 'ESC', name: t('components.types.esc') },
  { _id: 'VTX', name: t('components.types.vtx') },
  { _id: 'CAMERA', name: t('components.types.camera') },
  { _id: 'ANTENNA', name: t('components.types.antenna') },
  { _id: 'RECEIVER', name: t('components.types.receiver') },
  { _id: 'BATTERY', name: t('components.types.battery') },
  { _id: 'PROPS', name: t('components.types.props') },
  { _id: 'MOUNT', name: t('components.types.mount') },
  { _id: 'OTHER', name: t('components.types.other') }
]

const componentIcons = {
  FRAME: '🧩', MOTOR: '⚙️', FC: '🧠', ESC: '🔌',
  VTX: '📡', CAMERA: '📷', ANTENNA: '📶', RECEIVER: '📥',
  BATTERY: '🔋', PROPS: '🪶', MOUNT: '🗜️', OTHER: '🧰'
}

const filteredComponents = computed(() => {
  if (!props.components) return []
  
  if (!props.selectedType || props.selectedType === 'ALL') {
    // If no type selected or ALL is selected, return all components in a flat array
    return Object.entries(props.components).reduce((acc, [type, components]) => {
      return acc.concat(Array.isArray(components) ? components.map(c => ({ ...c, type })) : [])
    }, [])
  }
  return Array.isArray(props.components[props.selectedType]) ? props.components[props.selectedType] : []
})

const handleTypeSelect = (typeId) => {
  emit('create', typeId)
  showTypeSelector.value = false
}

const defaultImages = {
  FRAME: '/images/frame.jpg',
  MOTOR: '/images/motor.jpg',
  FC: '/images/fc.jpg',
  ESC: '/images/esc.jpg',
  VTX: '/images/vtx.jpg',
  CAMERA: '/images/camera.jpg',
  ANTENNA: '/images/antenna.png',
  RECEIVER: '/images/receiver.jpg',
  BATTERY: '/images/baterry.jpg',
  PROPS: '/images/props.jpg',
  MOUNT: '/images/mount.jpg',
  OTHER: '/images/others.jpg'
}

const getPreviewContent = (component) => {
  return { type: 'image', url: defaultImages[component.type] }
}
</script>

<template>
  <div>


    <BaseAlert
      v-if="errors.fetch"
      type="error"
      :message="errors.fetch"
    />

    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="filteredComponents.length === 0" class="text-center py-12">
      <p class="text-muted-foreground mb-4">{{ t('components.noComponents') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard 
        v-for="component in filteredComponents" 
        :key="component._id"
        class="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 flex flex-col"
      >
        <div class="flex flex-col h-full">
          <!-- Imagen o iframe del componente -->
          <div class="relative">
            <div v-if="getPreviewContent(component)?.type === 'image'" class="aspect-video overflow-hidden">
              <img 
                :src="getPreviewContent(component).url" 
                :alt="component.name"
                class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div v-else-if="getPreviewContent(component)?.type === 'iframe'" class="aspect-video overflow-hidden">
              <iframe 
                :src="getPreviewContent(component).url"
                class="w-full h-full"
                frameborder="0"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
            </div>
          </div>

          <!-- Contenido de la tarjeta -->
          <div class="p-5 flex flex-col flex-grow">
            <!-- Encabezado -->
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <h3 
                  class="text-xl font-semibold text-foreground hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer group flex items-center"
                  @click="emit('showInfo', component)"
                >
                  <span class="text-2xl mr-2 group-hover:scale-110 transition-transform duration-200">
                    {{ componentIcons[component.type || selectedType] }}
                  </span>
                  {{ component.name }}
                </h3>
                <p class="text-sm font-medium text-muted-foreground">{{ component.brand }}</p>
              </div>
            </div>

            <!-- Detalles del componente -->
            <div class="space-y-2 flex-grow">
              <div v-if="component.weightGrams" class="flex items-center text-sm text-muted-foreground">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                </svg>
                {{ component.weightGrams }}g
              </div>

              <a 
                v-if="component.url"
                :href="component.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                {{ t('components.viewProduct') }}
              </a>

              <a 
                v-if="component.sourceUrl"
                :href="component.sourceUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                {{ t('components.sourceLink') }}
              </a>
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-end space-x-2 pt-3 mt-4 border-t border-gray-100 dark:border-gray-700">
              <BaseButton
                size="sm"
                variant="secondary"
                class="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                @click="emit('edit', component)"
              >
                <template #icon>
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </template>
                {{ t('common.edit') }}
              </BaseButton>
              <BaseButton
                size="sm"
                variant="danger"
                class="hover:bg-red-600 transition-colors duration-200"
                @click="emit('delete', component)"
              >
                <template #icon>
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </template>
                {{ t('common.delete') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <BaseModal
      :show="showTypeSelector"
      :title="t('components.addFirst')"
      @close="showTypeSelector = false"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseButton
          v-for="type in componentTypes"
          :key="type._id"
          variant="secondary"
          class="w-full text-left px-4 py-3"
          @click="handleTypeSelect(type._id)"
        >
          <span class="mr-2">{{ componentIcons[type._id] }}</span>
          {{ type.name }}
        </BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 100vh;
  margin: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 100vh;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: background-color 0.2s ease-in-out;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.dark .custom-scrollbar {
  scrollbar-color: #818cf8 transparent;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #818cf8;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6366f1;
}
</style>