<script setup>
import { ref, watch } from 'vue'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  fields: {
    type: Array,
    required: true,
    // [{ type: 'input|select', name: 'fieldName', label: 'Field Label', placeholder: 'Placeholder', options: [] }]
  }
})

const emit = defineEmits(['update:filters'])

const localFilters = ref({ ...props.filters })

const clearFilters = () => {
  Object.keys(localFilters.value).forEach(key => {
    localFilters.value[key] = ''
  })
}

watch(localFilters, (newFilters) => {
  emit('update:filters', newFilters)
}, { deep: true })

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>

<template>
  <div class="bg-blue-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <template v-for="field in fields" :key="field.name">
          <BaseInput
            v-if="field.type === 'input'"
            v-model="localFilters[field.name]"
            :label="field.label"
            :placeholder="field.placeholder"
            class="w-full"
          />
          <BaseSelect
            v-else-if="field.type === 'select'"
            v-model="localFilters[field.name]"
            :options="field.options"
            :label="field.label"
            :placeholder="field.placeholder"
            class="w-full"
          />
        </template>
      </div>
      <div class="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <BaseButton
          variant="secondary"
          size="sm"
          @click="clearFilters"
          class="w-auto hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </template>
          Limpiar filtros
        </BaseButton>
      </div>
    </div>
  </div>
</template>