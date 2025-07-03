<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseModal from '../base/BaseModal.vue'
import BaseScrollbar from '../base/BaseScrollbar.vue'

const props = defineProps({
  components: {
    type: Object,
    required: true
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

const emit = defineEmits(['create', 'delete', 'edit'])
const { t } = useI18n()
const showTypeSelector = ref(false)

const componentTypes = [
  { _id: 'FRAME', name: t('message.components.types.frame') },
  { _id: 'MOTOR', name: t('message.components.types.motor') },
  { _id: 'FC', name: t('message.components.types.flightController') },
  { _id: 'ESC', name: t('message.components.types.esc') },
  { _id: 'VTX', name: t('message.components.types.vtx') },
  { _id: 'CAMERA', name: t('message.components.types.camera') },
  { _id: 'ANTENNA', name: t('message.components.types.antenna') },
  { _id: 'RECEIVER', name: t('message.components.types.receiver') },
  { _id: 'BATTERY', name: t('message.components.types.battery') },
  { _id: 'PROPS', name: t('message.components.types.props') },
  { _id: 'MOUNT', name: t('message.components.types.mount') },
  { _id: 'OTHER', name: t('message.components.types.other') }
]

const handleTypeSelect = (typeId) => {
  emit('create', typeId)
  showTypeSelector.value = false
}

const componentIcons = {
  FRAME: '🧩',
  MOTOR: '⚙️',
  FC: '🧠',
  ESC: '🔌',
  VTX: '📡',
  CAMERA: '📷',
  ANTENNA: '📶',
  RECEIVER: '📥',
  BATTERY: '🔋',
  PROPS: '🪶',
  MOUNT: '🗜️',
  OTHER: '🧰'
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ t('message.components.title') }}</h1>
      <BaseButton
        variant="primary"
        @click="showTypeSelector = true"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </template>
        {{ t('message.components.addComponent') }}
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

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard 
        v-for="type in componentTypes" 
        :key="type._id"
        class="overflow-hidden"
      >
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              <span class="mr-2">{{ componentIcons[type._id] }}</span>
              {{ type.name }}
            </h3>
          </div>

          <div v-if="components[type._id].length === 0" class="text-center py-6">
            <p class="text-sm text-gray-500">{{ t('message.components.noComponentsOfType') }}</p>
          </div>

          <BaseScrollbar v-else>
            <div class="space-y-4">
              <div 
                v-for="component in components[type._id]" 
                :key="component._id"
                class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-gray-100">
                    <a 
                      v-if="component.sourceUrl" 
                      :href="component.sourceUrl" 
                      target="_blank"
                      class="hover:text-primary-600 transition-colors"
                    >
                      {{ component.name }}
                    </a>
                    <span v-else>{{ component.name }}</span>
                  </h4>
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span v-if="component.brand">{{ component.brand }}</span>
                    <span v-if="component.weightGrams">{{ component.weightGrams }}g</span>
                  </div>
                </div>

                <div class="flex gap-2">
                  <BaseButton
                    size="sm"
                    variant="secondary"
                    @click="emit('edit', component)"
                  >
                    <template #icon>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </template>
                    {{ t('message.common.edit') }}
                  </BaseButton>
                  <BaseButton
                    size="sm"
                    variant="danger"
                    @click="emit('delete', component)"
                  >
                    {{ t('message.common.delete') }}
                  </BaseButton>
                </div>
              </div>
            </div>
          </BaseScrollbar>
        </div>
      </BaseCard>
    </div>

    <BaseModal
      :show="showTypeSelector"
      :title="t('message.components.selectType')"
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