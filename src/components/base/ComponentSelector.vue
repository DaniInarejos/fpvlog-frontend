<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import componentService from '../../services/componentService'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: [String, Array],
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => [
      'frame',
      'motor',
      'flightController',
      'esc',
      'vtx',
      'camera',
      'antenna',
      'receiver',
      'battery',
      'props',
      'mount',
      'other'
    ].includes(value)
  },
  multiple: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const components = ref([])
const isLoading = ref(false)
const loadError = ref('')

const fetchComponents = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    const response = await componentService.getComponents()
    components.value = response.filter(comp => comp.type === props.type)
  } catch (error) {
    loadError.value = error.message
  } finally {
    isLoading.value = false
  }
}

const handleSelection = (event) => {
  if (props.multiple) {
    const value = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    if (event.target.checked) {
      value.push(event.target.value)
    } else {
      const index = value.indexOf(event.target.value)
      if (index > -1) value.splice(index, 1)
    }
    emit('update:modelValue', value)
  } else {
    emit('update:modelValue', event.target.value)
  }
}

onMounted(() => {
  fetchComponents()
})
</script>

<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ t(`message.components.types.${type}`) }}
    </label>
    
    <div v-if="isLoading" class="text-sm text-gray-500">
      {{ t('message.common.loading') }}
    </div>
    
    <div v-else-if="loadError" class="text-sm text-red-500">
      {{ loadError }}
    </div>
    
    <div v-else class="space-y-2">
      <template v-if="multiple">
        <div v-for="component in components" :key="component._id" class="flex items-center">
          <input
            type="checkbox"
            :id="component._id"
            :value="component._id"
            :checked="modelValue.includes(component._id)"
            @change="handleSelection"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          >
          <label :for="component._id" class="ml-2 block text-sm text-gray-900 dark:text-gray-100">
            {{ component.name }}
          </label>
        </div>
      </template>
      
      <template v-else>
        <select
          :value="modelValue"
          @change="$emit('update:modelValue', $event.target.value)"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="">{{ t('message.common.select') }}</option>
          <option
            v-for="component in components"
            :key="component._id"
            :value="component._id"
          >
            {{ component.name }}
          </option>
        </select>
      </template>
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>