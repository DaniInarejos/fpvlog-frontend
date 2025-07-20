<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (value) => value.every(tab => typeof tab.id === 'string' && typeof tab.label === 'string')
  },
  activeTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['tab-change'])

const handleTabChange = (tabId) => {
  emit('tab-change', tabId)
}
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <div class="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div class="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700 min-w-max">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabChange(tab.id)"
          :class="[
            'pb-4 px-4 text-sm font-medium whitespace-nowrap',
            activeTab === tab.id
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
  </div>
</template>