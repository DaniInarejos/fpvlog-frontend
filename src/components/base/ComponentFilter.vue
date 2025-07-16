<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'
import BaseButton from './BaseButton.vue'

const { t } = useI18n()

const props = defineProps({
  componentTypes: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:filters'])

const filters = ref({
  search: '',
  type: '',
  brand: ''
})

const clearFilters = () => {
  filters.value = {
    search: '',
    type: '',
    brand: ''
  }
}

watch(filters, (newFilters) => {
  emit('update:filters', newFilters)
}, { deep: true })
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
    <div class="flex flex-col space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BaseInput
          v-model="filters.search"
          :label="t('components.filter.search')"
          :placeholder="t('components.filter.searchPlaceholder')"
          class="w-full"
        />
        <BaseSelect
          v-model="filters.type"
          :options="componentTypes"
          :label="t('components.filter.type')"
          :placeholder="t('components.filter.typePlaceholder')"
          class="w-full"
        />
        <BaseInput
          v-model="filters.brand"
          :label="t('components.filter.brand')"
          :placeholder="t('components.filter.brandPlaceholder')"
          class="w-full"
        />
      </div>
      <div class="flex justify-end">
        <BaseButton
          variant="secondary"
          size="sm"
          @click="clearFilters"
          class="w-auto"
        >
          {{ t('components.filter.clear') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>